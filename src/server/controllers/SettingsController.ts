import { Request, Response } from 'express';
import { SettingsService } from '../services/SettingsService';

export class SettingsController {
  constructor(private settingsService: SettingsService) {}

  async list(req: Request, res: Response): Promise<void> {
    try {
      const settings = this.settingsService.getAll();
      res.json({ success: true, data: settings });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  async get(req: Request, res: Response): Promise<void> {
    try {
      const { key } = req.params;
      const setting = this.settingsService.getByKey(key);
      if (!setting) {
        res.status(404).json({ success: false, error: 'Setting not found' });
        return;
      }
      res.json({ success: true, data: setting });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  async update(req: Request, res: Response): Promise<void> {
    try {
      const { key } = req.params;
      const { value, description } = req.body;
      this.settingsService.update(key, value, description);
      res.json({ success: true, message: 'Setting updated' });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  async delete(req: Request, res: Response): Promise<void> {
    try {
      const { key } = req.params;
      this.settingsService.delete(key);
      res.json({ success: true, message: 'Setting deleted' });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
}
