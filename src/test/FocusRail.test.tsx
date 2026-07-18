import { describe, test, expect, vi } from 'vitest';
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
});
