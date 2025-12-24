import { Router } from 'express';
import { NetworkController } from '../controllers/NetworkController';

export class NetworkRoutes {
  public router: Router;

  constructor(private networkController: NetworkController) {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get('/', (req, res) => this.networkController.list(req, res));
    this.router.get('/:id', (req, res) => this.networkController.inspect(req, res));
    this.router.delete('/:id', (req, res) => this.networkController.remove(req, res));
  }
}
