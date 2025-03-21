import { exec } from 'child_process';
import util from 'util';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import databaseController from '../controllers/DatabaseController';
import fileController from '../controllers/FileController';
import fileService from './FileService'; // bestehende Hilfsfunktionen
import logger from '../services/logger';  // Neuer Import für Logging
const execPromise = util.promisify(exec);

class OcrService {
	async processOcr(source_id: string): Promise<any> {
		logger.info(`Start processing OCR for source_id: ${source_id}`);
		// Hole Source und zugehörige File
		const source = await databaseController.findSourceById(source_id);
		if (!source || !source.source_file_id) {
			throw new Error('Source oder source_file_id nicht gefunden');
		}
		const sourceFile = await databaseController.findFileById(source.source_file_id);
		if (!sourceFile) {
			throw new Error('Zugehöriger File-Eintrag nicht gefunden');
		}
		// Ermittle Dateipfad über FileService (Dateiname aus URL extrahieren)
		const filename = sourceFile.url.split('/').pop()!;
		const sourceFilePath = fileService.getFilePath(filename);
		
		// Führe ocr.py aus (Sprache hier "en" – anpassbar)
		const pythonScript = path.join(__dirname, '../python-scripts/ocr.py');
		const command = `python3 ${pythonScript} "${sourceFilePath}" "en" --no-progress`;
		logger.info(`Executing OCR command: ${command}`);
		const { stdout, stderr } = await execPromise(command);
		if (stderr) {
			throw new Error(stderr);
		}
		const extractedText = stdout.trim();
		logger.info(`OCR extraction complete`);

		// Schreibe den extrahierten Text in eine neue .txt Datei
		const outputFilename = path.basename(sourceFilePath, path.extname(sourceFilePath)) + '_ocr.txt';
		const outputDir = path.dirname(sourceFilePath);
		const outputPath = path.join(outputDir, outputFilename);
		fs.writeFileSync(outputPath, extractedText, 'utf8');
		logger.info(`Wrote OCR output to ${outputPath}`);
		
		// Erstelle neuen File-Eintrag für die OCR-Ausgabe
		const ocrFileData = {
			file_id: uuidv4(),
			user_id: sourceFile.user_id,
			project_id: sourceFile.project_id,
			name: outputFilename,
			size: fs.statSync(outputPath).size,
			type: 'text/plain',
			url: outputPath,
			createdAt: new Date(),
			updatedAt: new Date()
		};
		const newFile = await fileController.createFileRecord(ocrFileData);
		if (!newFile) {
			throw new Error('Erstellung des OCR File-Eintrags fehlgeschlagen');
		}
		// Aktualisiere Source mit ocr_file_id
		await databaseController.updateSource({ text_file_id: newFile.file_id }, { source_id });
		logger.info(`OCR processing complete. New file created with id ${newFile.file_id}`);
		const updatedSource = await databaseController.findSourceById(source_id);
		return updatedSource;
	}
}

const ocrService = new OcrService();
export default ocrService;
