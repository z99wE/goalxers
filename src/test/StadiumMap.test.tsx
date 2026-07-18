import { render, screen, fireEvent } from '@testing-library/react';
import StadiumMap from '../components/StadiumMap';
import { describe, it, expect, vi } from 'vitest';

vi.mock('react-leaflet', () => ({
  MapContainer: ({ children }: any) => <div data-testid="map-container">{children}</div>,
  TileLayer: () => <div data-testid="tile-layer" />,
  Marker: ({ children }: any) => <div data-testid="marker">{children}</div>,
  Popup: ({ children }: any) => <div data-testid="popup">{children}</div>,
  Polygon: () => <div data-testid="polygon" />,
  Circle: () => <div data-testid="circle" />,
  ZoomControl: () => <div data-testid="zoom-control" />
}));

describe('StadiumMap', () => {
  it('renders map container and controls', () => {
    render(<StadiumMap onClose={() => {}} />);
    expect(screen.getByTestId('map-container')).toBeInTheDocument();
  });

  it('calls onClose when back button is clicked', () => {
    const onClose = vi.fn();
    render(<StadiumMap onClose={onClose} />);
    const backBtn = screen.getByRole('button', { name: /Close Map/i });
    fireEvent.click(backBtn);
    expect(onClose).toHaveBeenCalled();
  });
});
