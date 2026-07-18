/**
 * @file aiService.ts
 * Facade over the multi-agent orchestrator. Clean API boundary for all AI features.
 */
import { orchestrator } from './agents/Orchestrator';

export async function generateTextResponse(
  messages: { role: string; content: string }[]
): Promise<string> {
  return orchestrator.handleUserMessage(messages);
}

export async function transcribeAudio(audioBlob: Blob): Promise<string> {
  const tokenRes = await fetch('/api/deepgram/token');
  if (!tokenRes.ok) throw new Error('Deepgram token unavailable');
  const { token } = await tokenRes.json();

  const response = await fetch(
    'https://api.deepgram.com/v1/listen?model=nova-2&smart_format=true',
    {
      method: 'POST',
      headers: {
        Authorization: `Token ${token}`,
        'Content-Type': audioBlob.type || 'audio/webm',
      },
      body: audioBlob,
    }
  );

  if (!response.ok) throw new Error(`Deepgram STT error: ${response.statusText}`);
  const data = await response.json();
  return data.results?.channels[0]?.alternatives[0]?.transcript || '';
}

/** Silent-fail speech synthesis — never throws to caller. */
export async function generateSpeech(text: string): Promise<void> {
  try {
    const blob = await orchestrator.handleAudioSynthesis(text);
    const url = URL.createObjectURL(blob);
    const audio = new Audio(url);
    audio.play().catch(() => {}); // Ignore autoplay block
  } catch {
    // Silent fail — audio is an enhancement, not a requirement
  }
}
