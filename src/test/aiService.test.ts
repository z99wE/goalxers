import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { generateTextResponse, transcribeAudio, generateSpeech } from '../services/aiService';

const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('aiService', () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it('generateTextResponse handles successful chat (Groq Primary)', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ choices: [{ message: { content: 'Mock response' } }] })
    });

    const result = await generateTextResponse([{ role: 'user', content: 'hello' }]);
    expect(result).toBe('Mock response');
    // First call should be to groq
    expect(mockFetch).toHaveBeenCalledWith('/api/groq/chat', expect.any(Object));
  });

  it('generateTextResponse falls back to NIM if Groq fails', async () => {
    // 1. Groq fails
    mockFetch.mockResolvedValueOnce({
      ok: false,
      statusText: 'Internal Error'
    });
    // 2. NIM succeeds
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ choices: [{ message: { content: 'NIM Fallback response' } }] })
    });

    const result = await generateTextResponse([{ role: 'user', content: 'hello fallback' }]);
    expect(result).toBe('NIM Fallback response');
  });

  it('transcribeAudio handles token fetching and API', async () => {
    // 1. Token fetch
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ token: 'mock-token' })
    });
    
    // 2. STT
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ results: { channels: [{ alternatives: [{ transcript: 'mock transcript' }] }] } })
    });

    const blob = new Blob(['audio'], { type: 'audio/webm' });
    const transcript = await transcribeAudio(blob);
    expect(transcript).toBe('mock transcript');
  });

  it('generateSpeech falls back to Sarvam if Deepgram fails', async () => {
    // 1. Deepgram token fails
    mockFetch.mockResolvedValueOnce({
      ok: false,
      statusText: 'Deepgram TTS Error'
    });
    
    // 2. Sarvam succeeds, returns json with base64 audio
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ audios: ['U0lMRU5DRQ=='] }) // "SILENCE" in base64
    });

    const speechBlob = await generateSpeech('hello fallback');
    expect(speechBlob).toBeInstanceOf(Blob);
  });
});
