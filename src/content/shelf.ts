import music from './music.generated.json';

export interface Disc {
  id: string;
  title: string;
  artist: string;
  note: string;
  cover?: string;
  sticker?: string;
  link?: string;
  track?: { title: string; preview: string };
}

type Found = { title: string | null; preview: string | null; albumUrl: string };

const from = (id: string) => {
  const cd = (music.cds as Record<string, Found>)[id];
  return {
    cover: `/fm/covers/${id}.jpg`,
    link: cd?.albumUrl,
    track: cd?.title && cd.preview ? { title: cd.title, preview: cd.preview } : undefined,
  };
};

// Newest on the shelf first. Tracks come from Apple's list for that exact album.
export const discs: Disc[] = [
  { id: 'sankofa', title: 'sankofa', artist: 'redveil', note: 'Signed tour exclusive, from my most-played artist.', sticker: 'Signed', ...from('sankofa') },
  { id: 'melt', title: 'Melt My Eyez See Your Future', artist: 'Denzel Curry', note: '2022, European CD.', ...from('melt') },
  { id: 'hoes', title: 'Scaring The Hoes', artist: 'JPEGMAFIA x Danny Brown', note: '2023, limited edition, cover 2.', ...from('hoes') },
  { id: 'wgo', title: "What's Going On", artist: 'Marvin Gaye', note: 'Remastered Motown reissue.', ...from('wgo') },
  { id: 'spergy', title: 'Son Of Spergy', artist: 'Daniel Caesar', note: '2025.', ...from('spergy') },
  { id: 'nine', title: '9', artist: 'Damien Rice', note: '2006, six-panel digisleeve.', ...from('nine') },
  { id: 'demon', title: 'Demon Days', artist: 'Gorillaz', note: '2005, US CD.', ...from('demon') },
  { id: 'ftbyh', title: 'Friends That Break Your Heart', artist: 'James Blake', note: '2021, digipack.', ...from('ftbyh') },
  { id: 'bewitched', title: 'Bewitched: The Goddess Edition', artist: 'Laufey', note: '2024 reissue.', ...from('bewitched') },
  { id: 'poster', title: 'Posterboy', artist: 'Charlie Bennett', note: 'EP.', ...from('poster'), link: 'https://open.spotify.com/artist/0tvXkCpAjbDBWXXnYBE9wG' },
  { id: 'personal', title: 'For me', artist: 'One of one', note: 'Personal. Not on Discogs, not on streaming, not for you. Sorry.', sticker: '1/1' },
];
