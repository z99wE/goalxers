import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Custom SVG marker for a premium dark football theme
const createMarkerIcon = (isSelected: boolean) => {
  return L.divIcon({
    className: 'custom-stadium-marker',
    html: `
      <div style="
        width: ${isSelected ? '20px' : '14px'};
        height: ${isSelected ? '20px' : '14px'};
        background-color: ${isSelected ? '#facc15' : '#ffffff'};
        border: 2px solid #000000;
        border-radius: 50%;
        box-shadow: 0 0 ${isSelected ? '14px #facc15' : '6px rgba(255,255,255,0.4)'};
        transition: all 0.3s ease;
      "></div>
    `,
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });
};

interface Stadium {
  id: number;
  name: string;
  city: string;
  country: string;
  capacity: string;
  matches: number;
  highlight: string;
  lat: number;
  lng: number;
  transport: string;
}

interface StadiumMapProps {
  stadiums: Stadium[];
  selectedStadium: Stadium | null;
  onSelectStadium: (stadium: Stadium) => void;
}

// Sub-component to control map centering/zooming dynamically
function MapController({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom, { animate: true, duration: 1 });
  }, [center, zoom, map]);
  return null;
}

export default function StadiumMap({ stadiums, selectedStadium, onSelectStadium }: StadiumMapProps) {
  // Default map center (geographic center of North America/USA area)
  const defaultCenter: [number, number] = [37.0902, -95.7129];
  const defaultZoom = 4;

  const activeCenter: [number, number] = selectedStadium
    ? [selectedStadium.lat, selectedStadium.lng]
    : defaultCenter;

  const activeZoom = selectedStadium ? 13 : defaultZoom;

  return (
    <div className="w-full h-[320px] rounded-2xl overflow-hidden border border-white/8 relative z-10 shadow-lg">
      <MapContainer
        center={activeCenter}
        zoom={activeZoom}
        className="w-full h-full"
        zoomControl={true}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap &copy; CartoDB'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />

        <MapController center={activeCenter} zoom={activeZoom} />

        {stadiums.map((s) => {
          const isSelected = selectedStadium?.id === s.id;
          return (
            <Marker
              key={s.id}
              position={[s.lat, s.lng]}
              icon={createMarkerIcon(isSelected)}
              eventHandlers={{
                click: () => onSelectStadium(s),
              }}
            >
              <Popup>
                <div className="text-[#050508] p-1 font-sans">
                  <p className="text-[10px] font-mono text-slate-500 uppercase tracking-wider mb-0.5">{s.city}</p>
                  <h4 className="font-black text-sm mb-1">{s.name}</h4>
                  <p className="text-xs text-slate-600">Capacity: <strong>{s.capacity}</strong></p>
                  <p className="text-xs text-slate-600">Matches: <strong>{s.matches} ({s.highlight})</strong></p>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
