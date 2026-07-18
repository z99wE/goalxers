import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import HowItWorks from '../components/HowItWorks';
import { describe, it, expect } from 'vitest';

describe('HowItWorks', () => {
  it('renders core components', () => {
    render(<MemoryRouter><HowItWorks /></MemoryRouter>);
    expect(screen.getByText(/Navigation Agent/i)).toBeInTheDocument();
    expect(screen.getByText(/Ticketing Agent/i)).toBeInTheDocument();
  });
});
