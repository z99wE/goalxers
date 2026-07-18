export interface TicketCategory {
  id: string;
  label: string;
  description: string;
  price: string;
  badge: string;
  available: boolean;
}

export interface FeaturedMatch {
  match: string;
  teams: string;
  date: string;
  venue: string;
  price: string;
  country: string;
}

export const TICKET_CATEGORIES: TicketCategory[] = [
  {
    id: 'cat1',
    label: 'Category 1',
    description: 'Prime center-pitch view — lower tier, central sections',
    price: '$750–$1,450',
    badge: 'Best View',
    available: true,
  },
  {
    id: 'cat2',
    label: 'Category 2',
    description: 'Side stands, upper tier — excellent value sightlines',
    price: '$400–$750',
    badge: 'Popular',
    available: true,
  },
  {
    id: 'cat3',
    label: 'Category 3',
    description: 'Behind-goal stands — full atmosphere, budget-friendly',
    price: '$150–$350',
    badge: 'Value',
    available: true,
  },
  {
    id: 'vip',
    label: 'VIP Hospitality',
    description: 'Executive suites, gourmet dining, pitch-view lounge, dedicated concierge',
    price: '$2,500–$6,500',
    badge: 'Premium',
    available: true,
  },
  {
    id: 'family',
    label: 'Family Zone',
    description: 'Sheltered family sections with dedicated facilities and kids programming',
    price: '$200–$500',
    badge: 'Family',
    available: true,
  },
];

export const FEATURED_MATCHES: FeaturedMatch[] = [
  { match: 'Opening Match', teams: 'Mexico vs TBD', date: 'Jun 11, 2026', venue: 'Estadio Azteca', price: '$480', country: '🇲🇽' },
  { match: 'Group Stage — USA Home', teams: 'USA vs TBD', date: 'Jun 12, 2026', venue: 'MetLife Stadium', price: '$520', country: '🇺🇸' },
  { match: 'Group Stage', teams: 'Argentina vs TBD', date: 'Jun 18, 2026', venue: 'AT&T Stadium', price: '$650', country: '🇦🇷' },
  { match: 'Round of 32', teams: 'TBD vs TBD', date: 'Jun 29, 2026', venue: 'SoFi Stadium', price: '$380', country: '⚽' },
  { match: 'Quarterfinal', teams: 'TBD vs TBD', date: 'Jul 4, 2026', venue: 'NRG Stadium', price: '$620', country: '⚽' },
  { match: 'Semifinal', teams: 'TBD vs TBD', date: 'Jul 14, 2026', venue: 'AT&T Stadium', price: '$940', country: '⚽' },
  { match: 'Third Place', teams: 'TBD vs TBD', date: 'Jul 18, 2026', venue: 'Rose Bowl', price: '$720', country: '⚽' },
  { match: 'World Cup Final', teams: 'TBD vs TBD', date: 'Jul 19, 2026', venue: 'MetLife Stadium', price: '$1,400', country: '🏆' },
];
