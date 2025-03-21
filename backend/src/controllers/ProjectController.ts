import { Request, Response } from 'express';
import projectsService from '../services/ProjectsService';
import logger from '../services/logger';
import databaseController from './DatabaseController';
import fileService from '../services/FileService';

class ProjectController {
  /**
   * Create a new project
   */
  async createProject(req: Request, res: Response): Promise<void> {
    logger.info(`ProjectController: Starting createProject`);
    try {
      const userId = req.user?.id;
      if (!userId) {
        logger.warn(`ProjectController: Authentication required for createProject`);
        res.status(401).json({ error: 'Authentication required' });
        return;
      }

      logger.debug(`ProjectController: Creating project for user ${userId}`);
      const projectData = {
        ...req.body,
        user_id: userId
      };

      const newProject = await projectsService.createProject(projectData);
      logger.info(`ProjectController: Project created successfully with ID ${newProject?.project_id}`);
      res.status(201).json(newProject);
    } catch (error) {
      logger.error(`Error in createProject: ${error instanceof Error ? error.message : String(error)}`);
      res.status(500).json({ error: 'Failed to create project' });
    }
  }

  /**
   * Get all projects for the authenticated user
   */
  async getUserProjects(req: Request, res: Response): Promise<void> {
    logger.info(`ProjectController: Starting getUserProjects`);
    try {
      const userId = req.user?.id;
      if (!userId) {
        logger.warn(`ProjectController: Authentication required for getUserProjects`);
        res.status(401).json({ error: 'Authentication required' });
        return;
      }

      logger.debug(`ProjectController: Fetching projects for user ${userId}`);
      const projects = await projectsService.getUserProjects(userId);
      logger.info(`ProjectController: Retrieved ${projects.length} projects for user ${userId}`);
      res.status(200).json(projects);
    } catch (error) {
      logger.error(`Error in getUserProjects: ${error instanceof Error ? error.message : String(error)}`);
      res.status(500).json({ error: 'Failed to fetch user projects' });
    }
  }

  /**
   * Get a project by ID
   */
  async getProjectById(req: Request, res: Response): Promise<void> {
    const projectId = req.params.id;
    logger.info(`ProjectController: Starting getProjectById for project ${projectId}`);
    
    try {
      if (!projectId) {
        logger.warn(`ProjectController: Invalid project ID provided`);
        res.status(400).json({ error: 'Invalid project ID' });
        return;
      }

      const userId = req.user?.id;
      if (!userId) {
        logger.warn(`ProjectController: Authentication required for getProjectById`);
        res.status(401).json({ error: 'Authentication required' });
        return;
      }

      logger.debug(`ProjectController: Fetching project ${projectId}`);
      const project = await projectsService.getProjectById(projectId);
      
      if (!project) {
        logger.warn(`ProjectController: Project ${projectId} not found`);
        res.status(404).json({ error: 'Project not found' });
        return;
      }

      // Ensure the user owns this project
      if (project.user_id !== userId) {
        logger.warn(`ProjectController: Access denied for user ${userId} to project ${projectId}`);
        res.status(403).json({ error: 'Access denied' });
        return;
      }

      logger.info(`ProjectController: Successfully retrieved project ${projectId}`);
      res.status(200).json(project);
    } catch (error) {
      logger.error(`Error in getProjectById: ${error instanceof Error ? error.message : String(error)}`);
      res.status(500).json({ error: 'Failed to fetch project' });
    }
  }

