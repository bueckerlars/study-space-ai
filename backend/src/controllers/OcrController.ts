import { Request, Response } from 'express';
import ocrService from '../services/OcrService';
import logger from '../services/logger';

class OcrController {
	async processOcr(req: Request, res: Response): Promise<void> {
		try {
			logger.info(`OcrController: Received request to process OCR for source_id: ${req.params.source_id}`);
			const source_id = req.params.source_id;
			const updatedSource = await ocrService.processOcr(source_id);
			logger.info(`OcrController: Successfully processed OCR for source_id: ${source_id}`);
			res.status(200).json({
				success: true,
				data: updatedSource
			});
		} catch (error) {
			logger.error(`Error in processOcr: ${error instanceof Error ? error.message : String(error)}`);
			res.status(500).json({
				success: false,
				message: 'OCR Verarbeitung fehlgeschlagen',
				error: error instanceof Error ? error.message : 'Unbekannter Fehler'
			});
		}
	}
}

const ocrController = new OcrController();
export default ocrController;
