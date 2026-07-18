import { describe, test, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import Stadium3D from '../components/Stadium3D';

vi.mock('@react-three/fiber', () => ({
  Canvas: ({ children }: any) => <div data-testid="mock-canvas">{children}</div>,
  useFrame: vi.fn((cb) => {
    // Mock useFrame simply calls the callback once with mock state
    cb({
      clock: { getElapsedTime: () => 1 },
      pointer: { x: 0, y: 0 },
      camera: { position: { y: 0 }, lookAt: vi.fn() }
    });
  }),
}));

vi.mock('@react-three/drei', () => ({
  Environment: () => <div data-testid="mock-environment" />,
  PerspectiveCamera: () => <div data-testid="mock-perspective-camera" />,
  Stars: () => <div data-testid="mock-stars" />,
}));

describe('Stadium3D', () => {
  test('renders the 3D environment components safely without WebGL', () => {
    // Suppress expected React DOM warnings about intrinsic three.js elements in jsdom
    const originalError = console.error;
    console.error = vi.fn();

    const { getByTestId, container } = render(<Stadium3D />);
    
    // Check if the canvas and environment are mocked successfully
    expect(getByTestId('mock-canvas')).toBeInTheDocument();
    expect(getByTestId('mock-environment')).toBeInTheDocument();
    expect(getByTestId('mock-perspective-camera')).toBeInTheDocument();
    expect(getByTestId('mock-stars')).toBeInTheDocument();

    // Check if intrinsic three.js elements (like mesh, group, ambientLight) are present
    // jsdom will render them as custom HTML tags
    expect(container.querySelector('ambientlight')).toBeInTheDocument();
    expect(container.querySelector('directionallight')).toBeInTheDocument();
    expect(container.querySelector('pointlight')).toBeInTheDocument();

    // Restore console.error
    console.error = originalError;
  });
});
