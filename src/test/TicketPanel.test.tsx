import { render, screen } from '@testing-library/react';
import TicketPanel from '../components/TicketPanel';
import { describe, it, expect } from 'vitest';

describe('TicketPanel', () => {
  it('renders ticket details correctly', () => {
    render(<TicketPanel sectionId="sec-101" onClose={() => {}} />);
    expect(screen.getByText(/ESTADIO AZTECA/i)).toBeInTheDocument();
    expect(screen.getByText(/VIP Club Access/i)).toBeInTheDocument();
  });
});
