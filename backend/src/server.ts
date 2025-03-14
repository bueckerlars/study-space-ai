import express, { Express, Request, Response } from 'express';

class Server {
  private app: Express;
  private port: number;

  constructor(port: number = 3000) {
    this.app = express();
    this.port = port;
    this.configureMiddleware();
    this.configureRoutes();
  }

  private configureMiddleware(): void {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }

  private configureRoutes(): void {
    this.app.get('/', (req: Request, res: Response) => {
      res.send('Welcome to Study Space API');
    });

    this.app.get('/api/status', (req: Request, res: Response) => {
      res.json({ status: 'online', timestamp: new Date() });
    });
  }

  public start(): void {
    this.app.listen(this.port, () => {
      console.log(`Server is running on port ${this.port}`);
    });
  }
}

export default Server;
