import { DockerClient, Image } from '../docker/DockerClient';

export class ImageService {
  constructor(private dockerClient: DockerClient) {}

  async getAll(): Promise<Image[]> {
    return await this.dockerClient.listImages();
  }

  async getById(id: string): Promise<any> {
    return await this.dockerClient.inspectImage(id);
  }

  async remove(id: string, force: boolean = false): Promise<void> {
    await this.dockerClient.removeImage(id, force);
  }

  async pull(imageName: string): Promise<void> {
    await this.dockerClient.pullImage(imageName);
  }

  async tag(id: string, repo: string, tag: string): Promise<void> {
    await this.dockerClient.tagImage(id, repo, tag);
  }
}
