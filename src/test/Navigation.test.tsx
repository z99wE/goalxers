import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Navigation from '../components/Navigation';
import { describe, it, expect } from 'vitest';

describe('Navigation', () => {
  it('renders correctly with all links', () => {
    render(
      <MemoryRouter>
        <Navigation />
      </MemoryRouter>
    );
    expect(screen.getByText(/Home/i)).toBeInTheDocument();
    expect(screen.getByText(/Map/i)).toBeInTheDocument();
    expect(screen.getByText(/Tickets/i)).toBeInTheDocument();
    expect(screen.getByText(/AI Assistant/i)).toBeInTheDocument();
    expect(screen.getByText(/How it Works/i)).toBeInTheDocument();
  });
});
