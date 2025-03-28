import { Request, Response } from 'express';
import ollamaService from '../services/OllamaService';
import logger from '../services/logger';
import databaseService from '../services/databaseService';
import databaseController from './DatabaseController';

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

  public async summarizeProject(req: Request, res: Response): Promise<void> {
    const projectId = req.params.project_id;
    logger.info(`Received request to summarize project: ${projectId}`);
    try {
      const result = await ollamaService.summarizeProject(projectId);
      logger.info(`Project ${projectId} summarized successfully`);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      logger.error(`Error in summarizeProject: ${error instanceof Error ? error.message : String(error)}`);
      res.status(500).json({ success: false, message: 'Failed to summarize project' });
    }
  }

  public async chat(req: Request, res: Response): Promise<void> {
    logger.info('Received chat request');
    try {
      const { messages, sources } = req.body;
      if (!messages || !Array.isArray(messages)) {
        logger.warn('Chat request missing or invalid messages array');
        res.status(400).json({ success: false, message: 'Messages array is required and must be valid' });
        return;
      }

      if (!sources || !Array.isArray(sources)) {
        logger.warn('Chat request missing or invalid sources array');
        res.status(400).json({ success: false, message: 'Sources array is required and must be valid' });
        return;
      }

      const lastUserMessage = messages.reverse().find((msg: { role: string }) => msg.role === 'user');
      if (!lastUserMessage) {
        logger.warn('No user message found in chat context');
        res.status(400).json({ success: false, message: 'At least one user message is required' });
        return;
      }

      // Generate embeddings for the last user message
      const embeddings = await ollamaService.generateEmbeddings(lastUserMessage.content);

      // Find the most relevant sources based on embeddings
      const relevantSources = await databaseController.findRelevantSources(embeddings, sources);

      // Extract text content from relevant sources
      const contextMessages = [];
      for (const source of relevantSources) {
        if (!messages.some((msg: { role: string; content: string }) => msg.content.includes(source.source_id))) {
          if (!source.text_file_id) {
            logger.error(`Source ${source.source_id} has no text_file_id`);
            continue;
          }
          const file = await databaseController.findFileById(source.text_file_id);
          if (file) {
            const textContent = file.url ? await databaseController.readFileContent(file.url) : '';
            contextMessages.push({
              role: 'system',
              content: `Kontext aus Quelle (${source.source_id}): ${textContent}`
            });
          }
        }
      }

      // Add context messages to the chat
      const updatedMessages = [...contextMessages, ...messages];

      // Send the updated messages to the chat service
      const response = await ollamaService.chat(updatedMessages);
      logger.info('Chat response received successfully');
      res.status(200).json({ success: true, data: response });
    } catch (error) {
      logger.error(`Error in chat: ${error instanceof Error ? error.message : String(error)}`);
      res.status(500).json({ success: false, message: 'Failed to process chat request' });
    }
  }
}

const ollamaController = new OllamaController();
export default ollamaController;
