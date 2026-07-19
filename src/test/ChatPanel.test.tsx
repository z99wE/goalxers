import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import ChatPanel from '../components/ChatPanel';

describe('ChatPanel', () => {
  const mockOnSend = vi.fn();
  const mockOnClear = vi.fn();
  const mockOnClose = vi.fn();
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
        onClose={mockOnClose}
      />
    );

    expect(screen.getByText('Test Agent')).toBeInTheDocument();
    
    const clearBtn = screen.getByLabelText(/Clear chat history/i);
    fireEvent.click(clearBtn);
    expect(mockOnClear).toHaveBeenCalled();

    const closeBtn = screen.getByLabelText(/Close AI Assistant/i);
    fireEvent.click(closeBtn);
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('does not render clear button when onClear is not provided', () => {
    render(
      <ChatPanel
        agentName="Test Agent"
        title="Test Title"
        quickQueries={[]}
        initialMessages={[]}
        onSend={mockOnSend}
      />
    );
    expect(screen.queryByLabelText(/Clear chat history/i)).not.toBeInTheDocument();
  });

  it('handles empty input gracefully on send', () => {
    render(
      <ChatPanel
        agentName="Test Agent"
        title="Test Title"
        quickQueries={[]}
        initialMessages={[]}
        onSend={mockOnSend}
      />
    );

    // Try to send empty
    const sendBtn = screen.getByLabelText(/Send message/i);
    fireEvent.click(sendBtn);
    expect(mockOnSend).not.toHaveBeenCalled();

    // Try to submit form empty
    const input = screen.getByPlaceholderText(/Type your message.../i);
    fireEvent.submit(input);
    expect(mockOnSend).not.toHaveBeenCalled();
  });

  it('handles sending via enter key (form submit)', async () => {
    mockOnSend.mockResolvedValueOnce('AI reply');
    
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
    fireEvent.change(input, { target: { value: 'Valid input' } });
    fireEvent.submit(input);

    expect(mockOnSend).toHaveBeenCalledWith('Valid input', [{ role: 'user', content: 'Valid input' }]);
    
    await waitFor(() => {
      expect(screen.getByText('AI reply')).toBeInTheDocument();
    });
  });

  it('handles quick queries clicks', async () => {
    mockOnSend.mockResolvedValueOnce('Quick response');
    
    render(
      <ChatPanel
        agentName="Test Agent"
        title="Test Title"
        quickQueries={['Hello', 'Help']}
        initialMessages={[]}
        onSend={mockOnSend}
      />
    );

    const quickBtn = screen.getByText('Hello');
    fireEvent.click(quickBtn);

    expect(mockOnSend).toHaveBeenCalledWith('Hello', [{ role: 'user', content: 'Hello' }]);
    
    await waitFor(() => {
      expect(screen.getByText('Quick response')).toBeInTheDocument();
    });
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
    const mockScrollTo = vi.fn();
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
        subtitle="Some subtitle"
      />
    );

    expect(mockScrollTo).toHaveBeenCalled();
    expect(mockOnMessagesChange).toHaveBeenCalled();

    window.HTMLElement.prototype.scrollTo = originalScrollTo;
  });

  it('renders without multi-agent indicator if embedded', () => {
    render(
      <ChatPanel
        agentName="Test Agent"
        title="Test Title"
        quickQueries={[]}
        initialMessages={[]}
        onSend={mockOnSend}
        embedded={true}
      />
    );
    expect(screen.queryByText(/Multi-Agent Online/i)).not.toBeInTheDocument();
  });
});
