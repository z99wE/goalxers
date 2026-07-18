import { describe, test, expect, vi, beforeEach } from 'vitest';
import { GroqProvider, NIMProvider, ResilientLLMRouter } from '../services/llm/LLMProvider';

// Mock global fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe('LLMProvider', () => {
  beforeEach(() => {
    mockFetch.mockReset();
    vi.clearAllMocks();
  });

  describe('GroqProvider', () => {
    test('chat returns content on success', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ choices: [{ message: { content: 'Groq Response' } }] }),
      });

      const provider = new GroqProvider();
      const response = await provider.chat([{ role: 'user', content: 'hello' }]);

      expect(response).toBe('Groq Response');
      expect(mockFetch).toHaveBeenCalledWith('/api/groq/chat', expect.any(Object));
    });

    test('chat throws on error', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        statusText: 'Internal Server Error',
      });

      const provider = new GroqProvider();
      await expect(provider.chat([{ role: 'user', content: 'hello' }])).rejects.toThrow('Groq API Error: Internal Server Error');
    });
  });

  describe('NIMProvider', () => {
    test('chat returns content on success', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ choices: [{ message: { content: 'NIM Response' } }] }),
      });

      const provider = new NIMProvider();
      const response = await provider.chat([{ role: 'user', content: 'hello' }]);

      expect(response).toBe('NIM Response');
      expect(mockFetch).toHaveBeenCalledWith('/api/nim/chat', expect.any(Object));
    });

    test('chat throws on error', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: false,
        statusText: 'Bad Request',
      });

      const provider = new NIMProvider();
      await expect(provider.chat([{ role: 'user', content: 'hello' }])).rejects.toThrow('NIM API Error: Bad Request');
    });
  });

  describe('ResilientLLMRouter', () => {
    test('uses primary provider on success', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ choices: [{ message: { content: 'Groq Response' } }] }),
      });

      const router = new ResilientLLMRouter();
      const response = await router.chat([{ role: 'user', content: 'hello' }]);

      expect(response).toBe('Groq Response');
      // Should have only called the primary endpoint
      expect(mockFetch).toHaveBeenCalledTimes(1);
      expect(mockFetch).toHaveBeenCalledWith('/api/groq/chat', expect.any(Object));
    });

    test('falls back to secondary provider if primary fails', async () => {
      // Primary fails
      mockFetch.mockResolvedValueOnce({
        ok: false,
        statusText: 'Internal Server Error',
      });
      // Secondary succeeds
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ choices: [{ message: { content: 'NIM Response' } }] }),
      });

      const router = new ResilientLLMRouter();
      
      // Spy on console.warn
      const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
      
      const response = await router.chat([{ role: 'user', content: 'hello' }]);

      expect(response).toBe('NIM Response');
      expect(mockFetch).toHaveBeenCalledTimes(2);
      expect(mockFetch).toHaveBeenNthCalledWith(1, '/api/groq/chat', expect.any(Object));
      expect(mockFetch).toHaveBeenNthCalledWith(2, '/api/nim/chat', expect.any(Object));
      
      expect(consoleSpy).toHaveBeenCalledWith('Primary LLM failed, falling back to NIM...', expect.any(Error));
      
      consoleSpy.mockRestore();
    });
  });
});
