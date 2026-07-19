import { describe, test, expect, vi, beforeAll, afterAll } from 'vitest';
import { render, screen, act } from '@testing-library/react';

vi.mock('framer-motion', async () => {
  const actual = await vi.importActual('framer-motion') as any;
  return {
    ...actual,
    AnimatePresence: ({ children }: any) => <>{children}</>,
    motion: {
      div: ({ children, ...props }: any) => <div {...props}>{children}</div>
    }
  };
});
import { SoccerQuotes } from '../components/ui/soccer-quotes';

describe('SoccerQuotes', () => {
  beforeAll(() => {
    vi.useFakeTimers();
  });

  afterAll(() => {
    vi.useRealTimers();
  });

  test('renders initial quote and cycles on interval', () => {
    render(<SoccerQuotes />);
    
    // Initial quote
    expect(screen.getByText(/Bill Shankly/i)).toBeInTheDocument();

    // Advance time by 6 seconds
    act(() => {
      vi.advanceTimersByTime(6000);
    });

    // Should render second quote
    expect(screen.getByText(/Ronaldinho/i)).toBeInTheDocument();
  });
});
