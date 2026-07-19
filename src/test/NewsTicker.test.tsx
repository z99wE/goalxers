import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import NewsTicker from '../components/NewsTicker';

describe('NewsTicker', () => {
  it('renders the breaking news text', () => {
    render(<NewsTicker />);
    expect(screen.getByText('LATEST NEWS')).toBeInTheDocument();
    
    // Check if one of the news strings is present
    expect(screen.getAllByText(/BREAKING: Estadio Azteca confirmed/i)[0]).toBeInTheDocument();
  });

  it('can be paused and played by clicking the button', () => {
    render(<NewsTicker />);
    
    const toggleBtn = screen.getByLabelText(/Pause news ticker/i);
    expect(toggleBtn).toBeInTheDocument();
    expect(toggleBtn).toHaveAttribute('aria-pressed', 'false');

    // Click to pause
    fireEvent.click(toggleBtn);
    expect(toggleBtn).toHaveAttribute('aria-label', 'Play news ticker');
    expect(toggleBtn).toHaveAttribute('aria-pressed', 'true');

    // The container track should now have the "paused" class
    const track = document.querySelector('.ticker-track');
    expect(track?.className).toContain('paused');

    // Click to play
    fireEvent.click(toggleBtn);
    expect(toggleBtn).toHaveAttribute('aria-label', 'Pause news ticker');
    expect(toggleBtn).toHaveAttribute('aria-pressed', 'false');
    expect(track?.className).not.toContain('paused');
  });
});
