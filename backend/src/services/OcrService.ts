import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import databaseController from '../controllers/DatabaseController';
import fileController from '../controllers/FileController';
import fileService from './FileService';
import logger from '../services/logger';
import FormData from 'form-data';

// Get OCR service URL from environment variable or use default
const OCR_SERVICE_URL = process.env.OCR_SERVICE_URL || 'http://localhost:8000';

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
			
			// Prepare FormData for API request
			const formData = new FormData();
			formData.append('file', fs.createReadStream(sourceFilePath));
			formData.append('language', 'de'); // Default language German
			formData.append('use_multithreading', 'true');
			formData.append('allow_ocr', 'true');
			
			logger.info(`Sending PDF file to OCR service at ${OCR_SERVICE_URL}/ocr`);
			
			// Call the OCR service API using the regular OCR endpoint that returns text directly
			const response = await axios.post(`${OCR_SERVICE_URL}/ocr`, formData, {
				headers: {
					...formData.getHeaders(),
				},
				maxBodyLength: Infinity,
				maxContentLength: Infinity,
			});
			
			if (!response.data || response.data.error) {
				throw new Error(`OCR service error: ${response.data?.error || 'Unknown error'}`);
			}
			
			logger.info(`OCR processing successful. Received text content.`);
			
			// Get OCR content directly from the response
			const ocrContent = response.data.text;
			
			// Create output directory if it doesn't exist
			const outputDir = path.dirname(sourceFilePath);
			const outputFilename = `${path.basename(sourceFilePath, path.extname(sourceFilePath))}_ocr.txt`;
			const localOutputPath = path.join(outputDir, outputFilename);
			
			// Save the OCR content to a local file
			fs.writeFileSync(localOutputPath, ocrContent);
			
			// Erstelle neuen File-Eintrag für die OCR-Ausgabe
			const ocrFileData = {
				file_id: uuidv4(),
				user_id: sourceFile.user_id,
				project_id: sourceFile.project_id,
				name: outputFilename,
				size: fs.statSync(localOutputPath).size,
				type: 'text/plain',
				url: localOutputPath,
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
