import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const STADIUM_CENTER: [number, number] = [40.8136, -74.0745];

interface StadiumMapProps {
  onClose?: () => void;
}

export default function StadiumMap({ onClose }: StadiumMapProps) {
  return (
    <div className="absolute inset-0 z-20 bg-black/90 backdrop-blur-md flex flex-col pointer-events-auto">
      <div className="absolute top-4 left-4 z-[1000] glass-panel bg-nexus-dark/90 p-4 rounded-xl border border-white/10">
        <h2 className="text-2xl font-bold tracking-tight text-nexus-accent">NY/NJ Host City Operations</h2>
        <p className="text-sm text-white/60">Live congestion & transit routing</p>
      </div>
      <button 
        onClick={onClose}
        className="absolute top-6 right-6 z-[1000] p-3 rounded-full bg-white/5 hover:bg-white/10 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-white"
        aria-label="Close Map"
      >
        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <div className="flex-1 w-full relative">
        <MapContainer 
          center={STADIUM_CENTER} 
          zoom={15} 
          className="w-full h-full"
          zoomControl={false}
        >
          <TileLayer
            attribution='&copy; OpenStreetMap'
            url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          />
          
          <Marker position={STADIUM_CENTER}>
            <Popup>
              <div className="font-bold text-gray-900">MetLife Stadium (NY/NJ) - Final Venue</div>
            </Popup>
          </Marker>

          <Circle center={[40.8110, -74.0700]} pathOptions={{ fillColor: 'red', color: 'red' }} radius={100}>
            <Popup>High Crowd Congestion (Fan Zone B)</Popup>
          </Circle>

          <Circle center={[40.8170, -74.0780]} pathOptions={{ fillColor: '#d4af37', color: '#d4af37' }} radius={80}>
            <Popup>
              <div className="text-nexus-dark font-bold">Meadowlands Rail Station - Smooth Flow</div>
            </Popup>
          </Circle>
        </MapContainer>
        
        <div className="absolute bottom-6 left-6 right-6 z-[1000] flex gap-4 pointer-events-none">
           <div className="glass-panel p-4 rounded-xl flex-1 pointer-events-auto bg-[#0a0a0f]/80 backdrop-blur-md border border-white/10">
              <h3 className="text-sm font-semibold text-white/80 uppercase tracking-wider mb-2">Crowd Density</h3>
              <div className="flex items-center gap-2">
                 <div className="w-3 h-3 rounded-full bg-[#d4af37]"></div><span className="text-sm text-white/70">Low</span>
                 <div className="w-3 h-3 rounded-full bg-yellow-500 ml-2"></div><span className="text-sm text-white/70">Medium</span>
                 <div className="w-3 h-3 rounded-full bg-red-500 ml-2"></div><span className="text-sm text-white/70">High</span>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
