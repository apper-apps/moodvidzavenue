import axios from "axios";

// ElevenLabs API configuration
const ELEVEN_LABS_CONFIG = {
  apiUrl: 'https://api.elevenlabs.io/v1',
  apiKey: (typeof process !== 'undefined' && process.env?.VITE_ELEVEN_LABS_API_KEY) || 'placeholder-api-key',
  maxTextLength: 5000,
  maxFileSize: 25 * 1024 * 1024, // 25MB limit for voice cloning
  supportedFormats: ['audio/wav', 'audio/mp3', 'audio/flac', 'audio/ogg'],
  defaultSettings: {
    stability: 0.75,
    similarity_boost: 0.75,
    style: 0.0,
    use_speaker_boost: true
  }
};

class ElevenLabsService {
  constructor() {
    this.apiClient = axios.create({
      baseURL: ELEVEN_LABS_CONFIG.apiUrl,
      headers: {
        'xi-api-key': ELEVEN_LABS_CONFIG.apiKey,
        'Content-Type': 'application/json'
      },
      timeout: 30000 // 30 second timeout
    });
    
    this.voices = new Map();
    this.generatedAudio = new Map();
  }

  // Simulate API delay for development
  async delay(ms = 2000) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Validate text input
  validateText(text) {
    if (!text || typeof text !== 'string') {
      throw new Error('No text provided');
    }

    if (text.length > ELEVEN_LABS_CONFIG.maxTextLength) {
      throw new Error(`Text exceeds ${ELEVEN_LABS_CONFIG.maxTextLength} character limit`);
    }

    return true;
  }

