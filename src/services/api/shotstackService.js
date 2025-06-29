import axios from "axios";

// Shotstack API configuration
const SHOTSTACK_CONFIG = {
  apiUrl: 'https://api.shotstack.io',
  apiKey: (typeof process !== 'undefined' && process.env?.VITE_SHOTSTACK_API_KEY) || 'placeholder-api-key',
  stage: (typeof process !== 'undefined' && process.env?.VITE_SHOTSTACK_STAGE) || 'stage', // 'stage' or 'v1'
  webhookUrl: (typeof process !== 'undefined' && process.env?.VITE_SHOTSTACK_WEBHOOK_URL) || null,
  maxVideoDuration: 300, // 5 minutes max
  supportedFormats: {
    video: ['mp4', 'mov', 'avi', 'webm'],
    audio: ['mp3', 'wav', 'aac', 'flac'],
    image: ['jpg', 'jpeg', 'png', 'gif', 'webp']
  }
};

class ShotstackService {
  constructor() {
    this.apiClient = axios.create({
      baseURL: `${SHOTSTACK_CONFIG.apiUrl}/${SHOTSTACK_CONFIG.stage}`,
      headers: {
        'x-api-key': SHOTSTACK_CONFIG.apiKey,
        'Content-Type': 'application/json'
      },
      timeout: 60000 // 60 second timeout
    });
    
    this.activeRenders = new Map();
    this.templates = new Map();
  }

  // Simulate API delay for development
  async delay(ms = 2000) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Create video from images and audio
  async createVideo(options = {}) {
    try {
      const {
        images = [],
        audio = null,
        transitions = [],
        effects = [],
        duration = 30,
        resolution = '1920x1080',
        fps = 30,
        format = 'mp4'
      } = options;

      if (images.length === 0) {
        throw new Error('No images provided for video creation');
      }

      // Build timeline
      const timeline = this.buildTimeline({
        images,
        audio,
        transitions,
        effects,
        duration
      });

      const renderData = {
        timeline,
        output: {
          format,
          resolution,
          fps,
          quality: 'high'
        },
        callback: SHOTSTACK_CONFIG.webhookUrl
      };
// In development, return mock render
      if ((typeof process !== 'undefined' && process.env?.NODE_ENV === 'development') || typeof window !== 'undefined') {
        await this.delay(3000);
        
        const mockRender = {
          success: true,
          message: 'Render Successfully Queued',
          message: 'Render Successfully Queued',
          response: {
            id: `mock-render-${Date.now()}`,
            status: 'queued',
            url: null,
            created: new Date().toISOString(),
            updated: new Date().toISOString()
          }
        };

        this.activeRenders.set(mockRender.response.id, mockRender.response);
        
        // Simulate render completion after delay
        setTimeout(() => {
          this.simulateRenderCompletion(mockRender.response.id);
        }, 10000);

        return mockRender;
      }

      const response = await this.apiClient.post('/render', renderData);
      const render = response.data;
      
      this.activeRenders.set(render.response.id, render.response);
      return render;
    } catch (error) {
      console.error('Create video error:', error);
      throw new Error('Failed to create video');
    }
  }

  // Simulate render completion for development
  simulateRenderCompletion(renderId) {
    const render = this.activeRenders.get(renderId);
    if (render) {
      render.status = 'done';
      render.url = `https://cdn.shotstack.io/au/v1/assets/mock-video-${Date.now()}.mp4`;
      render.updated = new Date().toISOString();
      this.activeRenders.set(renderId, render);
    }
  }

  // Build timeline from assets
  buildTimeline(options) {
    const { images, audio, transitions, effects, duration } = options;
    const tracks = [];
    
    // Image track
    if (images.length > 0) {
      const imageDuration = duration / images.length;
      const imageClips = images.map((image, index) => {
        const startTime = index * imageDuration;
        const endTime = startTime + imageDuration;
        
        return {
          asset: {
            type: 'image',
            src: image.url || image.src,
            crop: image.crop || 'center'
          },
          start: startTime,
          length: imageDuration,
          fit: 'cover',
          scale: image.scale || 1,
          position: image.position || 'center',
          offset: image.offset || { x: 0, y: 0 },
          transition: transitions[index] || {
            in: 'fade',
            out: 'fade'
          },
          effect: effects[index] || null
        };
      });

      tracks.push({
        clips: imageClips
      });
    }

    // Audio track
    if (audio) {
      tracks.push({
        clips: [{
          asset: {
            type: 'audio',
            src: audio.url || audio.src,
            volume: audio.volume || 1
          },
          start: 0,
          length: duration,
          volume: audio.volume || 1
        }]
      });
    }

    return {
      soundtrack: audio ? {
        src: audio.url || audio.src,
        effect: 'fadeInFadeOut',
        volume: audio.volume || 0.5
      } : null,
      background: '#000000',
      tracks
    };
  }

