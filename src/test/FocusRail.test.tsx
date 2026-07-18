import { describe, test, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { FocusRail } from '../components/ui/focus-rail';

const TEST_ITEMS = [
  { id: 1, title: 'Item 1', imageSrc: '/fan_chat_1.jpg' },
  { id: 2, title: 'Item 2', imageSrc: '/fan_chat_2.jpg' },
];

describe('FocusRail', () => {
  test('renders item titles', () => {
    render(
      <BrowserRouter>
        <FocusRail items={TEST_ITEMS} />
      </BrowserRouter>
    );
    expect(screen.getByText('Item 1')).toBeInTheDocument();
  });
});
