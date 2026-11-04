'use client';

import { useEffect, useState } from 'react';
import music from '@/content/music.generated.json';

export interface Track {
  title: string;
  artist: string;
  album?: string | null;
  cover: string;
  preview: string;
  link?: string | null;
}

const STATS = 'https://api.stats.fm/api/v1/users/buh/top/tracks?range=weeks&limit=50';

interface ApiItem {
  track: {
    name: string;
    explicit?: boolean;
    appleMusicPreview?: string | null;
    albums?: { name: string; image: string }[];
    artists: { name: string }[];
    externalIds?: { appleMusic?: string[]; spotify?: string[] };
  };
}

function fromApi({ track: t }: ApiItem): Track | null {
  const album = t.albums?.[0];
  if (!t.appleMusicPreview || !album?.image || t.explicit) return null;
  const { appleMusic, spotify } = t.externalIds ?? {};
  return {
    title: t.name,
    artist: t.artists.slice(0, 2).map((a) => a.name).join(', '),
    album: album.name,
    cover: album.image,
    preview: t.appleMusicPreview,
    link: appleMusic?.[0] ? `https://music.apple.com/gb/song/${appleMusic[0]}` : spotify?.[0] ? `https://open.spotify.com/track/${spotify[0]}` : null,
  };
}

/** The snapshot from the last build, replaced by this week's chart if stats.fm answers. */
export function useRotation(): Track[] {
  const [tracks, setTracks] = useState<Track[]>(music.rotation as Track[]);

  useEffect(() => {
    let live = true;
    fetch(STATS)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        const fresh = (data?.items as ApiItem[] | undefined)?.map(fromApi).filter((t): t is Track => !!t);
        if (live && fresh && fresh.length >= 12) setTracks(fresh);
      })
      .catch(() => {});
    return () => { live = false; };
  }, []);

  return tracks;
}
