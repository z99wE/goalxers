import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import GenAIAssistant from '../components/GenAIAssistant';
import { describe, it, expect, vi } from 'vitest';

vi.mock('../services/aiService', () => ({
  generateTextResponse: vi.fn().mockResolvedValue('Hello from AI'),
  generateSpeech: vi.fn().mockResolvedValue(undefined),
}));

vi.mock('react-hot-toast', () => ({
  default: {
    error: vi.fn(),
    success: vi.fn(),
  }
}));

describe('GenAIAssistant', () => {
  beforeAll(() => {
    window.HTMLElement.prototype.scrollIntoView = vi.fn();
  });

  it('opens chat panel and sends a message', async () => {
    render(<GenAIAssistant />);
    
    // Open chat
    const triggerBtn = screen.getByLabelText(/Open AI Assistant/i);
    fireEvent.click(triggerBtn);
    
    // Check if open
    expect(screen.getByPlaceholderText(/Ask about tickets, stadiums, schedules/i)).toBeInTheDocument();
    
    // Type and send
    const input = screen.getByPlaceholderText(/Ask about tickets, stadiums, schedules/i);
    fireEvent.change(input, { target: { value: 'Hi' } });
    
    const sendBtn = screen.getByRole('button', { name: /send message/i });
    fireEvent.click(sendBtn);
    
    await waitFor(() => {
        expect(screen.getByText('Hello from AI')).toBeInTheDocument();
    });
  });
});
