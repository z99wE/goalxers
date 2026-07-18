import { render, screen } from '@testing-library/react';
import App from '../App';
import { describe, it, expect, vi } from 'vitest';

vi.mock('../components/Stadium3D', () => ({
  default: () => <div data-testid="stadium-3d" />
}));

vi.mock('../components/GenAIAssistant', () => ({
  default: () => <div data-testid="genai-assistant" />
}));

describe('App Component', () => {
  it('renders core components on home page', async () => {
    window.history.pushState({}, 'Test page', '/');
    render(<App />);
    expect(screen.getByText(/Every Match/i)).toBeInTheDocument();
  });
});
