import { Request, Response } from 'express';
import { ImageService } from '../services/ImageService';

export class ImageController {
  constructor(private imageService: ImageService) {}

  async list(req: Request, res: Response): Promise<void> {
    try {
      const images = await this.imageService.getAll();
      res.json({ success: true, data: images });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  async inspect(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const image = await this.imageService.getById(id);
      res.json({ success: true, data: image });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  async remove(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const force = req.query.force === 'true';
      await this.imageService.remove(id, force);
      res.json({ success: true, message: 'Image removed' });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  async pull(req: Request, res: Response): Promise<void> {
    try {
      const { imageName } = req.body;
      await this.imageService.pull(imageName);
      res.json({ success: true, message: 'Image pulled successfully' });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }

  async tag(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { repo, tag } = req.body;
      await this.imageService.tag(id, repo, tag);
      res.json({ success: true, message: 'Image tagged successfully' });
    } catch (error: any) {
      res.status(500).json({ success: false, error: error.message });
    }
  }
}
