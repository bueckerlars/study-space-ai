import { Request, Response } from 'express';
import sourceService from '../services/SourceService';
import logger from '../services/logger';
import fileController from './FileController';
import ocrController from './OcrController';
import ollamaService from '../services/OllamaService';
import ocrService from '../services/OcrService';

class SourceController {
  /**
   * Create a new source
   * POST /api/sources
   */
  public async createSource(req: Request, res: Response): Promise<void> {
    try {
      const sourceData = req.body;
      logger.info(`Creating source with data: ${JSON.stringify(sourceData)}`);
      const newSource = await sourceService.createSource(sourceData);
      
      res.status(201).json({
        success: true,
        data: newSource
      });
    } catch (error) {
      logger.error(`Error in createSource controller: ${error instanceof Error ? error.message : String(error)}`);
      res.status(500).json({
        success: false,
        message: 'Failed to create source',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * Get all sources
   * GET /api/sources
   */
  public async getAllSources(req: Request, res: Response): Promise<void> {
    try {
      logger.info(`Fetching all sources`);
      const sources = await sourceService.getAllSources();
      
      res.status(200).json({
        success: true,
        count: sources.length,
        data: sources
      });
    } catch (error) {
      logger.error(`Error in getAllSources controller: ${error instanceof Error ? error.message : String(error)}`);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch sources',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * Get source by ID
   * GET /api/sources/:id
   */
  public async getSourceById(req: Request, res: Response): Promise<void> {
    try {
      const source_id = req.params.source_id;
      logger.info(`Fetching source by id: ${source_id}`);
      const source = await sourceService.getSourceById(source_id);
      
      if (!source) {
        res.status(404).json({
          success: false,
          message: `Source with ID ${source_id} not found`
        });
        return;
      }

      // Check status of source and start ocr / summary if needed
      if (source.status === 'uploaded') {
        ocrService.processOcr(source.source_id);
      }

      if (source.status === "processed") {
        ollamaService.summarize(source.source_id);
      }

      res.status(200).json({
        success: true,
        data: source
      });
    } catch (error) {
      logger.error(`Error in getSourceById controller: ${error instanceof Error ? error.message : String(error)}`);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch source',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * Get sources by status
   * GET /api/sources/status/:status
   */
  public async getSourcesByStatus(req: Request, res: Response): Promise<void> {
    try {
      const status = req.params.status;
      logger.info(`Fetching sources by status: ${status}`);
      const sources = await sourceService.getSourcesByStatus(status);
      
      res.status(200).json({
        success: true,
        count: sources.length,
        data: sources
      });
    } catch (error) {
      logger.error(`Error in getSourcesByStatus controller: ${error instanceof Error ? error.message : String(error)}`);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch sources by status',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * Get sources by project ID
   * GET /api/sources/project/:projectId
   */
  public async getSourcesByProject(req: Request, res: Response): Promise<void> {
    try {
      const projectId = req.params.projectId;
      logger.info(`Fetching sources by project id: ${projectId}`);
      const sources = await sourceService.getSourcesByProject(projectId);

      let sourcesSummarized = true;
      sources.forEach(source => {
        if (source.status !== 'summarized') {
          sourcesSummarized = false;
          return;
        }
        ollamaService.summarizeProject(projectId);
        ollamaService.generateProjectTitle(projectId);
      });
      
      res.status(200).json({
        success: true,
        count: sources.length,
        data: sources
      });
    } catch (error) {
      logger.error(`Error in getSourcesByProject controller: ${error instanceof Error ? error.message : String(error)}`);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch sources by project',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * Update a source
   * PUT /api/sources/:id
   */
  public async updateSource(req: Request, res: Response): Promise<void> {
    try {
      const source_id = req.params.source_id;
      logger.info(`Updating source with id: ${source_id}`);
      const sourceData = req.body;
      
      const updatedSource = await sourceService.updateSource(source_id, sourceData);
      
      if (!updatedSource) {
        res.status(404).json({
          success: false,
          message: `Source with ID ${source_id} not found`
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: updatedSource
      });
    } catch (error) {
      logger.error(`Error in updateSource controller: ${error instanceof Error ? error.message : String(error)}`);
      res.status(500).json({
        success: false,
        message: 'Failed to update source',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * Update source status
   * PATCH /api/sources/:id/status
   */
  public async updateSourceStatus(req: Request, res: Response): Promise<void> {
    try {
      const source_id = req.params.source_id;
      logger.info(`Updating status for source id: ${source_id}`);
      const { status } = req.body;
      
      if (!status) {
        res.status(400).json({
          success: false,
          message: 'Status is required'
        });
        return;
      }
      
      const updatedSource = await sourceService.updateSourceStatus(source_id, status);
      
      if (!updatedSource) {
        res.status(404).json({
          success: false,
          message: `Source with ID ${source_id} not found`
        });
        return;
      }
      
      res.status(200).json({
        success: true,
        data: updatedSource
      });
    } catch (error) {
      logger.error(`Error in updateSourceStatus controller: ${error instanceof Error ? error.message : String(error)}`);
      res.status(500).json({
        success: false,
        message: 'Failed to update source status',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  /**
   * Delete a source
   * DELETE /api/sources/:id
   */
  public async deleteSource(req: Request, res: Response): Promise<void> {
    try {
      const source_id = req.params.source_id;
      logger.info(`Deleting source with id: ${source_id}`);
      
      // Delete linked files before deleting the source
      const source = await sourceService.getSourceById(source_id);
      
      if (!source) {
        res.status(404).json({
          success: false,
          message: `Source with ID ${source_id} not found`
        });
        return;
      }
      await fileController.deleteFilesBySource(source);
      
      // Delete the source  
      const result = await sourceService.deleteSource(source_id);
      
      if (!result) {
        res.status(404).json({
          success: false,
          message: `Source with ID ${source_id} not found`
        });
        return;
      }
      
      res.status(200).json({
        success: true,
        message: `Source with ID ${source_id} successfully deleted`
      });
    } catch (error) {
      logger.error(`Error in deleteSource controller: ${error instanceof Error ? error.message : String(error)}`);
      res.status(500).json({
        success: false,
        message: 'Failed to delete source',
        error: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }
  
  public async processOcr(req: Request, res: Response): Promise<void> {
    try {
      ocrController.processOcr(req, res);
    } catch (error) {
      res.status(500).json({ success: false, message: 'OCR Verarbeitung fehlgeschlagen' });
    }
  }
}

// Create singleton instance
const sourceController = new SourceController();
export default sourceController;
