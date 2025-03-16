import { Request, Response } from 'express';
import databaseController from './DatabaseController';
import fileService from '../services/FileService';
import logger from '../services/logger';
import { File } from '../types/File';
import fs from 'fs';
import path from 'path';

export class FileController {
  async uploadFile(req: Request, res: Response): Promise<void> {
    try {
      if (!req.file) {
        res.status(400).json({ error: 'No file uploaded' });
        return;
      }

      const { user_id, project_id } = req.body;
      
      if (!user_id || !project_id) {
        res.status(400).json({ error: 'User ID and Project ID are required' });
        return;
      }

      const file = req.file;
      const fileUrl = fileService.getFileUrl(file.filename);

      const fileData: Partial<File> = {
        file_id: uuidv4(),
        user_id: parseInt(user_id),
        project_id: parseInt(project_id),
        name: file.originalname,
        size: file.size,
        type: file.mimetype,
        url: fileUrl,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const createdFile = await databaseController.createFile(fileData);
      
      if (!createdFile) {
        // If file record couldn't be created, delete the uploaded file
        await fileService.deleteFile(file.filename);
        res.status(500).json({ error: 'Failed to create file record' });
        return;
      }

      res.status(201).json(createdFile);
      return 
    } catch (error) {
      logger.error(`Error in uploadFile: ${error instanceof Error ? error.message : String(error)}`);
      res.status(500).json({ error: 'Internal server error' });
      return 
    }
  }

  async getFilesByProject(req: Request, res: Response): Promise<void> {
    try {
      const projectId = parseInt(req.params.projectId);
      
      if (isNaN(projectId)) {
        res.status(400).json({ error: 'Invalid project ID' });
        return;
      }

      const files = await databaseController.findFilesByProject(projectId);
      res.status(200).json(files);
      return;
    } catch (error) {
      logger.error(`Error in getFilesByProject: ${error instanceof Error ? error.message : String(error)}`);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
  }

  async getFilesByUser(req: Request, res: Response): Promise<void> {
    try {
      const userId = parseInt(req.params.userId);
      
      if (isNaN(userId)) {
        res.status(400).json({ error: 'Invalid user ID' });
        return;
      }

      const files = await databaseController.findFilesByUser(userId);
      res.status(200).json(files);
      return;
    } catch (error) {
      logger.error(`Error in getFilesByUser: ${error instanceof Error ? error.message : String(error)}`);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
  }

  async getFileById(req: Request, res: Response): Promise<void> {
    try {
      const fileId = req.params.id;
      
      const file = await databaseController.findFileById(fileId);
      
      if (!file) {
        res.status(404).json({ error: 'File not found' });
        return;
      }

      res.status(200).json(file);
      return;
    } catch (error) {
      logger.error(`Error in getFileById: ${error instanceof Error ? error.message : String(error)}`);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
  }

  async deleteFile(req: Request, res: Response): Promise<void> {
    try {
      const fileId = req.params.id;
      
      const file = await databaseController.findFileById(fileId);
      
      if (!file) {
        res.status(404).json({ error: 'File not found' });
        return;
      }

      // Extract filename from URL
      const filename = file.url.split('/').pop();
      
      if (filename) {
        // Delete the physical file
        await fileService.deleteFile(filename);
      }

      // Delete the file record from database
      const deleted = await databaseController.deleteFile({ file_id: fileId });
      
      if (deleted === 0) {
        res.status(500).json({ error: 'Failed to delete file record' });
        return;
      }

      res.status(200).json({ message: 'File deleted successfully' });
      return;
    } catch (error) {
      logger.error(`Error in deleteFile: ${error instanceof Error ? error.message : String(error)}`);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
  }

  async getFileContent(req: Request, res: Response): Promise<void> {
    try {
      const fileId = req.params.id;
      
      const file = await databaseController.findFileById(fileId);
      
      if (!file) {
        res.status(404).json({ error: 'File not found' });
        return;
      }

      // Extract filename from URL
      const filename = file.url.split('/').pop();
      
      if (!filename) {
        res.status(404).json({ error: 'File path not valid' });
        return;
      }

      const filePath = fileService.getFilePath(filename);
      
      if (!fs.existsSync(filePath)) {
        res.status(404).json({ error: 'File not found on disk' });
        return;
      }

      // Read file content
      const content = fs.readFileSync(filePath, 'utf8');
      res.status(200).json({ content });
      return;
    } catch (error) {
      logger.error(`Error in getFileContent: ${error instanceof Error ? error.message : String(error)}`);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
  }

  async downloadFile(req: Request, res: Response): Promise<void> {
    try {
      const fileId = req.params.id;
      
      const file = await databaseController.findFileById(fileId);
      
      if (!file) {
        res.status(404).json({ error: 'File not found' });
        return;
      }

      // Extract filename from URL
      const filename = file.url.split('/').pop();
      
      if (!filename) {
        res.status(404).json({ error: 'File path not valid' });
        return;
      }

      const filePath = fileService.getFilePath(filename);
      
      if (!fs.existsSync(filePath)) {
        res.status(404).json({ error: 'File not found on disk' });
        return;
      }

      // Send the file as a download
      res.download(filePath, file.name);
      return;
    } catch (error) {
      logger.error(`Error in downloadFile: ${error instanceof Error ? error.message : String(error)}`);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }
  }
}

import { v4 as uuidv4 } from 'uuid';
const fileController = new FileController();
export default fileController;
