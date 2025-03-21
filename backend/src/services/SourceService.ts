import { v4 as uuidv4 } from 'uuid';
import databaseController from '../controllers/DatabaseController';
import logger from './logger';
import { Source } from '../types/Source';

class SourceService {
  /**
   * Create a new source
   */
  public async createSource(sourceData: Partial<Source>): Promise<Source | null> {
    try {
      // Generate ID if not provided
      if (!sourceData.source_id) {
        sourceData.source_id = uuidv4();
      }
      
      // Set default status if not provided
      if (!sourceData.status) {
        sourceData.status = 'pending';
      }
      
      // Set creation timestamp
      sourceData.created_at = new Date();
      sourceData.updated_at = new Date();
      
      logger.info(`Creating new source with ID: ${sourceData.source_id}`);
      return await databaseController.createSource(sourceData);
    } catch (error) {
      logger.error(`Error creating source: ${error instanceof Error ? error.message : String(error)}`);
      throw error;
    }
  }

  /**
   * Get all sources
   */
  public async getAllSources(): Promise<Source[]> {
    try {
      logger.info('Fetching all sources');
      return await databaseController.findAllSources();
    } catch (error) {
      logger.error(`Error fetching all sources: ${error instanceof Error ? error.message : String(error)}`);
      throw error;
    }
  }

  /**
   * Get source by ID
   */
  public async getSourceById(id: string): Promise<Source | null> {
    try {
      logger.info(`Fetching source with ID: ${id}`);
      return await databaseController.findSourceById(id);
    } catch (error) {
      logger.error(`Error fetching source by ID: ${error instanceof Error ? error.message : String(error)}`);
      throw error;
    }
  }

  /**
   * Get sources by status
   */
  public async getSourcesByStatus(status: string): Promise<Source[]> {
    try {
      logger.info(`Fetching sources with status: ${status}`);
      return await databaseController.findSourcesByStatus(status);
    } catch (error) {
      logger.error(`Error fetching sources by status: ${error instanceof Error ? error.message : String(error)}`);
      throw error;
    }
  }

  /**
   * Get sources by project ID
   */
  public async getSourcesByProject(projectId: string): Promise<Source[]> {
    try {
      logger.info(`Fetching sources for project: ${projectId}`);
      return await databaseController.findSourcesByProject(projectId);
    } catch (error) {
      logger.error(`Error fetching sources by project: ${error instanceof Error ? error.message : String(error)}`);
      throw error;
    }
  }

  /**
   * Update a source
   */
  public async updateSource(source_id: string, sourceData: Partial<Source>): Promise<Source | null> {
    try {
      logger.info(`Updating source with ID: ${source_id}`);
      
      // Set update timestamp
      sourceData.updated_at = new Date();
      
      await databaseController.updateSource(sourceData, { source_id });
      return await this.getSourceById(source_id);
    } catch (error) {
      logger.error(`Error updating source: ${error instanceof Error ? error.message : String(error)}`);
      throw error;
    }
  }

  /**
   * Delete a source
   */
  public async deleteSource(source_id: string): Promise<boolean> {
    try {
      logger.info(`Deleting source with ID: ${source_id}`);
      const deletedCount = await databaseController.deleteSource({ source_id });
      return deletedCount > 0;
    } catch (error) {
      logger.error(`Error deleting source: ${error instanceof Error ? error.message : String(error)}`);
      throw error;
    }
  }

  /**
   * Update source status
   */
  public async updateSourceStatus(source_id: string, status: string): Promise<Source | null> {
    try {
      logger.info(`Updating status of source ${source_id} to ${status}`);
      return await this.updateSource(source_id, { status });
    } catch (error) {
      logger.error(`Error updating source status: ${error instanceof Error ? error.message : String(error)}`);
      throw error;
    }
  }
}

// Create singleton instance
const sourceService = new SourceService();
export default sourceService;