  // Get render status
  async getRenderStatus(renderId) {
    try {
      // Check local cache first
      if (this.activeRenders.has(renderId)) {
        const cached = this.activeRenders.get(renderId);
        if (cached.status === 'done' || cached.status === 'failed') {
          return cached;
        }
      }
// In development, return mock status
      if ((typeof process !== 'undefined' && process.env?.NODE_ENV === 'development') || typeof window !== 'undefined') {
        await this.delay(500);
        
        const render = this.activeRenders.get(renderId);
        if (render) {
          return render;
          return render;
        }
        
        throw new Error('Render not found');
      }

      const response = await this.apiClient.get(`/render/${renderId}`);
      const render = response.data.response;
      
      this.activeRenders.set(renderId, render);
      return render;
    } catch (error) {
      console.error('Get render status error:', error);
      throw new Error('Failed to get render status');
    }
  }

  // Poll render until completion
  async pollRenderStatus(renderId, maxAttempts = 60) {
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      try {
        const render = await this.getRenderStatus(renderId);

        if (render.status === 'done') {
          return render;
        } else if (render.status === 'failed') {
          throw new Error(`Render failed: ${render.error || 'Unknown error'}`);
        }

        // Wait before next poll
        await this.delay(5000); // 5 second intervals
      } catch (error) {
        if (attempt === maxAttempts - 1) {
          throw error;
        }
        await this.delay(5000);
      }
    }

    throw new Error('Render timeout - please check status manually');
  }

  // Create template
  async createTemplate(templateData) {
    try {
      const response = await this.apiClient.post('/templates', templateData);
      const template = response.data;
      
      this.templates.set(template.id, template);
      return template;
    } catch (error) {
      console.error('Create template error:', error);
      throw new Error('Failed to create template');
    }
  }

  // Render from template
  async renderFromTemplate(templateId, mergeData = {}) {
    try {
      const renderData = {
        template: templateId,
        merge: mergeData,
        callback: SHOTSTACK_CONFIG.webhookUrl
      };

      const response = await this.apiClient.post('/render', renderData);
      const render = response.data;
      
      this.activeRenders.set(render.response.id, render.response);
      return render;
    } catch (error) {
      console.error('Render from template error:', error);
      throw new Error('Failed to render from template');
    }
  }

  // Get assets (uploaded files)
  async getAssets() {
    try {
      const response = await this.apiClient.get('/assets');
      return response.data;
    } catch (error) {
      console.error('Get assets error:', error);
      throw new Error('Failed to get assets');
    }
  }

  // Upload asset
  async uploadAsset(file) {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await this.apiClient.post('/assets', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      return response.data;
    } catch (error) {
      console.error('Upload asset error:', error);
      throw new Error('Failed to upload asset');
    }
  }

  // Create slideshow from images
  async createSlideshow(images, options = {}) {
    const slideshowOptions = {
      images,
      transitions: options.transitions || images.map(() => ({ in: 'fade', out: 'fade' })),
      effects: options.effects || [],
      duration: options.duration || Math.min(images.length * 3, 30),
      resolution: options.resolution || '1920x1080',
      fps: options.fps || 30,
      format: options.format || 'mp4',
      audio: options.audio || null
    };

    return this.createVideo(slideshowOptions);
  }

  // Generate video thumbnail
  async generateThumbnail(videoUrl, timeOffset = 5) {
    try {
      const renderData = {
        timeline: {
          tracks: [{
            clips: [{
              asset: {
                type: 'video',
                src: videoUrl,
                trim: timeOffset
              },
              start: 0,
              length: 0.1 // Very short duration for thumbnail
            }]
          }]
        },
        output: {
          format: 'jpg',
          resolution: '1920x1080'
        }
      };

      const response = await this.apiClient.post('/render', renderData);
      return response.data;
    } catch (error) {
      console.error('Generate thumbnail error:', error);
      throw new Error('Failed to generate thumbnail');
    }
  }

  // Get render history
  async getRenderHistory(limit = 50) {
    try {
      const response = await this.apiClient.get(`/renders?limit=${limit}`);
      return response.data;
    } catch (error) {
      console.error('Get render history error:', error);
      throw new Error('Failed to get render history');
    }
  }

  // Cancel render
  async cancelRender(renderId) {
    try {
      const response = await this.apiClient.delete(`/render/${renderId}`);
      
      // Update local cache
      const render = this.activeRenders.get(renderId);
      if (render) {
        render.status = 'cancelled';
        this.activeRenders.set(renderId, render);
      }
      
      return response.data;
    } catch (error) {
      console.error('Cancel render error:', error);
      throw new Error('Failed to cancel render');
    }
  }
}

// Export singleton instance
export const shotstackService = new ShotstackService();