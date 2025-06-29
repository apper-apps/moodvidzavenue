import axios from "axios";
import React from "react";
import Error from "@/components/ui/Error";

// AssemblyAI API configuration
const ASSEMBLY_AI_CONFIG = {
  apiUrl: 'https://api.assemblyai.com/v2',
  apiKey: import.meta.env.VITE_ASSEMBLY_AI_API_KEY || 'placeholder-api-key',
  uploadUrl: 'https://api.assemblyai.com/v2/upload',
  maxFileSize: 512 * 1024 * 1024, // 512MB limit
  supportedFormats: [
    'audio/wav', 'audio/mp3', 'audio/m4a', 'audio/flac', 
    'audio/ogg', 'video/mp4', 'video/webm'
  ],
  websocketUrl: 'wss://api.assemblyai.com/v2/realtime/ws'
};

class AssemblyAiService {
  constructor() {
    this.apiClient = axios.create({
      baseURL: ASSEMBLY_AI_CONFIG.apiUrl,
      headers: {
        'authorization': ASSEMBLY_AI_CONFIG.apiKey,
        'Content-Type': 'application/json'
      },
      timeout: 60000 // 60 second timeout
    });
    
    this.activeTranscriptions = new Map();
    this.websocket = null;
  }

  // Simulate API delay for development
  async delay(ms = 1500) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Validate audio file
  validateAudioFile(file) {
    if (!file) {
      throw new Error('No audio file provided');
    }

    if (!ASSEMBLY_AI_CONFIG.supportedFormats.includes(file.type)) {
      throw new Error(`Unsupported audio format. Supported: ${ASSEMBLY_AI_CONFIG.supportedFormats.join(', ')}`);
    }

    if (file.size > ASSEMBLY_AI_CONFIG.maxFileSize) {
      throw new Error(`File size exceeds ${ASSEMBLY_AI_CONFIG.maxFileSize / (1024 * 1024)}MB limit`);
    }

    return true;
  }

  // Upload audio file to AssemblyAI
  async uploadAudio(file) {
    try {
this.validateAudioFile(file);

      // In development, simulate upload
      if (import.meta.env.DEV) {
        await this.delay(2000);
        return {
          upload_url: `https://cdn.assemblyai.com/upload/${Date.now()}-${file.name}`
        };
      }
      const formData = new FormData();
      formData.append('audio', file);

      const response = await this.apiClient.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      return response.data;
    } catch (error) {
      console.error('Audio upload error:', error);
      throw new Error('Failed to upload audio file');
    }
  }

  // Transcribe audio file
  async transcribeAudio(audioUrl, options = {}) {
    try {
      const transcriptionConfig = {
        audio_url: audioUrl,
        language_code: options.language || 'en_us',
        speaker_labels: options.speakerLabels || false,
        auto_chapters: options.autoChapters || false,
        sentiment_analysis: options.sentimentAnalysis || false,
        entity_detection: options.entityDetection || false,
        punctuate: options.punctuate !== false,
        format_text: options.formatText !== false,
        dual_channel: options.dualChannel || false,
        word_timestamps: options.wordTimestamps || false
      };

// In development, return mock transcription
      if (import.meta.env.DEV) {
        await this.delay(3000);
        
        const mockTranscription = {
          id: `mock-${Date.now()}`,
          status: 'completed',
          text: 'This is a mock transcription of the uploaded audio file. The actual transcription would appear here when using the real AssemblyAI API.',
          confidence: 0.95,
          audio_duration: 30.5,
          language_code: options.language || 'en_us',
          words: [
            { text: 'This', start: 0, end: 400, confidence: 0.98 },
            { text: 'is', start: 400, end: 600, confidence: 0.99 },
            { text: 'a', start: 600, end: 700, confidence: 0.97 },
            { text: 'mock', start: 700, end: 1100, confidence: 0.96 }
          ],
          chapters: options.autoChapters ? [
            {
              start: 0,
              end: 30500,
              headline: 'Introduction',
              summary: 'Mock chapter summary'
            }
          ] : null,
          sentiment_analysis_results: options.sentimentAnalysis ? [
            {
              text: 'This is a mock transcription',
              sentiment: 'NEUTRAL',
              confidence: 0.8,
              start: 0,
              end: 30500
            }
          ] : null
        };

        this.activeTranscriptions.set(mockTranscription.id, mockTranscription);
        return mockTranscription;
      }

      const response = await this.apiClient.post('/transcript', transcriptionConfig);
      const transcriptionId = response.data.id;

      // Poll for completion
      const completedTranscription = await this.pollTranscriptionStatus(transcriptionId);
      this.activeTranscriptions.set(transcriptionId, completedTranscription);
      
      return completedTranscription;
    } catch (error) {
      console.error('Transcription error:', error);
      throw new Error('Failed to transcribe audio');
    }
  }

