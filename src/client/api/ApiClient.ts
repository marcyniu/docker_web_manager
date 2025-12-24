import axios, { AxiosInstance } from 'axios';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: '/api',
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  // Container methods
  async getContainers(all: boolean = true) {
    const response = await this.client.get('/containers', { params: { all } });
    return response.data;
  }

  async inspectContainer(id: string) {
    const response = await this.client.get(`/containers/${id}`);
    return response.data;
  }

  async startContainer(id: string) {
    const response = await this.client.post(`/containers/${id}/start`);
    return response.data;
  }

  async stopContainer(id: string) {
    const response = await this.client.post(`/containers/${id}/stop`);
    return response.data;
  }

  async restartContainer(id: string) {
    const response = await this.client.post(`/containers/${id}/restart`);
    return response.data;
  }

  async removeContainer(id: string, force: boolean = false) {
    const response = await this.client.delete(`/containers/${id}`, { params: { force } });
    return response.data;
  }

  // Image methods
  async getImages() {
    const response = await this.client.get('/images');
    return response.data;
  }

  async inspectImage(id: string) {
    const response = await this.client.get(`/images/${id}`);
    return response.data;
  }

  async removeImage(id: string, force: boolean = false) {
    const response = await this.client.delete(`/images/${id}`, { params: { force } });
    return response.data;
  }

  async pullImage(imageName: string) {
    const response = await this.client.post('/images/pull', { imageName });
    return response.data;
  }

  // Volume methods
  async getVolumes() {
    const response = await this.client.get('/volumes');
    return response.data;
  }

  async inspectVolume(name: string) {
    const response = await this.client.get(`/volumes/${name}`);
    return response.data;
  }

  async removeVolume(name: string, force: boolean = false) {
    const response = await this.client.delete(`/volumes/${name}`, { params: { force } });
    return response.data;
  }

  // Network methods
  async getNetworks() {
    const response = await this.client.get('/networks');
    return response.data;
  }

  async inspectNetwork(id: string) {
    const response = await this.client.get(`/networks/${id}`);
    return response.data;
  }

  async removeNetwork(id: string) {
    const response = await this.client.delete(`/networks/${id}`);
    return response.data;
  }

  // Settings methods
  async getSettings() {
    const response = await this.client.get('/settings');
    return response.data;
  }

  async getSetting(key: string) {
    const response = await this.client.get(`/settings/${key}`);
    return response.data;
  }

  async updateSetting(key: string, value: string, description?: string) {
    const response = await this.client.put(`/settings/${key}`, { value, description });
    return response.data;
  }

  async deleteSetting(key: string) {
    const response = await this.client.delete(`/settings/${key}`);
    return response.data;
  }
}

export const apiClient = new ApiClient();