  /**
   * Update an existing project
   */
  async updateProject(req: Request, res: Response): Promise<void> {
    const projectId = req.params.id;
    logger.info(`ProjectController: Starting updateProject for project ${projectId}`);
    
    try {
      if (!projectId) {
        logger.warn(`ProjectController: Invalid project ID provided`);
        res.status(400).json({ error: 'Invalid project ID' });
        return;
      }

      const userId = req.user?.id;
      if (!userId) {
        logger.warn(`ProjectController: Authentication required for updateProject`);
        res.status(401).json({ error: 'Authentication required' });
        return;
      }

      // Check if the project exists and belongs to the user
      logger.debug(`ProjectController: Verifying project ${projectId} exists and belongs to user ${userId}`);
      const existingProject = await projectsService.getProjectById(projectId);
      if (!existingProject) {
        logger.warn(`ProjectController: Project ${projectId} not found`);
        res.status(404).json({ error: 'Project not found' });
        return;
      }

      if (existingProject.user_id !== userId) {
        logger.warn(`ProjectController: Access denied for user ${userId} to project ${projectId}`);
        res.status(403).json({ error: 'Access denied' });
        return;
      }

      // Update the project
      logger.debug(`ProjectController: Updating project ${projectId}`);
      const [updated] = await projectsService.updateProject(projectId, req.body);
      
      if (updated === 0) {
        logger.warn(`ProjectController: No changes made to project ${projectId}`);
        res.status(404).json({ error: 'Project not found or no changes made' });
        return;
      }

      const updatedProject = await projectsService.getProjectById(projectId);
      logger.info(`ProjectController: Successfully updated project ${projectId}`);
      res.status(200).json(updatedProject);
    } catch (error) {
      logger.error(`Error in updateProject: ${error instanceof Error ? error.message : String(error)}`);
      res.status(500).json({ error: 'Failed to update project' });
    }
  }

  /**
   * Delete a project
   */
  async deleteProject(req: Request, res: Response): Promise<void> {
    const projectId = req.params.id;
    logger.info(`ProjectController: Starting deleteProject for project ${projectId}`);
    
    try {
      if (!projectId) {
        logger.warn(`ProjectController: Invalid project ID provided`);
        res.status(400).json({ error: 'Invalid project ID' });
        return;
      }

      const userId = req.user?.id;
      if (!userId) {
        logger.warn(`ProjectController: Authentication required for deleteProject`);
        res.status(401).json({ error: 'Authentication required' });
        return;
      }

      // Check if the project exists and belongs to the user
      logger.debug(`ProjectController: Verifying project ${projectId} exists and belongs to user ${userId}`);
      const existingProject = await projectsService.getProjectById(projectId);
      if (!existingProject) {
        logger.warn(`ProjectController: Project ${projectId} not found`);
        res.status(404).json({ error: 'Project not found' });
        return;
      }

      if (existingProject.user_id !== userId) {
        logger.warn(`ProjectController: Access denied for user ${userId} to project ${projectId}`);
        res.status(403).json({ error: 'Access denied' });
        return;
      }

      // 1. Get all project files
      logger.debug(`ProjectController: Fetching files for project ${projectId}`);
      const projectFiles = await databaseController.findFilesByProject(projectId);
      logger.info(`ProjectController: Found ${projectFiles.length} files to delete for project ${projectId}`);
      
      // 2. Get all project sources
      logger.debug(`ProjectController: Fetching sources for project ${projectId}`);
      const projectSources = await databaseController.findSourcesByProject(projectId);
      logger.info(`ProjectController: Found ${projectSources.length} sources to delete for project ${projectId}`);
      
      // 3. Delete all files related to the project
      logger.debug(`ProjectController: Deleting files for project ${projectId}`);
      for (const file of projectFiles) {
        // Extract filename from URL
        const filename = file.url.split('/').pop();
        
        if (filename) {
          logger.debug(`ProjectController: Deleting physical file ${filename}`);
          // Delete the physical file
          await fileService.deleteFile(filename);
        }
        
        // Delete the file record from database
        logger.debug(`ProjectController: Deleting file record ${file.file_id}`);
        await databaseController.deleteFile({ file_id: file.file_id });
      }
      
      // 4. Delete all sources related to the project
      logger.debug(`ProjectController: Deleting sources for project ${projectId}`);
      for (const source of projectSources) {
        logger.debug(`ProjectController: Deleting source record ${source.source_file_id}`);
        await databaseController.deleteSource({ source_file_id: source.source_file_id });
      }

      // 5. Finally, delete the project
      logger.debug(`ProjectController: Deleting project ${projectId}`);
      await projectsService.deleteProject(projectId);
      logger.info(`ProjectController: Successfully deleted project ${projectId} with all related resources`);
      res.status(204).end();
    } catch (error) {
      logger.error(`Error in deleteProject: ${error instanceof Error ? error.message : String(error)}`);
      res.status(500).json({ error: 'Failed to delete project' });
    }
  }

