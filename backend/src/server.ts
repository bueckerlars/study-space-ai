import express, { Express, Request, Response } from 'express';
import cookieParser from 'cookie-parser';
import swaggerUi from 'swagger-ui-express';
import authRoutes from './routes/authRoutes';
import serverConfig from './config/serverConfig';
// Updated import path
import swaggerSpecs from './swagger/swagger';
import cors from 'cors';
import logger from './services/logger';
import fileRoutes from './routes/fileRoutes';
import projectRoutes from './routes/projectRoutes';
import sourceRoutes from './routes/sourceRoutes';
import ollamaRoutes from './routes/ollamaRoutes';

class Server {
  private app: Express;
  private port: number;

  constructor(port: number = serverConfig.port) {
    this.app = express();
    this.port = port;
    this.configureMiddleware();
    this.configureRoutes();
    this.setupSwagger();
  }

  private configureMiddleware(): void {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(cookieParser()); // Add cookie parser middleware

    // Default CORS origins
    const defaultOrigins = ['http://localhost:5173', 'http://127.0.0.1:5173', 'http://localhost:3000', 'http://localhost:5066'];
    
    // Get CORS origins from environment variable if available
    const corsOrigins = process.env.CORS_ORIGIN 
      ? process.env.CORS_ORIGIN.split(',')
      : defaultOrigins;
    
    this.app.use(cors({
      origin: corsOrigins,
      credentials: true, // Required for cookies to be sent
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      optionsSuccessStatus: 204
    }));
    
    logger.info(`CORS configured with origins: ${corsOrigins}`);
  }

  private configureRoutes(): void {
    this.app.get('/', (req: Request, res: Response) => {
      res.send('Welcome to Study Space API');
    });

    this.app.get('/api/status', (req: Request, res: Response) => {
      res.json({ status: 'online', timestamp: new Date() });
    });
    
    // Auth routes
    this.app.use('/api/auth', authRoutes);
    this.app.use('/api/projects', projectRoutes);
    this.app.use('/api/files', fileRoutes);
    this.app.use('/api/sources/', sourceRoutes); 
    this.app.use('/api/ollama', ollamaRoutes);
  }

  private setupSwagger(): void {
    this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpecs));
    logger.info(`Swagger UI available at http://localhost:${this.port}/api-docs`);
  }

  public start(): void {
    this.app.listen(this.port, () => {
      logger.info(`Server is running on port ${this.port}`);
    });
  }
}

export default Server;
