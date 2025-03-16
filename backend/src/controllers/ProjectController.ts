import { Request, Response } from 'express';
import projectsService from '../services/ProjectsService';
import logger from '../services/logger';

class ProjectController {
  /**
   * Create a new project
   */
  async createProject(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ error: 'Authentication required' });
        return;
      }

      const projectData = {
        ...req.body,
        user_id: userId
      };

      const newProject = await projectsService.createProject(projectData);
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
    try {
      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ error: 'Authentication required' });
        return;
      }

      const projects = await projectsService.getUserProjects(userId);
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
    try {
      const projectId = parseInt(req.params.id);
      if (isNaN(projectId)) {
        res.status(400).json({ error: 'Invalid project ID' });
        return;
      }

      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ error: 'Authentication required' });
        return;
      }

      const project = await projectsService.getProjectById(projectId);
      
      if (!project) {
        res.status(404).json({ error: 'Project not found' });
        return;
      }

      // Ensure the user owns this project
      if (project.user_id !== userId) {
        res.status(403).json({ error: 'Access denied' });
        return;
      }

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
    try {
      const projectId = parseInt(req.params.id);
      if (isNaN(projectId)) {
        res.status(400).json({ error: 'Invalid project ID' });
        return;
      }

      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ error: 'Authentication required' });
        return;
      }

      // Check if the project exists and belongs to the user
      const existingProject = await projectsService.getProjectById(projectId);
      if (!existingProject) {
        res.status(404).json({ error: 'Project not found' });
        return;
      }

      if (existingProject.user_id !== userId) {
        res.status(403).json({ error: 'Access denied' });
        return;
      }

      // Update the project
      const [updated] = await projectsService.updateProject(projectId, req.body);
      
      if (updated === 0) {
        res.status(404).json({ error: 'Project not found or no changes made' });
        return;
      }

      const updatedProject = await projectsService.getProjectById(projectId);
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
    try {
      const projectId = parseInt(req.params.id);
      if (isNaN(projectId)) {
        res.status(400).json({ error: 'Invalid project ID' });
        return;
      }

      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ error: 'Authentication required' });
        return;
      }

      // Check if the project exists and belongs to the user
      const existingProject = await projectsService.getProjectById(projectId);
      if (!existingProject) {
        res.status(404).json({ error: 'Project not found' });
        return;
      }

      if (existingProject.user_id !== userId) {
        res.status(403).json({ error: 'Access denied' });
        return;
      }

      // Delete the project
      await projectsService.deleteProject(projectId);
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
    try {
      const projectId = parseInt(req.params.id);
      if (isNaN(projectId)) {
        res.status(400).json({ error: 'Invalid project ID' });
        return;
      }

      const userId = req.user?.id;
      if (!userId) {
        res.status(401).json({ error: 'Authentication required' });
        return;
      }

      // Check if the project exists and belongs to the user
      const existingProject = await projectsService.getProjectById(projectId);
      if (!existingProject) {
        res.status(404).json({ error: 'Project not found' });
        return;
      }

      if (existingProject.user_id !== userId) {
        res.status(403).json({ error: 'Access denied' });
        return;
      }

      const files = await projectsService.getProjectFiles(projectId);
      res.status(200).json(files);
    } catch (error) {
      logger.error(`Error in getProjectFiles: ${error instanceof Error ? error.message : String(error)}`);
      res.status(500).json({ error: 'Failed to fetch project files' });
    }
  }
}

export default new ProjectController();
