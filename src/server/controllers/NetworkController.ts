import { Request, Response } from 'express';
import { NetworkService } from '../services/NetworkService';

export class NetworkController {
  constructor(private networkService: NetworkService) {}

  async list(req: Request, res: Response): Promise<void> {
    try {
      const networks = await this.networkService.getAll();
      res.json({ success: true, data: networks });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  async inspect(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const network = await this.networkService.getById(id);
      res.json({ success: true, data: network });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  async remove(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      await this.networkService.remove(id);
      res.json({ success: true, message: 'Network removed' });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
}
