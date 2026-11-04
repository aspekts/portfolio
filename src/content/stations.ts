import music from './music.generated.json';

export interface Station {
  id: string;
  freq: number;
  ps: string; // RDS station name: eight characters, as on a real radio
  name: string;
  format: string;
  rt: string[]; // RDS text
  body: string;
  link?: { label: string; href: string };
}

const { plays, hours, artists } = music.stats;

export const listening = { plays: plays.toLocaleString('en-GB'), hours: hours.toLocaleString('en-GB'), artists: artists.toLocaleString('en-GB') };

export const stations: Station[] = [
  {
    id: 'marcus', freq: 87.9, ps: 'ASPEKTS', name: 'Aspekts', format: 'Station ident',
    rt: ['MARCUS KAMUNTU', 'ENGINEER AND FOUNDER', 'SWIPE OR DRAG TO TUNE'],
    body: 'This is me. Everything on this dial is a picture sent as a signal, and your browser is decoding it right now.',
  },
  {
    id: 'sendix', freq: 89.3, ps: 'SENDIX', name: 'Sendix', format: 'The Morning Bulletin',
    rt: ['WHAT THE PLAN PROMISES', 'DELIVERED', 'SENDIX SUGGESTS YOU DECIDE'],
    body: "My company. What the plan promises, delivered. Sendix checks SEND and ASN support plans in England and Scotland for vague wording, suggests specific replacements for EHCPs and IEPs from evidence already in the file, and tracks whether the provision actually gets delivered. Sendix suggests, you decide: nothing goes into a plan until a person has signed it off. Backed by £22.5k in non-dilutive funding, including Scottish EDGE's Young EDGE award and three awards at Dundee's Venture 2026.",
    link: { label: 'sendix.ai', href: 'https://sendix.ai' },
  },
  {
    id: 'ncr', freq: 91.4, ps: 'INCIDENT', name: 'NCR Atleos diagnostics', format: 'Traffic and Travel',
    rt: ['7 ATM LOG SOURCES', 'ONE LIKELY CAUSE', 'TECHNICAL LEAD'],
    body: 'Technical lead on a university industry project: an ATM diagnostics prototype that cleans logs from seven sources, scores anomalies with Isolation Forest and correlates them into incidents, built on synthetic data.',
    link: { label: 'Source', href: 'https://github.com/aspekts/industrial-team-project' },
  },
  {
    id: 'yarn', freq: 93.7, ps: 'YARN DEV', name: 'Yarn Development', format: 'Local Radio',
    rt: ['MY AGENCY SINCE I WAS 15', 'REAL CLIENTS', 'STILL ON AIR'],
    body: 'I started freelancing at fifteen. Production systems for paying clients in education, hospitality and professional services, from requirements through to post-launch support.',
  },
  {
    id: 'pollo', freq: 95.2, ps: 'POLLO', name: 'Pollo Game Boat', format: 'The Phone-In',
    rt: ['250,000+ USERS', 'A DISCORD ECONOMY GAME', 'CO-FOUNDED AT 15'],
    body: 'A Discord economy game I co-founded and led as a teenager. It reached 250,000+ users, and I migrated it from MySQL to MongoDB under load.',
  },
  {
    id: 'poeapi', freq: 97.0, ps: 'POE API', name: 'PoeAPI', format: 'The Open Line',
    rt: ['NO PUBLIC API', 'SO I BUILT ONE', '70 GITHUB STARS'],
    body: "A reverse engineering of Quora's private Poe API. Every public commit landed on one day, and it is still my most-starred repo.",
    link: { label: 'Source', href: 'https://github.com/aspekts/PoeAPI' },
  },
  {
    id: 'goodcode', freq: 98.1, ps: 'GOOD', name: 'Code for Good', format: 'Community Radio',
    rt: ['JPMORGANCHASE CODE FOR GOOD', 'GLASGOW CHILDRENS HOSPITAL', 'VOLUNTEER DRIVERS'],
    body: "Built at JPMorganChase's Code for Good for Glasgow Children's Hospital Charity, replacing spreadsheet coordination of the volunteer drivers who get families to and from the hospital. I led the backend.",
  },
  {
    id: 'unclaimed', freq: 99.1, ps: 'UNCLAIM', name: 'Unclaimed', format: 'The Money Programme',
    rt: ['WON THE BLACKROCK TRACK', 'WHICH THREE SHOULD I CLAIM', 'EVERY COMBINATION COMPARED'],
    body: "Winner of the BlackRock track at GUTS 2026. It compares every combination of support a Glasgow household could claim, then shows the best three, the order to do them in, and why the others were left out. I built the calculation layer.",
    link: { label: 'Try the demo', href: 'https://web-production-82b74.up.railway.app' },
  },
  {
    id: 'jotter', freq: 100.1, ps: 'JOTTER', name: 'Jotter', format: 'Study Hour',
    rt: ['START SMALLER', 'ONE TWO-MINUTE MOVE', 'RUNS ON GEMMA 4'],
    body: 'A National 5 Maths study coach, built at the Build with Gemma hackathon in Aberdeen. It works out what is stopping you, gives you one move that takes under two minutes, and marks photos of handwritten work.',
    link: { label: 'Source', href: 'https://github.com/aspekts/study-companion' },
  },
  {
    id: 'fluxfile', freq: 101.1, ps: 'FLUXFILE', name: 'FluxFile', format: 'Requests',
    rt: ['ANY FILE IN ANY FILE OUT', 'WORKERS AND BACKPRESSURE', 'ZERO KNOWLEDGE STORAGE'],
    body: 'Distributed file conversion. A containerised worker pool behind BullMQ with backpressure, live progress over WebSockets, and AES-256 zero-knowledge storage.',
    link: { label: 'Source', href: 'https://github.com/aspekts/FluxFile' },
  },
  {
    id: 'trackside', freq: 102.6, ps: 'TRACK', name: 'Trackside', format: 'Live from the Circuit',
    rt: ['GO-KARTING', 'NOT A METAPHOR', 'I JUST LIKE IT'],
    body: 'Go-karting. It has nothing to do with software, which is the point.',
  },
  {
    id: 'recordbox', freq: 104.3, ps: 'SHELF', name: 'The Shelf', format: 'Record Box',
    rt: ['11 CDS ON THE SHELF', `${listening.plays} PLAYS`, `${listening.artists} ARTISTS`],
    body: `Eleven CDs I actually own, and ${listening.plays} plays across ${listening.artists} artists.`,
    link: { label: 'See the shelf', href: '#shelf' },
  },
  {
    id: 'workshop', freq: 107.4, ps: 'AFTERHRS', name: 'After Hours', format: 'Late Night',
    rt: ['I MAKE THINGS', 'YES THAT IS A DINOSAUR', 'ONE UNFINISHED LANGUAGE'],
    body: 'I self-host what I build on my own homelab, and I am still not finished with YarnLang, my own programming language.',
  },
];

export const BAND = { low: 87.5, high: 108 };
