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
  const response = await fetch('/api/transcribe', {
    method: 'POST',
    headers: {
      'Content-Type': audioBlob.type || 'audio/webm',
    },
    body: audioBlob,
  });

  if (!response.ok) throw new Error('Transcription failed');
  const data = await response.json();
  return data.transcript || '';
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
