import { describe, test, expect, vi } from 'vitest';
import { render, fireEvent } from '@testing-library/react';
import StadiumBackground from '../components/StadiumBackground';

// Mock matchMedia for framer-motion if needed, though jsdom might have it
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // Deprecated
    removeListener: vi.fn(), // Deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

describe('StadiumBackground', () => {
  test('renders the background image and sections', () => {
    const onSectionSelect = vi.fn();
    const { getByAltText, getByText } = render(
      <StadiumBackground onSectionSelect={onSectionSelect} selectedSection={null} />
    );

    // Verify background image exists
    expect(getByAltText('Stadium Background')).toBeInTheDocument();

    // Verify interactive sections exist (from mock data in component)
    expect(getByText(/127/)).toBeInTheDocument();
    expect(getByText(/221/)).toBeInTheDocument();
    expect(getByText(/105/)).toBeInTheDocument();
    expect(getByText(/315/)).toBeInTheDocument();
  });

  test('calls onSectionSelect when a section is clicked', () => {
    const onSectionSelect = vi.fn();
    const { getByText } = render(
      <StadiumBackground onSectionSelect={onSectionSelect} selectedSection={null} />
    );

    const section127 = getByText(/127/);
    fireEvent.click(section127);

    // Check if callback is fired with correct section ID
    expect(onSectionSelect).toHaveBeenCalledWith('sec-127');
  });

  test('does not render sections when one is already selected', () => {
    const onSectionSelect = vi.fn();
    const { queryByText } = render(
      <StadiumBackground onSectionSelect={onSectionSelect} selectedSection="sec-127" />
    );

    // Sections should disappear or be hidden based on component logic
    expect(queryByText('127')).not.toBeInTheDocument();
    expect(queryByText('221')).not.toBeInTheDocument();
  });

  test('handles global mouse movement for parallax', () => {
    const onSectionSelect = vi.fn();
    const { unmount } = render(<StadiumBackground onSectionSelect={onSectionSelect} selectedSection={null} />);

    // Simulate mouse move on window
    fireEvent.mouseMove(window, { clientX: 500, clientY: 500 });
    
    // Unmount and simulate again to hit the !containerRef.current branch (if possible)
    unmount();
    fireEvent.mouseMove(window, { clientX: 500, clientY: 500 });
  });

  test('handles mouse enter and leave on sections', () => {
    const onSectionSelect = vi.fn();
    const { getByText } = render(
      <StadiumBackground onSectionSelect={onSectionSelect} selectedSection={null} />
    );

    const section127 = getByText(/127/).closest('button')!;
    
    // Simulate hover
    fireEvent.mouseEnter(section127);
    fireEvent.mouseLeave(section127);
  });
});
