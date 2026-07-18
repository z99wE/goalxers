/**
 * @file AudioProvider.ts
 * @description Provides a resilient, interface-driven Audio TTS service with automatic fallbacks.
 * Handles fixing the Deepgram Blob conversion issue and integrates Sarvam AI.
 */

export interface IAudioProvider {
  synthesize(text: string): Promise<Blob>;
}

/**
 * Primary Voice Provider using Deepgram
 */
export class DeepgramProvider implements IAudioProvider {
  async synthesize(text: string): Promise<Blob> {
    const tokenRes = await fetch('/api/deepgram/token');
    if (!tokenRes.ok) throw new Error('Failed to fetch Deepgram token');
    const { token } = await tokenRes.json();

    const response = await fetch('https://api.deepgram.com/v1/speak?model=aura-asteria-en', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      throw new Error(`Deepgram TTS error: ${response.statusText}`);
    }

    // Fixed Blob issue here: ensuring the response is explicitly parsed as a blob with correct mime type
    const arrayBuffer = await response.arrayBuffer();
    return new Blob([arrayBuffer], { type: 'audio/mpeg' });
  }
}

/**
 * Fallback Voice Provider using Sarvam AI
 */
export class SarvamProvider implements IAudioProvider {
  async synthesize(text: string): Promise<Blob> {
    const response = await fetch('/api/sarvam/tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        inputs: [text],
        target_language_code: 'en-IN' // using Indian English as fallback
      }),
    });

    if (!response.ok) {
      throw new Error(`Sarvam API Error: ${response.statusText}`);
    }

    const data = await response.json();
    if (data.audios && data.audios.length > 0) {
      // Decode base64 to Blob
      const base64 = data.audios[0];
      const binaryString = window.atob(base64);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      return new Blob([bytes], { type: 'audio/wav' });
    }
    
    throw new Error('No audio returned from Sarvam AI');
  }
}

/**
 * Resilient Audio Router that falls back to Sarvam if Deepgram fails.
 */
export class ResilientAudioRouter implements IAudioProvider {
  private primary: IAudioProvider;
  private secondary: IAudioProvider;

  constructor() {
    this.primary = new DeepgramProvider();
    this.secondary = new SarvamProvider();
  }

  async synthesize(text: string): Promise<Blob> {
    try {
      console.log('Attempting Primary Audio (Sarvam AI)...');
      return await this.secondary.synthesize(text);
    } catch (error) {
      console.warn('Sarvam AI failed, falling back to Deepgram...', error);
      try {
        return await this.primary.synthesize(text);
      } catch (dgErr) {
        throw new Error(`All audio synthesis options failed. Sarvam: ${error}. Deepgram: ${dgErr}`);
      }
    }
  }
}

export const audioRouter = new ResilientAudioRouter();