  /**
   * Get project files
   */
  async getProjectFiles(req: Request, res: Response): Promise<void> {
    const projectId = req.params.id;
    logger.info(`ProjectController: Starting getProjectFiles for project ${projectId}`);
    
    try {
      if (!projectId) {
        logger.warn(`ProjectController: Invalid project ID provided`);
        res.status(400).json({ error: 'Invalid project ID' });
        return;
      }

      const userId = req.user?.id;
      if (!userId) {
        logger.warn(`ProjectController: Authentication required for getProjectFiles`);
        res.status(401).json({ error: 'Authentication required' });
        return;
      }

      // Check if the project exists and belongs to the user
      logger.debug(`ProjectController: Verifying project ${projectId} exists and belongs to user ${userId}`);
      const existingProject = await projectsService.getProjectById(projectId);
      if (!existingProject) {
        logger.warn(`ProjectController: Project ${projectId} not found`);
        res.status(404).json({ error: 'Project not found' });
        return;
      }

      if (existingProject.user_id !== userId) {
        logger.warn(`ProjectController: Access denied for user ${userId} to project ${projectId}`);
        res.status(403).json({ error: 'Access denied' });
        return;
      }

      logger.debug(`ProjectController: Fetching files for project ${projectId}`);
      const files = await projectsService.getProjectFiles(projectId);
      logger.info(`ProjectController: Retrieved ${files.length} files for project ${projectId}`);
      res.status(200).json(files);
    } catch (error) {
      logger.error(`Error in getProjectFiles: ${error instanceof Error ? error.message : String(error)}`);
      res.status(500).json({ error: 'Failed to fetch project files' });
    }
  }

  /**
   * Get project sources
   */
  async getProjectSources(req: Request, res: Response): Promise<void> {
    const projectId = req.params.id;
    logger.info(`ProjectController: Starting getProjectSources for project ${projectId}`);
    
    try {
      if (!projectId) {
        logger.warn(`ProjectController: Invalid project ID provided`);
        res.status(400).json({ error: 'Invalid project ID' });
        return;
      }

      const userId = req.user?.id;
      if (!userId) {
        logger.warn(`ProjectController: Authentication required for getProjectSources`);
        res.status(401).json({ error: 'Authentication required' });
        return;
      }

      // Check if the project exists and belongs to the user
      logger.debug(`ProjectController: Verifying project ${projectId} exists and belongs to user ${userId}`);
      const existingProject = await projectsService.getProjectById(projectId);
      if (!existingProject) {
        logger.warn(`ProjectController: Project ${projectId} not found`);
        res.status(404).json({ error: 'Project not found' });
        return;
      }

      if (existingProject.user_id !== userId) {
        logger.warn(`ProjectController: Access denied for user ${userId} to project ${projectId}`);
        res.status(403).json({ error: 'Access denied' });
        return;
      }

      logger.debug(`ProjectController: Fetching sources for project ${projectId}`);
      const sources = await projectsService.getProjectSources(projectId);
      logger.info(`ProjectController: Retrieved ${sources.length} sources for project ${projectId}`);
      res.status(200).json(sources);
    } catch (error) {
      logger.error(`Error in getProjectSources: ${error instanceof Error ? error.message : String(error)}`);
      res.status(500).json({ error: 'Failed to fetch project sources' });
    }
  }
}

export default new ProjectController();
