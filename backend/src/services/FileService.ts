import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import logger from './logger';

class FileService {
  private uploadDir: string;
  private storage: multer.StorageEngine;
  private upload: multer.Multer;

  constructor() {
    this.uploadDir = path.join(process.cwd(), 'uploads');
    
    // Ensure upload directory exists
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }

    // Configure multer storage
    this.storage = multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, this.uploadDir);
      },
      filename: (req, file, cb) => {
        const uniqueFilename = `${uuidv4()}-${file.originalname}`;
        cb(null, uniqueFilename);
      }
    });

    // Initialize multer upload
    this.upload = multer({ 
      storage: this.storage,
      limits: {
        fileSize: 10 * 1024 * 1024 // 10MB limit
      }
    });
  }

  getMulterUpload() {
    return this.upload;
  }

  getFilePath(filename: string): string {
    return path.join(this.uploadDir, filename);
  }

  getFileUrl(filename: string): string {
    // This should be adjusted based on your server configuration
    return `/uploads/${filename}`;
  }

  async deleteFile(filename: string): Promise<boolean> {
    const filePath = this.getFilePath(filename);
    
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        logger.info(`File deleted: ${filePath}`);
        return true;
      }
      logger.warn(`File not found for deletion: ${filePath}`);
      return false;
    } catch (error) {
      logger.error(`Error deleting file: ${error instanceof Error ? error.message : String(error)}`);
      throw error;
    }
  }
}

const fileService = new FileService();
export default fileService;
