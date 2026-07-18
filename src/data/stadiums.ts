export interface Stadium {
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
  open: string;
  surface: string;
}

export const STADIUMS: Stadium[] = [
  { id: 1, name: 'MetLife Stadium', city: 'East Rutherford, NJ', country: 'USA', capacity: '82,500', matches: 8, highlight: 'Final', lat: 40.8128, lng: -74.0742, transport: 'NJ Transit rail to Meadowlands Station (8 min from Penn Station)', open: '2010', surface: 'Bermuda grass' },
  { id: 2, name: 'AT&T Stadium', city: 'Arlington, TX', country: 'USA', capacity: '80,000', matches: 7, highlight: 'Semifinal', lat: 32.7479, lng: -97.0945, transport: 'TRE Rail to CentrePort/DFW, free shuttle. From Dallas Union Station: 35 min', open: '2009', surface: 'Hybrid grass' },
  { id: 3, name: 'Estadio Azteca', city: 'Mexico City', country: 'Mexico', capacity: '83,264', matches: 5, highlight: 'Opener', lat: 19.303, lng: -99.1505, transport: 'Metro Line 2 to Tasqueña, then Metrobús to stadium. 45 min from Centro', open: '1966', surface: 'Natural grass' },
  { id: 4, name: 'SoFi Stadium', city: 'Inglewood, CA', country: 'USA', capacity: '70,240', matches: 7, highlight: 'Quarterfinal', lat: 33.9535, lng: -118.3392, transport: 'Metro E Line to Downtown Inglewood + shuttle. 35 min from downtown LA', open: '2020', surface: 'Bermuda grass' },
  { id: 5, name: 'Rose Bowl', city: 'Pasadena, CA', country: 'USA', capacity: '88,565', matches: 5, highlight: 'Semifinal', lat: 34.1614, lng: -118.1676, transport: 'Metro Gold Line to Memorial Park + shuttle. 20 min from downtown Pasadena', open: '1922', surface: 'Bermuda grass' },
  { id: 6, name: 'NRG Stadium', city: 'Houston, TX', country: 'USA', capacity: '72,220', matches: 5, highlight: 'Quarterfinal', lat: 29.6847, lng: -95.4107, transport: 'MetroRail Red Line to Reliant Park. 25 min from downtown Houston', open: '2002', surface: 'FieldTurf' },
  { id: 7, name: 'Mercedes-Benz Stadium', city: 'Atlanta, GA', country: 'USA', capacity: '71,000', matches: 5, highlight: 'Round of 16', lat: 33.7554, lng: -84.401, transport: 'MARTA Green/Blue Line to GWCC/CNN Center. 10 min walk from station', open: '2017', surface: 'FieldTurf' },
  { id: 8, name: 'Levi\'s Stadium', city: 'Santa Clara, CA', country: 'USA', capacity: '68,500', matches: 4, highlight: 'Group Stage', lat: 37.4032, lng: -121.9698, transport: 'VTA light rail to Great America station. 15 min walk from Caltrain', open: '2014', surface: 'Bermuda grass' },
  { id: 9, name: 'Gillette Stadium', city: 'Foxborough, MA', country: 'USA', capacity: '65,878', matches: 4, highlight: 'Group Stage', lat: 42.0909, lng: -71.2643, transport: 'MBTA Commuter Rail Providence/Stoughton Line to Foxboro station on match days only', open: '2002', surface: 'FieldTurf' },
  { id: 10, name: 'Lincoln Financial Field', city: 'Philadelphia, PA', country: 'USA', capacity: '69,596', matches: 4, highlight: 'Group Stage', lat: 39.9008, lng: -75.1675, transport: 'SEPTA Broad Street Line to NRG/AT&T Station. 5 min walk to stadium', open: '2003', surface: 'Natural grass' },
  { id: 11, name: 'BMO Field', city: 'Toronto', country: 'Canada', capacity: '45,000', matches: 4, highlight: 'Group Stage', lat: 43.6332, lng: -79.4189, transport: 'TTC Streetcar 509 Harbourfront from Union Station. 15 min', open: '2007', surface: 'Hybrid grass' },
  { id: 12, name: 'BC Place', city: 'Vancouver', country: 'Canada', capacity: '54,500', matches: 4, highlight: 'Group Stage', lat: 49.2768, lng: -123.1118, transport: 'SkyTrain Expo/Millennium Line to Stadium-Chinatown station. 2 min walk', open: '1983', surface: 'FieldTurf' },
  { id: 13, name: 'Arrowhead Stadium', city: 'Kansas City, MO', country: 'USA', capacity: '76,416', matches: 4, highlight: 'Group Stage', lat: 39.0489, lng: -94.484, transport: 'KCATA game day express bus from downtown Kansas City. 25 min', open: '1972', surface: 'Bermuda grass' },
  { id: 14, name: 'Estadio BBVA', city: 'Monterrey', country: 'Mexico', capacity: '53,500', matches: 4, highlight: 'Group Stage', lat: 25.6697, lng: -100.2436, transport: 'Monterrey Metro Line 1 to Sendero + taxi. 35 min from city center', open: '2015', surface: 'Hybrid grass' },
  { id: 15, name: 'Estadio Akron', city: 'Guadalajara', country: 'Mexico', capacity: '46,232', matches: 3, highlight: 'Group Stage', lat: 20.6837, lng: -103.4671, transport: 'Guadalajara Macrobús from city center. 40 min from Guadalajara downtown', open: '2010', surface: 'Bermuda grass' },
  { id: 16, name: 'Q2 Stadium', city: 'Austin, TX', country: 'USA', capacity: '20,738', matches: 2, highlight: 'Group Stage', lat: 30.3877, lng: -97.7195, transport: 'Capital Metro CapRail to Q2 Stadium station. 20 min from downtown Austin', open: '2021', surface: 'Bermuda grass' },
];

export const COUNTRY_COLORS: Record<string, string> = {
  USA: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
  Mexico: 'text-green-400 bg-green-400/10 border-green-400/20',
  Canada: 'text-red-400 bg-red-400/10 border-red-400/20',
};
