import { DockerClient, Volume } from '../docker/DockerClient';

export class VolumeService {
  constructor(private dockerClient: DockerClient) {}

  async getAll(): Promise<Volume[]> {
    return await this.dockerClient.listVolumes();
  }

  async getByName(name: string): Promise<any> {
    return await this.dockerClient.inspectVolume(name);
  }

  async remove(name: string, force: boolean = false): Promise<void> {
    await this.dockerClient.removeVolume(name, force);
  }
}
