import mockData from '@/services/mockData/videos.json';

class VideoService {
  constructor() {
    this.data = [...mockData];
  }

  async getAll() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    return [...this.data];
  }

  async getById(id) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200));
    const video = this.data.find(item => item.Id === parseInt(id));
    if (!video) {
      throw new Error('Video not found');
    }
    return { ...video };
  }

async create(videoData) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 400));
    
    const newId = this.data.length > 0 ? Math.max(...this.data.map(item => item.Id)) + 1 : 1;
    const newVideo = {
      Id: newId,
      ...videoData,
      createdAt: new Date().toISOString(),
    };
    
    this.data.push(newVideo);
    return { ...newVideo };
  }

  async update(id, updateData) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const index = this.data.findIndex(item => item.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Video not found');
    }
    
    this.data[index] = { ...this.data[index], ...updateData };
    return { ...this.data[index] };
  }

  async delete(id) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 250));
    
    const index = this.data.findIndex(item => item.Id === parseInt(id));
    if (index === -1) {
      throw new Error('Video not found');
    }
    
    const deletedVideo = this.data.splice(index, 1)[0];
    return { ...deletedVideo };
  }
}

export const videoService = new VideoService();