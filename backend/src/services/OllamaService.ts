import fs, { fdatasync } from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import fileService from './FileService';
import { databaseController } from '../controllers/DatabaseController';
import logger from './logger';
import axios from 'axios';
import sourceService from './SourceService';
import ProjectsService from './ProjectsService';

class OllamaService {
  async summarize(sourceId: string): Promise<{ summary_file_id: string; summary: string }> {
    logger.info(`Starting summarization process for source: ${sourceId}`); 
    
    // Retrieve source and check text file
    var source = await databaseController.findSourceById(sourceId);
    if (!source || !source.text_file_id) {
      logger.error(`Source or text file missing for source id: ${sourceId}`); 
      throw new Error(`Source or text file not found for source id: ${sourceId}`);
    }

    if (source.status === "summarized" || source.status === "summarizing") {
      logger.error(`Source already summarized or summarizing: ${sourceId}`);
      throw new Error(`Source already summarized or summarizing: ${sourceId}`);
    }
  
    // Upadte source status to "summarizing"
    await sourceService.updateSourceStatus(sourceId, 'summarizing');
    logger.info(`Updated source ${sourceId} status to "summarizing"`);
    
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
    const prompt: string = `Bitte fasse das folgende Dokument in maximal 10 Sätzen zusammen und extrahiere die wichtigsten Informationen und Kernaussagen.
      \n
      ${textContent}
      \n
      Die Zusammenfassung sollte folgende Eigenschaften aufweisen: \n

      * **Prägnant:** Die wichtigsten Punkte auf den Punkt gebracht.
      * **Informativ:** Die zentralen Themen und Argumente des Dokuments abdecken.
      * **Kohärent:** Die Zusammenfassung sollte einen klaren und logischen Fluss haben.
      * **Objektiv:** Die ursprüngliche Bedeutung des Dokuments beibehalten, ohne eigene Interpretationen oder Meinungen einzufügen.

      Optional (füge diese Anweisungen hinzu, wenn sie relevant sind): \n

      * **Fokus auf:** [Optional: Hier einen spezifischen Fokus angeben, z.B. "die wichtigsten Schlussfolgerungen", "die beschriebenen Methoden", "die Auswirkungen der Ergebnisse"].
      * **Zielgruppe:** [Optional: Hier eine Zielgruppe angeben, z.B. "für ein technisches Publikum", "für ein allgemeines Publikum"].
      * **Schlüsselwörter:** [Optional: Bitte liste auch die wichtigsten Schlüsselwörter auf, die im Dokument vorkommen].
      \n
      Beginne die Zusammenfassung mit einem einleitenden Satz, der das Hauptthema des Dokuments zusammenfasst.`
    const ollamaApiUrl = process.env.OLLAMA_API_URL || 'http://localhost:11434';
    const apiResponse = await axios.post(`${ollamaApiUrl}/api/generate`, {
      model: 'llama3.2',
      options: {
        system: "Du bist ein erfahrener Assistent für die Dokumentenanalyse und -zusammenfassung. Deine Aufgabe ist es, prägnante und informative Zusammenfassungen von Textdokumenten zu erstellen."
      },
      prompt: prompt,
      stream: false
    });
    const summary = apiResponse.data.response
    logger.debug(`Received summary from API: ${summary.substring(0, 50)}...`); 
    
    // Create summary file
    const summaryFileId = `${uuidv4()}`;
    const summaryFilePath = path.join(process.cwd(), 'uploads', summaryFileId + "_summary.txt");
    logger.info(`Writing summary to file: ${summaryFilePath}`);
    fs.writeFileSync(summaryFilePath, summary, 'utf8');

    await databaseController.createFile(
      {
        file_id: summaryFileId,
        user_id:file.user_id,
        name: summaryFileId + '_summary.txt',
        url: summaryFilePath,
        type: 'text/plain',
        size: fs.statSync(summaryFilePath).size,
      }
    );

    const themeResponse = await axios.post(`${ollamaApiUrl}/api/generate`, {
      model: "deepseek-r1:8b",
      options: {
          system: "Du bist ein hilfreicher Assistent, der Kerninformationen aus Dokumenten extrahiert.",
      },
      stream: false,
      prompt: "Extrahiere die Hauptthemen und Kernaussagen aus dem folgenden Text in jeweils 1 bis 3 Wörten und gib sie als JSON Array von Strings zurück.\n\nText: " + textContent +  "\n\nJSON Array der Themen:",
      format: {
          type: "object",
          properties: {
              themes: {
                  type: "array",
                  items: {
                      type: "string",
                  }
              }
          },
          "required": ["themes"]
      }
    });
    // Erhalte Rohdaten und parse diese, falls es ein JSON-String ist
    const rawThemes = themeResponse.data.response;
    logger.debug(`Received themes from API: ${typeof rawThemes === 'string' ? rawThemes.substring(0, 50) : '...'}...`);
    const parsedThemes = typeof rawThemes === 'string' ? JSON.parse(rawThemes) : rawThemes;
    logger.debug("Themes: " + parsedThemes.themes);
    const themes: string[] = parsedThemes.themes;
    if (!themes) {
      logger.error(`No themes found in summary for source id: ${sourceId}`);
      throw new Error(`No themes found in summary for source id: ${sourceId}`);
    }
    
    // Update source with summary file id and status "summarized"
    await sourceService.updateSource(sourceId, { summary_file_id: summaryFileId, themes: themes, status: 'summarized' });
    logger.info(`Updated source ${sourceId} with summary file ${summaryFileId}`);

    logger.info(`Summarized source ${sourceId} and created summary file ${summaryFileId}`);
    return { summary_file_id: summaryFileId, summary };
  }

  async generateProjectTitle(projectId: string): Promise<string> {
    logger.info(`Starting title generation for project: ${projectId}`);
    const sources = await ProjectsService.getProjectSources(projectId);
    const themes: string[] = [];
    sources.forEach(source => {
      if (source.themes && Array.isArray(source.themes)) {
        logger.debug(`Source ${source.source_id} has themes: ${source.themes.join(', ')}`);
        themes.push(...source.themes);
      }
    });
    const uniqueThemes = Array.from(new Set(themes));
    logger.debug(`Collected themes: ${uniqueThemes.join(', ')}`);
    const prompt = `Angesichts der folgenden Themen: ${uniqueThemes.join(', ')}, generiere einen prägnanten und beschreibenden Projekttitel auf Deutsch. Der Titel darf maxiaml 128 Zeichen lang sein.`;
    const ollamaApiUrl = process.env.OLLAMA_API_URL || 'http://localhost:11434';
    logger.info(`Sending prompt to Ollama API for project title generation`);
    const apiResponse = await axios.post(`${ollamaApiUrl}/api/generate`, {
      model: 'deepseek-r1:8b',
      options: {
      system: "You are a creative assistant that generates project titles based on provided themes that are not longer than 128 chars."
      },
      prompt: prompt,
      stream: false,
      format: {
      type: "object",
      properties: {
        title: {
          type: "string",
        },
      },
      required: [
        "title",
      ]
    }
    });
    const titleResponse = apiResponse.data.response;
    const parsedTitle = typeof titleResponse === 'string' ? JSON.parse(titleResponse) : titleResponse;
    logger.debug(`Received project title: ${parsedTitle}`);
    const title = parsedTitle.title;
    await ProjectsService.updateProject(projectId, { name: title });
    logger.info(`Updated project ${projectId} with title: ${title}`);
    return title;
  }


}

const ollamaService = new OllamaService();
export default ollamaService;
