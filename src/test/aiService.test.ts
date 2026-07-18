import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { generateTextResponse, transcribeAudio, generateSpeech } from '../services/aiService';

const mockFetch = vi.fn();
global.fetch = mockFetch;

// Mock Audio
class MockAudio {
  play = vi.fn().mockResolvedValue(undefined);
}
global.Audio = MockAudio as any;
global.URL.createObjectURL = vi.fn().mockReturnValue('blob:mock-url');

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
    expect(mockFetch).toHaveBeenCalledWith('/api/groq/chat', expect.any(Object));
  });

  it('transcribeAudio handles successful server transcription', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ transcript: 'mock transcript' })
    });

    const blob = new Blob(['audio'], { type: 'audio/webm' });
    const transcript = await transcribeAudio(blob);
    expect(transcript).toBe('mock transcript');
    expect(mockFetch).toHaveBeenCalledWith('/api/transcribe', expect.any(Object));
  });

  it('generateSpeech runs without throwing', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ audios: ['U0lMRU5DRQ=='] }) // "SILENCE" in base64
    });

    await expect(generateSpeech('hello text')).resolves.not.toThrow();
  });
});
