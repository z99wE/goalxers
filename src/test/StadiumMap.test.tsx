import { render, screen } from '@testing-library/react';
import StadiumMap from '../components/StadiumMap';
import { describe, it, expect, vi } from 'vitest';

vi.mock('react-leaflet', () => ({
  MapContainer: ({ children }: any) => <div data-testid="map-container">{children}</div>,
  TileLayer: () => <div data-testid="tile-layer" />,
  Marker: ({ children }: any) => <div data-testid="marker">{children}</div>,
  Popup: ({ children }: any) => <div data-testid="popup">{children}</div>,
  useMap: () => ({
    setView: vi.fn(),
  }),
}));

const MOCK_STADIUMS = [
  { id: 1, name: 'MetLife Stadium', city: 'East Rutherford, NJ', country: 'USA', capacity: '82,500', matches: 8, highlight: 'Final', lat: 40.8128, lng: -74.0742, transport: 'Train', open: '2010', surface: 'Grass' }
];

describe('StadiumMap', () => {
  it('renders map container and markers', () => {
    const onSelect = vi.fn();
    render(
      <StadiumMap
        stadiums={MOCK_STADIUMS}
        selectedStadium={null}
        onSelectStadium={onSelect}
      />
    );
    expect(screen.getByTestId('map-container')).toBeInTheDocument();
  });
});
