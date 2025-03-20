import { Request, Response } from 'express';
import sourceService from '../services/SourceService';
import logger from '../services/logger';

class SourceController {
  /**
   * Create a new source
   * POST /api/sources
   */
  public async createSource(req: Request, res: Response): Promise<void> {
    try {
      const sourceData = req.body;
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
      const id = req.params.id;
      const source = await sourceService.getSourceById(id);
      
      if (!source) {
        res.status(404).json({
          success: false,
          message: `Source with ID ${id} not found`
        });
        return;
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
   * Update a source
   * PUT /api/sources/:id
   */
  public async updateSource(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id;
      const sourceData = req.body;
      
      const updatedSource = await sourceService.updateSource(id, sourceData);
      
      if (!updatedSource) {
        res.status(404).json({
          success: false,
          message: `Source with ID ${id} not found`
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
      const id = req.params.id;
      const { status } = req.body;
      
      if (!status) {
        res.status(400).json({
          success: false,
          message: 'Status is required'
        });
        return;
      }
      
      const updatedSource = await sourceService.updateSourceStatus(id, status);
      
      if (!updatedSource) {
        res.status(404).json({
          success: false,
          message: `Source with ID ${id} not found`
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
      const id = req.params.id;
      const result = await sourceService.deleteSource(id);
      
      if (!result) {
        res.status(404).json({
          success: false,
          message: `Source with ID ${id} not found`
        });
        return;
      }
      
      res.status(200).json({
        success: true,
        message: `Source with ID ${id} successfully deleted`
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
}

// Create singleton instance
const sourceController = new SourceController();
export default sourceController;
