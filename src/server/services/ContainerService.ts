import { DockerClient, Container } from '../docker/DockerClient';

export class ContainerService {
  constructor(private dockerClient: DockerClient) {}

  async getAll(showAll: boolean = true): Promise<Container[]> {
    return await this.dockerClient.listContainers(showAll);
  }

  async getById(id: string): Promise<any> {
    return await this.dockerClient.inspectContainer(id);
  }

  async start(id: string): Promise<void> {
    await this.dockerClient.startContainer(id);
  }

  async stop(id: string): Promise<void> {
    await this.dockerClient.stopContainer(id);
  }

  async restart(id: string): Promise<void> {
    await this.dockerClient.restartContainer(id);
  }

  async remove(id: string, force: boolean = false): Promise<void> {
    await this.dockerClient.removeContainer(id, force);
  }
}
