import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import GenAIAssistant from '../components/GenAIAssistant';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { orchestrator } from '../services/agents/Orchestrator';

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
    window.HTMLElement.prototype.scrollTo = vi.fn();
  });

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('opens chat panel and sends a message', async () => {
    render(<GenAIAssistant />);
    
    // Open chat
    const triggerBtn = screen.getByLabelText(/Open AI Assistant/i);
    await act(async () => {
      fireEvent.click(triggerBtn);
    });
    
    // Check if open
    expect(screen.getByPlaceholderText(/Ask about tickets, stadiums, schedules/i)).toBeInTheDocument();
    
    // Type and send
    const input = screen.getByPlaceholderText(/Ask about tickets, stadiums, schedules/i);
    await act(async () => {
      fireEvent.change(input, { target: { value: 'Hi' } });
    });
    
    const sendBtn = screen.getByRole('button', { name: /send message/i });
    await act(async () => {
      fireEvent.click(sendBtn);
    });
    
    await waitFor(() => {
        expect(screen.getAllByText('Hello from AI').length).toBeGreaterThan(0);
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
    await act(async () => {
      fireEvent.click(quickQuery);
    });

    await waitFor(() => {
        expect(screen.getAllByText('Hello from AI').length).toBeGreaterThan(0);
    });
  });

  it('closes the chat panel when close button is clicked', async () => {
    render(<GenAIAssistant />);
    
    // Open chat
    const triggerBtn = screen.getByLabelText(/Open AI Assistant/i);
    await act(async () => {
      fireEvent.click(triggerBtn);
    });
    
    const closeBtn = screen.getByLabelText(/Close AI Assistant/i);
    await act(async () => {
      fireEvent.click(closeBtn);
    });

    await waitFor(() => {
        expect(screen.queryByPlaceholderText(/Ask about tickets, stadiums, schedules/i)).not.toBeInTheDocument();
    });
  });

  it('closes on Escape key press when not embedded', async () => {
    render(<GenAIAssistant />);
    
    const triggerBtn = screen.getByLabelText(/Open AI Assistant/i);
    await act(async () => {
      fireEvent.click(triggerBtn);
    });

    expect(screen.getByPlaceholderText(/Ask about tickets, stadiums, schedules/i)).toBeInTheDocument();

    // Fire non-Escape key first (to cover false branch)
    await act(async () => {
      fireEvent.keyDown(window, { key: 'Enter', code: 'Enter' });
    });
    // Should still be open
    expect(screen.getByPlaceholderText(/Ask about tickets, stadiums, schedules/i)).toBeInTheDocument();

    await act(async () => {
      fireEvent.keyDown(window, { key: 'Escape', code: 'Escape' });
    });

    await waitFor(() => {
        expect(screen.queryByPlaceholderText(/Ask about tickets, stadiums, schedules/i)).not.toBeInTheDocument();
    });
  });

  it('ignores Escape key press when embedded', async () => {
    render(<GenAIAssistant embedded />);
    
    expect(screen.getByPlaceholderText(/Ask about tickets, stadiums, schedules/i)).toBeInTheDocument();

    await act(async () => {
      fireEvent.keyDown(window, { key: 'Escape', code: 'Escape' });
    });

    // Should still be open
    expect(screen.getByPlaceholderText(/Ask about tickets, stadiums, schedules/i)).toBeInTheDocument();
  });

  it('clears chat and activities when clear button is clicked', async () => {
    render(<GenAIAssistant embedded />);
    
    // Ensure history exists by finding Clear button
    const clearBtn = screen.getByLabelText(/Clear chat history/i);
    await act(async () => {
      fireEvent.click(clearBtn);
    });

    // Check if UI responds (activities wiped)
    expect(screen.queryByText('Agent Activity')).not.toBeInTheDocument();
  });

  it('handles localStorage read and write errors gracefully', async () => {
    const mockGetItem = vi.spyOn(Storage.prototype, 'getItem').mockImplementation(() => { throw new Error('Storage disabled'); });
    const mockSetItem = vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('Storage disabled'); });
    const originalWarn = console.warn;
    console.warn = vi.fn();

    render(<GenAIAssistant embedded />);
    
    const input = screen.getByPlaceholderText(/Ask about tickets, stadiums, schedules/i);
    await act(async () => {
      fireEvent.change(input, { target: { value: 'Hi' } });
    });
    const sendBtn = screen.getByRole('button', { name: /send message/i });
    await act(async () => {
      fireEvent.click(sendBtn);
    });

    expect(console.warn).toHaveBeenCalledWith('Failed to load chat history from localStorage:', expect.any(Error));
    expect(console.warn).toHaveBeenCalledWith('Failed to save chat history to localStorage:', expect.any(Error));

    mockGetItem.mockRestore();
    mockSetItem.mockRestore();
    console.warn = originalWarn;
  });

  it('handles LLM API call failures gracefully', async () => {
    const aiService = await import('../services/aiService');
    const mockError = new Error('API down');
    vi.mocked(aiService.generateTextResponse).mockRejectedValueOnce(mockError);
    
    const originalError = console.error;
    console.error = vi.fn();

    render(<GenAIAssistant embedded />);
    
    const input = screen.getByPlaceholderText(/Ask about tickets, stadiums, schedules/i);
    await act(async () => {
      fireEvent.change(input, { target: { value: 'Crash' } });
    });
    const sendBtn = screen.getByRole('button', { name: /send message/i });
    await act(async () => {
      fireEvent.click(sendBtn);
    });

    await waitFor(() => {
      expect(console.error).toHaveBeenCalledWith('LLM API call failed:', mockError);
    });

    console.error = originalError;
  });

  it('renders agent activity feed', async () => {
    render(<GenAIAssistant embedded />);

    await act(async () => {
      // Simulate orchestrator activity
      const cb = (orchestrator as any).activityListeners[0];
      if (cb) {
        cb({ agent: 'TestAgent', message: 'Test message', status: 'done' });
        cb({ agent: 'TestAgent', message: 'Fallback triggered', status: 'fallback' });
        cb({ agent: 'TestAgent', message: 'Routing query', status: 'routing' });
        cb({ agent: 'TestAgent', message: 'Working', status: 'working' });
      }
    });

    expect(screen.getByText('Agent Activity')).toBeInTheDocument();
    expect(screen.getByText('Test message')).toBeInTheDocument();
    expect(screen.getByText('Fallback triggered')).toBeInTheDocument();
    expect(screen.getByText('Routing query')).toBeInTheDocument();
    expect(screen.getByText('Working')).toBeInTheDocument();
  });
});
