import { Request, Response } from 'express';
import ollamaService from '../services/OllamaService';
import logger from '../services/logger';

class OllamaController {
  public async summarize(req: Request, res: Response): Promise<void> {
    logger.info('Received request for summarization'); // added logging
    try {
      const source_id = req.params.source_id;
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

  public async generateProjectTitle(req: Request, res: Response): Promise<void> {
    const projectId = req.params.project_id;
    logger.info(`Received request to generate title for project: ${projectId}`);
    try {
      const title = await ollamaService.generateProjectTitle(projectId);
      logger.info(`Generated title for project ${projectId}: ${title}`);
      res.status(200).json({ success: true, title });
    } catch (error) {
      logger.error(`Error generating project title: ${error instanceof Error ? error.message : String(error)}`);
      res.status(500).json({ success: false, message: 'Failed to generate project title' });
    }
  }

  public async getModels(req: Request, res: Response): Promise<void> {
    logger.info("Received request to fetch available models");
    try {
      const models = await ollamaService.getModels();
      res.status(200).json({ success: true, data: models });
    } catch (error) {
      logger.error(`Error fetching models: ${error instanceof Error ? error.message : String(error)}`);
      res.status(500).json({ success: false, message: 'Failed to fetch models' });
    }
  }
}

const ollamaController = new OllamaController();
export default ollamaController;
