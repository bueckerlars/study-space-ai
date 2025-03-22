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
		try {
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
			
			// Berechne outputPath
			const outputFilename = path.basename(sourceFilePath, path.extname(sourceFilePath)) + '_ocr.txt';
			const outputPath = path.join(path.dirname(sourceFilePath), outputFilename);
			
			// Führe ocr.py aus mit PDF-Dateipfad, Sprache "de" und output Pfad
			const pythonScript = path.join(__dirname, '../../../src/python-scripts/ocr.py');
			const command = `python3 ${pythonScript} ${sourceFilePath} "de" --output "${outputPath}" --no-multithreading`;
			logger.info(`Executing OCR command: ${command}`);
			logger.debug(`Starting execution with increased maxBuffer (10MB) for source_id: ${source_id}`);
			const { stdout, stderr } = await execPromise(command, { maxBuffer: 1024 * 1024 * 10 });
			logger.debug(`Command executed. stdout length: ${stdout.length}, stderr length: ${stderr ? stderr.length : 0}`);
			if (stderr) {
				throw new Error(stderr);
			}
			// Lese den vom Skript ausgegebenen absoluten Output-Pfad
			const ocrOutputPath = stdout.trim();
			logger.info(`OCR output written to ${ocrOutputPath}`);
			
			// Erstelle neuen File-Eintrag für die OCR-Ausgabe basierend auf dem vom Skript erzeugten File
			const ocrFileData = {
				file_id: uuidv4(),
				user_id: sourceFile.user_id,
				project_id: sourceFile.project_id,
				name: outputFilename,
				size: fs.statSync(ocrOutputPath).size,
				type: 'text/plain',
				url: ocrOutputPath,
				createdAt: new Date(),
				updatedAt: new Date()
			};
			const newFile = await fileController.createFileRecord(ocrFileData);
			if (!newFile) {
				throw new Error('Erstellung des OCR File-Eintrags fehlgeschlagen');
			}
			// Aktualisiere Source mit text_file_id
			await databaseController.updateSource({ text_file_id: newFile.file_id }, { source_id });
			logger.info(`OCR processing complete. New file created with id ${newFile.file_id}`);
			const updatedSource = await databaseController.findSourceById(source_id);
			return updatedSource;
		} catch (error: any) {
			logger.error(`Error during OCR processing for source_id: ${source_id} - ${error.message}`);
			throw error;
		}
	}
}

const ocrService = new OcrService();
export default ocrService;
