import express, { Application, Request, Response } from 'express';
import * as path from 'path';
import { DockerClient } from './docker/DockerClient';
import { DatabaseManager } from './database/DatabaseManager';
import { ContainerService } from './services/ContainerService';
import { ImageService } from './services/ImageService';
import { VolumeService } from './services/VolumeService';
import { NetworkService } from './services/NetworkService';
import { SettingsService } from './services/SettingsService';
import { ContainerController } from './controllers/ContainerController';
import { ImageController } from './controllers/ImageController';
import { VolumeController } from './controllers/VolumeController';
import { NetworkController } from './controllers/NetworkController';
import { SettingsController } from './controllers/SettingsController';
import { ContainerRoutes } from './routes/ContainerRoutes';
import { ImageRoutes } from './routes/ImageRoutes';
import { VolumeRoutes } from './routes/VolumeRoutes';
import { NetworkRoutes } from './routes/NetworkRoutes';
import { SettingsRoutes } from './routes/SettingsRoutes';

export class Server {
  private app: Application;
  private port: number;
  private dockerClient: DockerClient;
  private dbManager: DatabaseManager;

  constructor(port: number = 3000) {
    this.app = express();
    this.port = port;
    this.dockerClient = new DockerClient();
    this.dbManager = new DatabaseManager();
    
    this.initializeMiddlewares();
    this.initializeRoutes();
    this.serveStaticFiles();
  }

  private initializeMiddlewares(): void {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    
    // CORS middleware
    this.app.use((req, res, next) => {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
      res.header('Access-Control-Allow-Headers', 'Content-Type');
      next();
    });
  }

  private initializeRoutes(): void {
    // Initialize services
    const containerService = new ContainerService(this.dockerClient);
    const imageService = new ImageService(this.dockerClient);
    const volumeService = new VolumeService(this.dockerClient);
    const networkService = new NetworkService(this.dockerClient);
    const settingsService = new SettingsService(this.dbManager);

    // Initialize controllers
    const containerController = new ContainerController(containerService);
    const imageController = new ImageController(imageService);
    const volumeController = new VolumeController(volumeService);
    const networkController = new NetworkController(networkService);
    const settingsController = new SettingsController(settingsService);

    // Initialize routes
    const containerRoutes = new ContainerRoutes(containerController);
    const imageRoutes = new ImageRoutes(imageController);
    const volumeRoutes = new VolumeRoutes(volumeController);
    const networkRoutes = new NetworkRoutes(networkController);
    const settingsRoutes = new SettingsRoutes(settingsController);

    // Register routes
    this.app.use('/api/containers', containerRoutes.router);
    this.app.use('/api/images', imageRoutes.router);
    this.app.use('/api/volumes', volumeRoutes.router);
    this.app.use('/api/networks', networkRoutes.router);
    this.app.use('/api/settings', settingsRoutes.router);

    // Health check
    this.app.get('/api/health', (req: Request, res: Response) => {
      res.json({ status: 'ok', timestamp: new Date().toISOString() });
    });
  }

  private serveStaticFiles(): void {
    // Serve static files from dist/client
    this.app.use('/static', express.static(path.join(__dirname, '../client')));
    
    // Serve React app for all other routes
    this.app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, '../client/index.html'));
    });
  }

  public start(): void {
    this.app.listen(this.port, () => {
      console.log(`Server is running on http://localhost:${this.port}`);
    });
  }

  public getApp(): Application {
    return this.app;
  }
}

// Start server if running directly
if (require.main === module) {
  const server = new Server(3000);
  server.start();
}
