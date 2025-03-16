import { FindOptions, WhereOptions } from 'sequelize';
import databaseController from '../controllers/DatabaseController';
import { Project } from '../types';
import logger from './logger';

class ProjectsService {
  /**
   * Create a new project
   */
  async createProject(projectData: Partial<Project>): Promise<Project | null> {
    try {
      return await databaseController.createProject(projectData);
    } catch (error) {
      logger.error(`Error creating project: ${error instanceof Error ? error.message : String(error)}`);
      throw error;
    }
  }

  /**
   * Get all projects with optional filters
   */
  async getProjects(options: FindOptions = {}): Promise<Project[]> {
    try {
      return await databaseController.findAllProjects(options);
    } catch (error) {
      logger.error(`Error fetching projects: ${error instanceof Error ? error.message : String(error)}`);
      throw error;
    }
  }

  /**
   * Get all projects for a specific user
   */
  async getUserProjects(userId: number): Promise<Project[]> {
    try {
      return await databaseController.findProjectsByUser(userId);
    } catch (error) {
      logger.error(`Error fetching user projects: ${error instanceof Error ? error.message : String(error)}`);
      throw error;
    }
  }

  /**
   * Get a project by ID
   */
  async getProjectById(id: number): Promise<Project | null> {
    try {
      return await databaseController.findProjectById(id);
    } catch (error) {
      logger.error(`Error fetching project by ID: ${error instanceof Error ? error.message : String(error)}`);
      throw error;
    }
  }

  /**
   * Update a project
   */
  async updateProject(id: number, projectData: Partial<Project>): Promise<[number, Project[]]> {
    try {
      return await databaseController.updateProject(projectData, { project_id: id });
    } catch (error) {
      logger.error(`Error updating project: ${error instanceof Error ? error.message : String(error)}`);
      throw error;
    }
  }

  /**
   * Delete a project
   */
  async deleteProject(id: number): Promise<number> {
    try {
      return await databaseController.deleteProject({ project_id: id });
    } catch (error) {
      logger.error(`Error deleting project: ${error instanceof Error ? error.message : String(error)}`);
      throw error;
    }
  }

  /**
   * Get files associated with a project
   */
  async getProjectFiles(projectId: number) {
    try {
      return await databaseController.findFilesByProject(projectId);
    } catch (error) {
      logger.error(`Error fetching project files: ${error instanceof Error ? error.message : String(error)}`);
      throw error;
    }
  }
}

export default new ProjectsService();
