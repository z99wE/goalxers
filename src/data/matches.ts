export interface Match {
  home: string;
  away: string;
  date: string;
  venue: string;
  time: string;
  score: string;
  homeFlag: string;
  awayFlag: string;
}

export interface Stat {
  label: string;
  value: string;
}

export const MATCHES: Match[] = [
  { home: 'USA', away: 'Mexico', date: 'Jun 11', venue: 'Estadio Azteca', time: '19:00', score: 'LIVE', homeFlag: '🇺🇸', awayFlag: '🇲🇽' },
  { home: 'Argentina', away: 'Brazil', date: 'Jun 18', venue: 'MetLife Stadium', time: '20:00', score: 'vs', homeFlag: '🇦🇷', awayFlag: '🇧🇷' },
  { home: 'Germany', away: 'France', date: 'Jun 22', venue: 'AT&T Stadium', time: '18:00', score: 'vs', homeFlag: '🇩🇪', awayFlag: '🇫🇷' },
  { home: 'England', away: 'Spain', date: 'Jun 26', venue: 'Rose Bowl', time: '21:00', score: 'vs', homeFlag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', awayFlag: '🇪🇸' },
  { home: 'Portugal', away: 'Uruguay', date: 'Jul 1', venue: 'SoFi Stadium', time: '20:00', score: 'vs', homeFlag: '🇵🇹', awayFlag: '🇺🇾' },
];

export const STATS: Stat[] = [
  { label: 'Host Cities', value: '16' },
  { label: 'Stadiums', value: '11' },
  { label: 'Total Matches', value: '104' },
  { label: 'Participating Teams', value: '48' },
];
