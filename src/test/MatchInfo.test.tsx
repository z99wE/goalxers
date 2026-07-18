import { render, screen } from '@testing-library/react';
import MatchInfo from '../components/MatchInfo';
import { describe, it, expect } from 'vitest';

describe('MatchInfo', () => {
  it('renders match information', () => {
    render(<MatchInfo />);
    expect(screen.getByText(/USA/i)).toBeInTheDocument();
    expect(screen.getByText(/WAL/i)).toBeInTheDocument();
    expect(screen.getByText(/Global Championship Final/i)).toBeInTheDocument();
  });
});
