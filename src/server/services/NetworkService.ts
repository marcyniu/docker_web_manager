import { DockerClient, Network } from '../docker/DockerClient';

export class NetworkService {
  constructor(private dockerClient: DockerClient) {}

  async getAll(): Promise<Network[]> {
    return await this.dockerClient.listNetworks();
  }

  async getById(id: string): Promise<any> {
    return await this.dockerClient.inspectNetwork(id);
  }

  async remove(id: string): Promise<void> {
    await this.dockerClient.removeNetwork(id);
  }
}
