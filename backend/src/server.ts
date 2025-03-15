import express, { Express, Request, Response } from 'express';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/authRoutes';
import serverConfig from './config/serverConfig';

class Server {
  private app: Express;
  private port: number;

  constructor(port: number = serverConfig.port) {
    this.app = express();
    this.port = port;
    this.configureMiddleware();
    this.configureRoutes();
  }

  private configureMiddleware(): void {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(cookieParser()); // Add cookie parser middleware
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
  }

  public start(): void {
    this.app.listen(this.port, () => {
      console.log(`Server is running on port ${this.port}`);
    });
  }
}

export default Server;
