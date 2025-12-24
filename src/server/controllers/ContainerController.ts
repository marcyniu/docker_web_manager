import { Request, Response } from 'express';
import { ContainerService } from '../services/ContainerService';

export class ContainerController {
  constructor(private containerService: ContainerService) {}

  async list(req: Request, res: Response): Promise<void> {
    try {
      const showAll = req.query.all === 'true';
      const containers = await this.containerService.getAll(showAll);
      res.json({ success: true, data: containers });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  async inspect(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const container = await this.containerService.getById(id);
      res.json({ success: true, data: container });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  async start(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await this.containerService.start(id);
      res.json({ success: true, message: 'Container started' });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  async stop(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await this.containerService.stop(id);
      res.json({ success: true, message: 'Container stopped' });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  async restart(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await this.containerService.restart(id);
      res.json({ success: true, message: 'Container restarted' });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  async remove(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const force = req.query.force === 'true';
      await this.containerService.remove(id, force);
      res.json({ success: true, message: 'Container removed' });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
}
