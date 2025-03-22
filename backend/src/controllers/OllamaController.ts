import { Request, Response } from 'express';
import ollamaService from '../services/OllamaService';
import logger from '../services/logger';

class OllamaController {
  public async summarize(req: Request, res: Response): Promise<void> {
    logger.info('Received request for summarization'); // added logging
    try {
      const { source_id } = req.body;
      if (!source_id) {
        logger.warn('Summarize request missing source_id'); // added logging
        res.status(400).json({ success: false, message: 'source_id is required' });
        return;
      }
      const result = await ollamaService.summarize(source_id);
      logger.info(`Summarization completed for source ${source_id}`); // added logging
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      logger.error(`Error in summarize: ${error instanceof Error ? error.message : String(error)}`);
      res.status(500).json({ success: false, message: 'Failed to summarize source' });
    }
  }
}

const ollamaController = new OllamaController();
export default ollamaController;
