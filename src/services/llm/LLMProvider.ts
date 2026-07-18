/**
 * @file LLMProvider.ts
 * @description Provides a resilient, interface-driven LLM and Voice service architecture with automatic fallbacks.
 * Adheres to senior-fullstack principles of Dependency Injection and fail-safes.
 */

export interface ILLMProvider {
  chat(messages: { role: string; content: string }[]): Promise<string>;
}

export interface IAudioProvider {
  synthesize(text: string): Promise<Blob>;
}

/**
 * Primary LLM Provider using Groq
 */
export class GroqProvider implements ILLMProvider {
  async chat(messages: { role: string; content: string }[]): Promise<string> {
    const response = await fetch('/api/groq/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages }),
    });
    if (!response.ok) throw new Error(`Groq API Error: ${response.statusText}`);
    const data = await response.json();
    return data.choices[0].message.content;
  }
}

/**
 * Fallback LLM Provider using NVIDIA NIM
 */
export class NIMProvider implements ILLMProvider {
  async chat(messages: { role: string; content: string }[]): Promise<string> {
    const response = await fetch('/api/nim/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages }),
    });
    if (!response.ok) throw new Error(`NIM API Error: ${response.statusText}`);
    const data = await response.json();
    return data.choices[0].message.content;
  }
}

/**
 * Resilient LLM Router that automatically falls back to secondary providers if the primary fails.
 */
export class ResilientLLMRouter implements ILLMProvider {
  private primary: ILLMProvider;
  private secondary: ILLMProvider;

  constructor() {
    this.primary = new GroqProvider();
    this.secondary = new NIMProvider();
  }

  async chat(messages: { role: string; content: string }[]): Promise<string> {
    try {
      console.log('Attempting Primary LLM (Groq)...');
      return await this.primary.chat(messages);
    } catch (error) {
      console.warn('Primary LLM failed, falling back to NIM...', error);
      return await this.secondary.chat(messages);
    }
  }
}

export const llmRouter = new ResilientLLMRouter();
