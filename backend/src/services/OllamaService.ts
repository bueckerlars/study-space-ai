import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import fileService from './FileService';
import { databaseController } from '../controllers/DatabaseController';
import logger from './logger';
import axios from 'axios';
import sourceService from './SourceService';

class OllamaService {
  async summarize(sourceId: string): Promise<{ summary_file_id: string; summary: string }> {
    logger.info(`Starting summarization process for source: ${sourceId}`); 

    // Retrieve source and check text file
    const source = await databaseController.findSourceById(sourceId);
    if (!source || !source.text_file_id) {
      logger.error(`Source or text file missing for source id: ${sourceId}`); 
      throw new Error(`Source or text file not found for source id: ${sourceId}`);
    }
    
    // Read original text file
    const file = await databaseController.findFileById(source.text_file_id);
    if (!file) {
      logger.error(`Text file not found for source id: ${sourceId}`); 
      throw new Error(`Text file not found for source id: ${sourceId}`);
    }
    const textFilePath = file.url;
    logger.debug(`Reading text file from: ${textFilePath}`);
    const textContent = fs.readFileSync(textFilePath, 'utf8');
    
    // Generate summary using Ollama API (according to the docs)
    logger.info(`Sending text to Ollama API for summarization`); 
    const ollamaApiUrl = process.env.OLLAMA_API_URL || 'http://localhost:11434';
    const apiResponse = await axios.post(`${ollamaApiUrl}/api/generate`, {
      model: 'llama3.2',
      prompt: `Fasse folgenden Text zusammen. Schreibe zuerst eine kurze Zusammenfassung in einem Fließttext und Fasse dann alle Kernaussagen in Stichpunkten zusammen:\n\n${textContent}`,
      stream: false
    });
    console.log("Ollam API Response: " + apiResponse);
    const summary = apiResponse.data.response
    logger.debug(`Received summary from API: ${summary.substring(0, 50)}...`); 
    
    // Create summary file
    const summaryFileId = `${uuidv4()}`;
    const summaryFilePath = path.join(process.cwd(), 'uploads', summaryFileId + ".txt");
    logger.info(`Writing summary to file: ${summaryFilePath}`);
    fs.writeFileSync(summaryFilePath, summary, 'utf8');
    
    // Update source with summary file id and status "summarized"
    source.summary_file_id = summaryFileId;
    source.status = 'summarized';
    await sourceService.updateSource(sourceId, source);
    logger.info(`Updated source ${sourceId} with summary file ${summaryFileId}`);

    logger.info(`Summarized source ${sourceId} and created summary file ${summaryFileId}`);
    return { summary_file_id: summaryFileId, summary };
  }
}

const ollamaService = new OllamaService();
export default ollamaService;
