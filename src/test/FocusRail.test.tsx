import { describe, test, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { FocusRail } from '../components/ui/focus-rail';

const TEST_ITEMS = [
  { id: 1, title: 'Item 1', imageSrc: '/fan_chat_1.jpg' },
  { id: 2, title: 'Item 2', imageSrc: '/fan_chat_2.jpg' },
  { id: 3, title: 'Item 3', imageSrc: '/fan_chat_3.jpg' },
];

describe('FocusRail', () => {
  test('renders item images', () => {
    render(
      <BrowserRouter>
        <FocusRail items={TEST_ITEMS} />
      </BrowserRouter>
    );
    // FocusRail renders multiple cards (including next/prev layers for 3D effect)
    expect(screen.getAllByRole('img').length).toBeGreaterThanOrEqual(3);
  });

  test('handles next and prev navigation', () => {
    render(
      <BrowserRouter>
        <FocusRail items={TEST_ITEMS} />
      </BrowserRouter>
    );
    
    const prevButton = screen.getByLabelText('Previous');
    const nextButton = screen.getByLabelText('Next');

    expect(prevButton).toBeInTheDocument();
    expect(nextButton).toBeInTheDocument();

    // Click next
    fireEvent.click(nextButton);
    // Click prev
    fireEvent.click(prevButton);
  });
  
  test('handles loop boundaries', () => {
    // Non-looping rail
    render(
      <BrowserRouter>
        <FocusRail items={TEST_ITEMS} loop={false} initialIndex={0} />
      </BrowserRouter>
    );
    
    const prevButton = screen.getByLabelText('Previous');
    // Clicking prev on index 0 without loop shouldn't break
    fireEvent.click(prevButton);
  });

  test('handles keyboard navigation on container', () => {
    render(
      <BrowserRouter>
        <FocusRail items={TEST_ITEMS} />
      </BrowserRouter>
    );

    // The container has tabIndex={0}
    const container = screen.getAllByRole('img')[0].closest('div[tabindex="0"]')!;
    
    fireEvent.keyDown(container, { key: 'ArrowRight' });
    fireEvent.keyDown(container, { key: 'ArrowLeft' });
  });

  test('handles wheel events', () => {
    render(
      <BrowserRouter>
        <FocusRail items={TEST_ITEMS} />
      </BrowserRouter>
    );

    const container = screen.getAllByRole('img')[0].closest('div[tabindex="0"]')!;
    
    // Simulate scroll right
    fireEvent.wheel(container, { deltaX: 50, deltaY: 0 });
    
    // Attempt rapid scroll (should be debounced)
    fireEvent.wheel(container, { deltaX: 50, deltaY: 0 });
    
    // Advance timers or simulate scroll left
    // We can just call it with negative delta to simulate left
    Object.defineProperty(Date, 'now', {
        value: () => new Date().getTime() + 1000,
        writable: true,
        configurable: true
    });
    fireEvent.wheel(container, { deltaX: -50, deltaY: 0 });
  });

  test('handles clicking and keyboard on individual cards', () => {
    render(
      <BrowserRouter>
        <FocusRail items={TEST_ITEMS} />
      </BrowserRouter>
    );

    // Get an adjacent card
    // The items inside the rail with role="button" are the cards
    // The nav buttons are "Previous" and "Next"
    // Since items wrap, there may be multiple copies of "Item 2" rendered at once.
    const card2 = screen.getAllByLabelText('Select Item 2')[0];
    
    fireEvent.click(card2);
    fireEvent.keyDown(card2, { key: 'Enter' });
    fireEvent.keyDown(card2, { key: ' ' });
  });
});
