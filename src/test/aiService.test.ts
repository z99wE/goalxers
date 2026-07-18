import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { generateTextResponse } from '../services/aiService';

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
    expect(mockFetch).toHaveBeenCalledWith('/api/groq/chat', expect.any(Object));
  });
});
