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
