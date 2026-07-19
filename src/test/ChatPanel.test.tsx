import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ChatPanel from '../components/ChatPanel';

describe('ChatPanel', () => {
  const mockOnSend = vi.fn();
  const mockOnClear = vi.fn();
  const mockOnMessagesChange = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders correctly and calls onClear when clear button is clicked', () => {
    render(
      <ChatPanel
        agentName="Test Agent"
        title="Test Title"
        quickQueries={[]}
        initialMessages={[{ role: 'ai', content: 'Hello' }]}
        onSend={mockOnSend}
        onClear={mockOnClear}
      />
    );

    expect(screen.getByText('Test Agent')).toBeInTheDocument();
    
    const clearBtn = screen.getByLabelText(/Clear chat history/i);
    fireEvent.click(clearBtn);
    expect(mockOnClear).toHaveBeenCalled();
  });

  it('handles errors from onSend gracefully', async () => {
    mockOnSend.mockRejectedValueOnce(new Error('Network error'));
    const originalWarn = console.warn;
    console.warn = vi.fn();

    render(
      <ChatPanel
        agentName="Test Agent"
        title="Test Title"
        quickQueries={[]}
        initialMessages={[]}
        onSend={mockOnSend}
      />
    );

    const input = screen.getByPlaceholderText(/Type your message.../i);
    fireEvent.change(input, { target: { value: 'Crash it' } });
    
    const sendBtn = screen.getByLabelText(/Send message/i);
    fireEvent.click(sendBtn);

    await waitFor(() => {
      expect(screen.getByText(/Service temporarily unavailable/i)).toBeInTheDocument();
    });

    expect(console.warn).toHaveBeenCalled();
    console.warn = originalWarn;
  });

  it('calls scrollTo if available on the scroll container', () => {
    // Mock the browser scrollTo behavior
    const mockScrollTo = vi.fn();
    
    // We can spy on the div creation but it's easier to mock HTMLElement.prototype.scrollTo
    const originalScrollTo = window.HTMLElement.prototype.scrollTo;
    window.HTMLElement.prototype.scrollTo = mockScrollTo;

    render(
      <ChatPanel
        agentName="Test Agent"
        title="Test Title"
        quickQueries={[]}
        initialMessages={[]}
        onSend={mockOnSend}
        onMessagesChange={mockOnMessagesChange}
      />
    );

    expect(mockScrollTo).toHaveBeenCalled();
    expect(mockOnMessagesChange).toHaveBeenCalled();

    window.HTMLElement.prototype.scrollTo = originalScrollTo;
  });
});
