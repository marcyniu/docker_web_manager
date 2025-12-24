import { Router } from 'express';
import { VolumeController } from '../controllers/VolumeController';

export class VolumeRoutes {
  public router: Router;

  constructor(private volumeController: VolumeController) {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get('/', (req, res) => this.volumeController.list(req, res));
    this.router.get('/:name', (req, res) => this.volumeController.inspect(req, res));
    this.router.delete('/:name', (req, res) => this.volumeController.remove(req, res));
  }
}
