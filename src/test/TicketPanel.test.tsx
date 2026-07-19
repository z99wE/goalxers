import { render, screen } from '@testing-library/react';
import TicketPanel from '../components/TicketPanel';
import { describe, it, expect } from 'vitest';

describe('TicketPanel', () => {
  it('renders ticket details correctly', () => {
    render(<TicketPanel sectionId="sec-101" onClose={() => {}} />);
    expect(screen.getByText(/ESTADIO AZTECA/i)).toBeInTheDocument();
    expect(screen.getByText(/VIP Club Access/i)).toBeInTheDocument();
  });

  it('renders without onClose button', () => {
    render(<TicketPanel sectionId="sec-105" />);
    // Verify specific styling for non-closable panel
    expect(screen.getByRole('dialog')).toHaveClass('relative w-full max-w-lg mx-auto rounded-3xl my-8');
    expect(screen.queryByLabelText('Close Ticket Panel')).not.toBeInTheDocument();
  });
});