  // Get available voices
// Get available voices
  async getVoices() {
    try {
      // In development, return mock voices
      if ((typeof process !== 'undefined' && process.env?.NODE_ENV === 'development') || 
          (typeof import.meta !== 'undefined' && import.meta.env?.DEV)) {
        await this.delay(1000);
        
        const mockVoices = [
            voice_id: 'mock-voice-1',
            name: 'Sarah',
            category: 'premade',
            gender: 'female',
            age: 'young',
            accent: 'american',
            description: 'Warm and friendly female voice',
            use_case: 'narration',
            preview_url: null
          },
          {
            voice_id: 'mock-voice-2',
            name: 'David',
            category: 'premade',
            gender: 'male',
            age: 'middle_aged',
            accent: 'british',
            description: 'Professional male voice with British accent',
            use_case: 'audiobook',
            preview_url: null
          },
          {
            voice_id: 'mock-voice-3',
            name: 'Emma',
            category: 'premade',
            gender: 'female',
            age: 'young',
            accent: 'american',
            description: 'Energetic and expressive female voice',
            use_case: 'conversational',
            preview_url: null
          }
        ];

        mockVoices.forEach(voice => {
          this.voices.set(voice.voice_id, voice);
        });

        return mockVoices;
      }

      const response = await this.apiClient.get('/voices');
      const voices = response.data.voices;

      voices.forEach(voice => {
        this.voices.set(voice.voice_id, voice);
      });

      return voices;
    } catch (error) {
      console.error('Get voices error:', error);
      throw new Error('Failed to get available voices');
    }
  }

  // Get voice by ID
  async getVoice(voiceId) {
    try {
      // Check local cache first
      if (this.voices.has(voiceId)) {
        return this.voices.get(voiceId);
      }

      const response = await this.apiClient.get(`/voices/${voiceId}`);
      const voice = response.data;
      
      this.voices.set(voiceId, voice);
      return voice;
    } catch (error) {
      console.error('Get voice error:', error);
      throw new Error('Failed to get voice information');
    }
  }

  // Generate speech from text
  async generateSpeech(text, voiceId, options = {}) {
    try {
      this.validateText(text);

      const requestData = {
        text,
        voice_settings: {
          stability: options.stability || ELEVEN_LABS_CONFIG.defaultSettings.stability,
          similarity_boost: options.similarity_boost || ELEVEN_LABS_CONFIG.defaultSettings.similarity_boost,
          style: options.style || ELEVEN_LABS_CONFIG.defaultSettings.style,
          use_speaker_boost: options.use_speaker_boost !== false
        },
        model_id: options.model_id || 'eleven_monolingual_v1'
};

      // In development, return mock audio
      if ((typeof process !== 'undefined' && process.env?.NODE_ENV === 'development') || 
          (typeof import.meta !== 'undefined' && import.meta.env?.DEV)) {
        await this.delay(3000);
        
        // Create a mock audio blob
        const mockAudioData = new Uint8Array(1024).fill(0);
        const audioBlob = new Blob([mockAudioData], { type: 'audio/mpeg' });
        const audioUrl = URL.createObjectURL(audioBlob);

        const result = {
          id: `mock-audio-${Date.now()}`,
          audioUrl,
          audioBlob,
          text,
          voiceId,
          duration: Math.ceil(text.length / 10), // Rough estimate
          settings: requestData.voice_settings,
          generatedAt: new Date().toISOString()
        };

        this.generatedAudio.set(result.id, result);
        return result;
      }

      const response = await this.apiClient.post(`/text-to-speech/${voiceId}`, requestData, {
        responseType: 'blob'
      });

      const audioBlob = new Blob([response.data], { type: 'audio/mpeg' });
      const audioUrl = URL.createObjectURL(audioBlob);

      const result = {
        id: `audio-${Date.now()}`,
        audioUrl,
        audioBlob,
        text,
        voiceId,
        settings: requestData.voice_settings,
        generatedAt: new Date().toISOString()
      };

      this.generatedAudio.set(result.id, result);
      return result;
    } catch (error) {
      console.error('Generate speech error:', error);
      
      if (error.response?.status === 400) {
        throw new Error('Invalid text or voice settings');
      } else if (error.response?.status === 401) {
        throw new Error('Invalid API key');
      } else if (error.response?.status === 429) {
        throw new Error('Rate limit exceeded. Please try again later');
      }
      
      throw new Error('Failed to generate speech');
    }
  }

  // Clone voice from audio sample
  async cloneVoice(audioFiles, voiceName, options = {}) {
    try {
      if (!audioFiles || audioFiles.length === 0) {
        throw new Error('No audio files provided for voice cloning');
      }

      // Validate audio files
      audioFiles.forEach(file => {
        if (!ELEVEN_LABS_CONFIG.supportedFormats.includes(file.type)) {
          throw new Error(`Unsupported audio format: ${file.type}`);
        }
        if (file.size > ELEVEN_LABS_CONFIG.maxFileSize) {
          throw new Error(`File size exceeds ${ELEVEN_LABS_CONFIG.maxFileSize / (1024 * 1024)}MB limit`);
        }
});

      // In development, return mock cloned voice
      if ((typeof process !== 'undefined' && process.env?.NODE_ENV === 'development') || 
          (typeof import.meta !== 'undefined' && import.meta.env?.DEV)) {
        await this.delay(5000); // Voice cloning takes longer
        
        const clonedVoice = {
          voice_id: `cloned-${Date.now()}`,
          name: voiceName,
          category: 'cloned',
          description: options.description || `Cloned voice: ${voiceName}`,
          labels: options.labels || {},
          created_at: new Date().toISOString(),
          available_for_tiers: ['free', 'starter', 'creator']
        };

        this.voices.set(clonedVoice.voice_id, clonedVoice);
        return clonedVoice;
      }

      const formData = new FormData();
      formData.append('name', voiceName);
      
      if (options.description) {
        formData.append('description', options.description);
      }

      if (options.labels) {
        formData.append('labels', JSON.stringify(options.labels));
      }

      audioFiles.forEach((file, index) => {
        formData.append(`files`, file);
      });

      const response = await this.apiClient.post('/voices/add', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      const clonedVoice = response.data;
      this.voices.set(clonedVoice.voice_id, clonedVoice);
      
      return clonedVoice;
    } catch (error) {
      console.error('Voice cloning error:', error);
      throw new Error('Failed to clone voice');
    }
  }

  // Delete cloned voice
  async deleteVoice(voiceId) {
    try {
      await this.apiClient.delete(`/voices/${voiceId}`);
      this.voices.delete(voiceId);
      
      return { success: true };
    } catch (error) {
      console.error('Delete voice error:', error);
      throw new Error('Failed to delete voice');
    }
  }

  // Get user subscription info
// Get user subscription info
  async getUserInfo() {
    try {
      // In development, return mock user info
      if ((typeof process !== 'undefined' && process.env?.NODE_ENV === 'development') || 
          (typeof import.meta !== 'undefined' && import.meta.env?.DEV)) {
        await this.delay(500);
        
        return {
            tier: 'free',
            character_count: 1500,
            character_limit: 10000,
            can_extend_character_limit: true,
            allowed_to_extend_character_limit: true,
            next_character_count_reset_unix: Date.now() + (30 * 24 * 60 * 60 * 1000)
          },
          is_new_user: false,
          xi_api_key: 'mock-api-key'
        };
      }

      const response = await this.apiClient.get('/user');
      return response.data;
    } catch (error) {
      console.error('Get user info error:', error);
      throw new Error('Failed to get user information');
    }
  }

  // Generate speech for multiple texts
  async generateSpeechBatch(texts, voiceId, options = {}) {
    const results = [];
    const errors = [];

    for (let i = 0; i < texts.length; i++) {
      try {
        const result = await this.generateSpeech(texts[i], voiceId, options);
        results.push({
          index: i,
          text: texts[i],
          ...result
        });
      } catch (error) {
        errors.push({
          index: i,
          text: texts[i],
          error: error.message
        });
      }
    }

    return {
      results,
      errors,
      processed: results.length,
      failed: errors.length,
      total: texts.length
    };
  }

  // Get generated audio by ID
  getGeneratedAudio(audioId) {
    return this.generatedAudio.get(audioId);
  }

  // Clean up generated audio URLs
  cleanupAudio(audioId) {
    const audio = this.generatedAudio.get(audioId);
    if (audio && audio.audioUrl) {
      URL.revokeObjectURL(audio.audioUrl);
      this.generatedAudio.delete(audioId);
    }
  }
}

// Export singleton instance
export const elevenLabsService = new ElevenLabsService();