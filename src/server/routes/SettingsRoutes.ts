import { Router } from 'express';
import { SettingsController } from '../controllers/SettingsController';

export class SettingsRoutes {
  public router: Router;

  constructor(private settingsController: SettingsController) {
    this.router = Router();
    this.initializeRoutes();
  }

  private initializeRoutes(): void {
    this.router.get('/', (req, res) => this.settingsController.list(req, res));
    this.router.get('/:key', (req, res) => this.settingsController.get(req, res));
    this.router.put('/:key', (req, res) => this.settingsController.update(req, res));
    this.router.delete('/:key', (req, res) => this.settingsController.delete(req, res));
  }
}
