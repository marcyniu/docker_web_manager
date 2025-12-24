import { ContainerService } from '../services/ContainerService';
import { DockerClient } from '../docker/DockerClient';

describe('ContainerService', () => {
  let containerService: ContainerService;
  let mockDockerClient: jest.Mocked<DockerClient>;

  beforeEach(() => {
    mockDockerClient = {
      listContainers: jest.fn(),
      inspectContainer: jest.fn(),
      startContainer: jest.fn(),
      stopContainer: jest.fn(),
      restartContainer: jest.fn(),
      removeContainer: jest.fn(),
    } as any;

    containerService = new ContainerService(mockDockerClient);
  });

  it('should get all containers', async () => {
    const mockContainers = [{ Id: '123', Names: ['test'], Image: 'nginx', State: 'running', Status: 'Up' }];
    mockDockerClient.listContainers.mockResolvedValue(mockContainers as any);

    const result = await containerService.getAll();

    expect(result).toEqual(mockContainers);
    expect(mockDockerClient.listContainers).toHaveBeenCalledWith(true);
  });

  it('should start a container', async () => {
    const containerId = '123';
    mockDockerClient.startContainer.mockResolvedValue();

    await containerService.start(containerId);

    expect(mockDockerClient.startContainer).toHaveBeenCalledWith(containerId);
  });
});
