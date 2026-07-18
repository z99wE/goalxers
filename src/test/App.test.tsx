import { render, screen, waitFor } from '@testing-library/react';
import App from '../App';
import { describe, it, expect, vi } from 'vitest';

vi.mock('../components/Stadium3D', () => ({
  default: () => <div data-testid="stadium-3d" />,
}));

vi.mock('../components/GenAIAssistant', () => ({
  default: () => <div data-testid="genai-assistant" />,
}));

describe('App Component', () => {
  it('renders core components on home page', async () => {
    window.history.pushState({}, 'Test page', '/');
    render(<App />);
    // Wait for lazy-loaded Home page to resolve via Suspense
    await waitFor(() => {
      expect(screen.getByText(/routes your questions/i)).toBeInTheDocument();
    });
  });
});
