import { Router } from 'express';
import { ContainerController } from '../controllers/ContainerController';

export class ContainerRoutes {
  public router: Router;

  constructor(private containerController: ContainerController) {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get('/', (req, res) => this.containerController.list(req, res));
    this.router.get('/:id', (req, res) => this.containerController.inspect(req, res));
    this.router.post('/:id/start', (req, res) => this.containerController.start(req, res));
    this.router.post('/:id/stop', (req, res) => this.containerController.stop(req, res));
    this.router.post('/:id/restart', (req, res) => this.containerController.restart(req, res));
    this.router.delete('/:id', (req, res) => this.containerController.remove(req, res));
  }
}