  // Poll transcription status
  async pollTranscriptionStatus(transcriptionId, maxAttempts = 60) {
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      try {
        const response = await this.apiClient.get(`/transcript/${transcriptionId}`);
        const transcription = response.data;

        if (transcription.status === 'completed') {
          return transcription;
        } else if (transcription.status === 'error') {
          throw new Error(`Transcription failed: ${transcription.error}`);
        }

        // Wait before next poll
        await this.delay(2000);
      } catch (error) {
        if (attempt === maxAttempts - 1) {
          throw error;
        }
        await this.delay(2000);
      }
    }

    throw new Error('Transcription timeout - please try again');
  }

  // Get transcription by ID
  async getTranscription(transcriptionId) {
    try {
      // Check local cache first
      if (this.activeTranscriptions.has(transcriptionId)) {
        return this.activeTranscriptions.get(transcriptionId);
      }

      const response = await this.apiClient.get(`/transcript/${transcriptionId}`);
      return response.data;
    } catch (error) {
      console.error('Get transcription error:', error);
      throw new Error('Failed to get transcription');
    }
  }

  // Real-time transcription setup
  setupRealtimeTranscription(options = {}) {
    if (!WebSocket) {
      throw new Error('WebSocket not supported in this environment');
    }

    const wsUrl = `${ASSEMBLY_AI_CONFIG.websocketUrl}?sample_rate=${options.sampleRate || 16000}`;
    
    this.websocket = new WebSocket(wsUrl, [], {
      headers: {
        'Authorization': ASSEMBLY_AI_CONFIG.apiKey
      }
    });

    return new Promise((resolve, reject) => {
      this.websocket.onopen = () => {
        console.log('Real-time transcription connected');
        resolve(this.websocket);
      };

      this.websocket.onerror = (error) => {
        console.error('WebSocket error:', error);
        reject(new Error('Failed to connect to real-time transcription'));
      };

      this.websocket.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          this.handleRealtimeMessage(data);
        } catch (error) {
          console.error('WebSocket message error:', error);
        }
      };
    });
  }

  // Handle real-time transcription messages
  handleRealtimeMessage(data) {
    // Override this method to handle real-time transcription results
    console.log('Real-time transcription:', data);
  }

  // Send audio data for real-time transcription
  sendAudioData(audioData) {
    if (this.websocket && this.websocket.readyState === WebSocket.OPEN) {
      this.websocket.send(JSON.stringify({
        audio_data: audioData
      }));
    }
  }

  // Close real-time transcription
  closeRealtimeTranscription() {
    if (this.websocket) {
      this.websocket.close();
      this.websocket = null;
    }
  }

  // Extract audio from video file
  async extractAudioFromVideo(videoFile) {
    try {
      // In a real implementation, this would extract audio from video
      // For now, return the video file as-is (AssemblyAI can handle video)
      return videoFile;
    } catch (error) {
      console.error('Audio extraction error:', error);
      throw new Error('Failed to extract audio from video');
    }
  }

  // Batch transcribe multiple files
  async transcribeBatch(files, options = {}) {
    const results = [];
    const errors = [];

    for (let i = 0; i < files.length; i++) {
      try {
        const uploadResult = await this.uploadAudio(files[i]);
        const transcription = await this.transcribeAudio(uploadResult.upload_url, options);
        
        results.push({
          index: i,
          filename: files[i].name,
          transcription
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
}

// Export singleton instance
export const assemblyAiService = new AssemblyAiService();