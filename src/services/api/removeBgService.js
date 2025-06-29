import axios from "axios";

// Remove.bg API configuration
const REMOVE_BG_CONFIG = {
  apiUrl: 'https://api.remove.bg/v1.0',
  apiKey: import.meta.env.VITE_REMOVE_BG_API_KEY || 'placeholder-api-key',
  maxFileSize: 12 * 1024 * 1024, // 12MB limit
  supportedFormats: ['image/jpeg', 'image/png', 'image/webp'],
  rateLimit: {
    requestsPerSecond: 1,
    requestsPerMinute: 50
  }
};

class RemoveBgService {
  constructor() {
    this.apiClient = axios.create({
      baseURL: REMOVE_BG_CONFIG.apiUrl,
      headers: {
        'X-Api-Key': REMOVE_BG_CONFIG.apiKey,
        'Content-Type': 'application/json'
      },
      timeout: 30000 // 30 second timeout
    });
    
    this.requestQueue = [];
    this.isProcessing = false;
    this.lastRequestTime = 0;
  }

  // Simulate API delay for development
  async delay(ms = 2000) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Rate limiting helper
  async enforceRateLimit() {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    const minInterval = 1000 / REMOVE_BG_CONFIG.rateLimit.requestsPerSecond;
    
    if (timeSinceLastRequest < minInterval) {
      await new Promise(resolve => 
        setTimeout(resolve, minInterval - timeSinceLastRequest)
      );
    }
    
    this.lastRequestTime = Date.now();
  }

  // Validate file before processing
  validateFile(file) {
    if (!file) {
      throw new Error('No file provided');
    }

    if (!REMOVE_BG_CONFIG.supportedFormats.includes(file.type)) {
      throw new Error(`Unsupported file format. Supported: ${REMOVE_BG_CONFIG.supportedFormats.join(', ')}`);
    }

    if (file.size > REMOVE_BG_CONFIG.maxFileSize) {
      throw new Error(`File size exceeds ${REMOVE_BG_CONFIG.maxFileSize / (1024 * 1024)}MB limit`);
    }

    return true;
  }

  // Remove background from image
  async removeBackground(file, options = {}) {
    try {
      await this.enforceRateLimit();
      this.validateFile(file);

      const formData = new FormData();
      formData.append('image_file', file);
      formData.append('size', options.size || 'auto');
      formData.append('type', options.type || 'auto');
      formData.append('format', options.format || 'png');

// In development, simulate the API call
      if (import.meta.env.MODE === 'development') {
        await this.delay(3000); // Simulate processing time
        
        // Return mock processed image
        return {
          success: true,
          data: {
            resultUrl: URL.createObjectURL(file), // Use original as placeholder
            originalSize: file.size,
            processedSize: Math.floor(file.size * 0.7), // Simulate compression
            format: options.format || 'png',
            width: options.width || 1024,
            height: options.height || 768,
            processingTime: 2.8,
            creditsUsed: 1
          }
        };
      }

      // Real API call (when not in development)
      const response = await this.apiClient.post('/removebg', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        responseType: 'blob'
      });

      const processedBlob = new Blob([response.data], { type: `image/${options.format || 'png'}` });
      const resultUrl = URL.createObjectURL(processedBlob);

      return {
        success: true,
        data: {
          resultUrl,
          originalSize: file.size,
          processedSize: processedBlob.size,
          format: options.format || 'png',
          processingTime: response.headers['x-processing-time'],
          creditsUsed: response.headers['x-credits-charged']
        }
      };

    } catch (error) {
      console.error('Remove.bg API error:', error);
      
      if (error.response?.status === 402) {
        throw new Error('Insufficient credits for background removal');
      } else if (error.response?.status === 429) {
        throw new Error('Rate limit exceeded. Please try again later');
      } else if (error.response?.status === 400) {
        throw new Error('Invalid image format or corrupted file');
      }
      
      throw new Error('Background removal failed. Please try again');
    }
  }

  // Batch process multiple images
  async removeBackgroundBatch(files, options = {}) {
    const results = [];
    const errors = [];

    for (let i = 0; i < files.length; i++) {
      try {
        const result = await this.removeBackground(files[i], options);
        results.push({
          index: i,
          filename: files[i].name,
          ...result
        });
      } catch (error) {
        errors.push({
          index: i,
          filename: files[i].name,
          error: error.message
        });
      }
    }

    return {
      results,
      errors,
      processed: results.length,
      failed: errors.length,
      total: files.length
    };
  }

  // Get account information
  async getAccountInfo() {
    try {
      await this.delay(500);
      
// Mock account info for development
      if (import.meta.env.MODE === 'development') {
        return {
          credits: {
            total: 50,
            subscription: 50,
            payg: 0
          },
          api: {
            free_calls: 5,
            sizes: 'all'
          }
        };
      }

      const response = await this.apiClient.get('/account');
      return response.data;
    } catch (error) {
      console.error('Account info error:', error);
      throw new Error('Failed to get account information');
    }
  }

  // Preview background removal (lower quality for preview)
  async previewRemoval(file) {
    const previewOptions = {
      size: 'preview',
      format: 'jpg'
    };
    
    return this.removeBackground(file, previewOptions);
  }
}

// Export singleton instance
export const removeBgService = new RemoveBgService();