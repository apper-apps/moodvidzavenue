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
    // Simulate API delay with enhanced processing
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newId = this.data.length > 0 ? Math.max(...this.data.map(item => item.Id)) + 1 : 1;
    
    // Enhanced video creation with API integration placeholders
    const newVideo = {
      Id: newId,
      ...videoData,
      createdAt: new Date().toISOString(),
      apiProcessing: {
        shotstack: {
          renderId: `mock-render-${Date.now()}`,
          status: 'completed',
          url: `https://cdn.shotstack.io/mock/video-${newId}.mp4`,
          timeline: this.buildShotstackTimeline(videoData),
          processingTime: 8.5
        },
        elevenLabs: videoData.apiIntegration?.elevenLabsEnabled ? {
          audioId: `mock-audio-${Date.now()}`,
          voiceId: 'mock-voice-1',
          generatedAudio: `https://api.elevenlabs.io/mock/audio-${newId}.mp3`,
          textProcessed: videoData.audioScript || '',
          processingTime: 3.2
        } : null,
        assemblyAi: videoData.apiIntegration?.assemblyAiEnabled ? {
          transcriptionId: `mock-transcript-${Date.now()}`,
          audioUrl: videoData.audioFile || null,
          transcription: 'Mock transcription would appear here',
          processingTime: 2.1
        } : null,
        removeBg: videoData.apiIntegration?.removeBgEnabled ? {
          processedImages: videoData.photos?.filter(p => p.backgroundRemoved).length || 0,
          totalImages: videoData.photos?.length || 0,
          processingTime: 1.8
        } : null
      },
      renderUrl: `https://cdn.shotstack.io/mock/video-${newId}.mp4`,
      thumbnailUrl: `https://cdn.shotstack.io/mock/thumb-${newId}.jpg`,
      processing: false,
      status: 'completed'
    };
    
    this.data.push(newVideo);
    return { ...newVideo };
  }

  // Helper method to build Shotstack timeline structure
  buildShotstackTimeline(videoData) {
    return {
      tracks: [
        {
          clips: videoData.photos?.map((photo, index) => ({
            asset: {
              type: 'image',
              src: photo.url,
              crop: 'center'
            },
            start: index * 3,
            length: 3,
            fit: 'cover',
            transition: {
              in: 'fade',
              out: 'fade'
            }
          })) || []
        }
      ],
      soundtrack: videoData.music ? {
        src: videoData.music,
        effect: 'fadeInFadeOut',
        volume: 0.5
      } : null,
      background: '#000000'
    };
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