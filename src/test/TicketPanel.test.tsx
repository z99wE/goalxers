import { render, screen } from '@testing-library/react';
import TicketPanel from '../components/TicketPanel';
import { describe, it, expect } from 'vitest';

describe('TicketPanel', () => {
  it('renders ticket details correctly', () => {
    render(<TicketPanel sectionId="sec-101" onClose={() => {}} />);
    expect(screen.getByText(/Elite Hospitality/i)).toBeInTheDocument();
    expect(screen.getByText(/SECTION 101/i)).toBeInTheDocument();
  });
});
