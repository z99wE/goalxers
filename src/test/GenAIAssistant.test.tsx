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

  it('can be used in embedded mode without trigger button', () => {
    render(<GenAIAssistant embedded />);
    // Should be open immediately without trigger button
    expect(screen.queryByLabelText(/Open AI Assistant/i)).not.toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Ask about tickets, stadiums, schedules/i)).toBeInTheDocument();
  });

  it('can send a quick query', async () => {
    render(<GenAIAssistant embedded />);
    
    const quickQuery = screen.getByText(/Find tickets for the World Cup Final/i);
    fireEvent.click(quickQuery);

    await waitFor(() => {
        expect(screen.getByText('Hello from AI')).toBeInTheDocument();
    });
  });

  it('closes the chat panel when close button is clicked', async () => {
    render(<GenAIAssistant />);
    
    // Open chat
    const triggerBtn = screen.getByLabelText(/Open AI Assistant/i);
    fireEvent.click(triggerBtn);
    
    const closeBtn = screen.getByLabelText(/Close AI Assistant/i);
    fireEvent.click(closeBtn);

    await waitFor(() => {
        expect(screen.queryByPlaceholderText(/Ask about tickets, stadiums, schedules/i)).not.toBeInTheDocument();
    });
  });
});
