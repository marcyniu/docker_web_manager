import { Request, Response } from 'express';
import { VolumeService } from '../services/VolumeService';

export class VolumeController {
  constructor(private volumeService: VolumeService) {}

  async list(req: Request, res: Response): Promise<void> {
    try {
      const volumes = await this.volumeService.getAll();
      res.json({ success: true, data: volumes });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  async inspect(req: Request, res: Response): Promise<void> {
    try {
      const { name } = req.params;
      const volume = await this.volumeService.getByName(name);
      res.json({ success: true, data: volume });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  async remove(req: Request, res: Response): Promise<void> {
    try {
      const { name } = req.params;
      const force = req.query.force === 'true';
      await this.volumeService.remove(name, force);
      res.json({ success: true, message: 'Volume removed' });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
}
