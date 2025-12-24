import axios, { AxiosInstance } from 'axios';

export interface Container {
  Id: string;
  Names: string[];
  Image: string;
  State: string;
  Status: string;
  Created: number;
}

export interface Image {
  Id: string;
  RepoTags: string[];
  Created: number;
  Size: number;
}

export interface Volume {
  Name: string;
  Driver: string;
  Mountpoint: string;
  CreatedAt: string;
}

export interface Network {
  Id: string;
  Name: string;
  Driver: string;
  Scope: string;
}

export class DockerClient {
  private client: AxiosInstance;

  constructor(socketPath: string = '/var/run/docker.sock') {
    this.client = axios.create({
      socketPath: socketPath,
      baseURL: 'http://localhost'
    });
  }

  async listContainers(all: boolean = false): Promise<Container[]> {
    const response = await this.client.get('/containers/json', {
      params: { all: all ? 1 : 0 }
    });
    return response.data;
  }

  async inspectContainer(id: string): Promise<any> {
    const response = await this.client.get(`/containers/${id}/json`);
    return response.data;
  }

  async startContainer(id: string): Promise<void> {
    await this.client.post(`/containers/${id}/start`);
  }

  async stopContainer(id: string): Promise<void> {
    await this.client.post(`/containers/${id}/stop`);
  }

  async removeContainer(id: string, force: boolean = false): Promise<void> {
    await this.client.delete(`/containers/${id}`, {
      params: { force: force ? 1 : 0 }
    });
  }

  async restartContainer(id: string): Promise<void> {
    await this.client.post(`/containers/${id}/restart`);
  }

  async listImages(): Promise<Image[]> {
    const response = await this.client.get('/images/json');
    return response.data;
  }

  async inspectImage(id: string): Promise<any> {
    const response = await this.client.get(`/images/${id}/json`);
    return response.data;
  }

  async removeImage(id: string, force: boolean = false): Promise<void> {
    await this.client.delete(`/images/${id}`, {
      params: { force: force ? 1 : 0 }
    });
  }

  async pullImage(imageName: string): Promise<void> {
    await this.client.post('/images/create', null, {
      params: { fromImage: imageName }
    });
  }

  async tagImage(id: string, repo: string, tag: string): Promise<void> {
    await this.client.post(`/images/${id}/tag`, null, {
      params: { repo, tag }
    });
  }

  async listVolumes(): Promise<Volume[]> {
    const response = await this.client.get('/volumes');
    return response.data.Volumes || [];
  }

  async inspectVolume(name: string): Promise<any> {
    const response = await this.client.get(`/volumes/${name}`);
    return response.data;
  }

  async removeVolume(name: string, force: boolean = false): Promise<void> {
    await this.client.delete(`/volumes/${name}`, {
      params: { force: force ? 1 : 0 }
    });
  }

  async listNetworks(): Promise<Network[]> {
    const response = await this.client.get('/networks');
    return response.data;
  }

  async inspectNetwork(id: string): Promise<any> {
    const response = await this.client.get(`/networks/${id}`);
    return response.data;
  }

  async removeNetwork(id: string): Promise<void> {
    await this.client.delete(`/networks/${id}`);
  }
}
