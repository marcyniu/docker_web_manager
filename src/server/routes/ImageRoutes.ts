import { Router } from 'express';
import { ImageController } from '../controllers/ImageController';

export class ImageRoutes {
  public router: Router;

  constructor(private imageController: ImageController) {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get('/', (req, res) => this.imageController.list(req, res));
    this.router.get('/:id', (req, res) => this.imageController.inspect(req, res));
    this.router.post('/pull', (req, res) => this.imageController.pull(req, res));
    this.router.post('/:id/tag', (req, res) => this.imageController.tag(req, res));
    this.router.delete('/:id', (req, res) => this.imageController.remove(req, res));
  }
}
