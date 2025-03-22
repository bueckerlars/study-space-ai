import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import fileService from './FileService';
import { databaseController } from '../controllers/DatabaseController';
import logger from './logger';
import axios from 'axios';

class OllamaService {
  async summarize(sourceId: string): Promise<{ summary_file_id: string; summary: string }> {
    logger.info(`Starting summarization process for source: ${sourceId}`); // added logging

    // Retrieve source and check text file
    const source = await databaseController.findSourceById(sourceId);
    if (!source || !source.text_file_id) {
      logger.error(`Source or text file missing for source id: ${sourceId}`); // added logging
      throw new Error(`Source or text file not found for source id: ${sourceId}`);
    }
    
    // Read original text file
    const textFilePath = fileService.getFilePath(source.text_file_id);
    logger.debug(`Reading text file from: ${textFilePath}`); // added logging
    const textContent = fs.readFileSync(textFilePath, 'utf8');
    
    // Generate summary using Ollama API (according to the docs)
    logger.info(`Sending text to Ollama API for summarization`); // added logging
    const ollamaApiUrl = process.env.OLLAMA_API_URL || 'http://localhost:11434';
    const apiResponse = await axios.post(`${ollamaApiUrl}/generate`, {
      model: 'llama3',
      prompt: `Fasse folgenden Text zusammen:\n\n${textContent}`
    });
    const summary = apiResponse.data.completion;
    logger.debug(`Received summary from API: ${summary.substring(0, 50)}...`); // added logging with partial preview
    
    // Create summary file
    const summaryFileId = `${uuidv4()}.txt`;
    const summaryFilePath = path.join(process.cwd(), 'uploads', summaryFileId);
    logger.info(`Writing summary to file: ${summaryFilePath}`); // added logging
    fs.writeFileSync(summaryFilePath, summary, 'utf8');
    
    // Update source with summary file id and status "summarized"
    await databaseController.updateSource(
      { summary_file_id: summaryFileId, status: 'summarized' },
      { source_id: sourceId }
    );
    logger.info(`Updated source ${sourceId} with summary file ${summaryFileId}`);

    logger.info(`Summarized source ${sourceId} and created summary file ${summaryFileId}`);
    return { summary_file_id: summaryFileId, summary };
  }
}

const ollamaService = new OllamaService();
export default ollamaService;
