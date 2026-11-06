'use client';

import { useEffect, useState } from 'react';

// What Marcus is listening to right now. Lanyard is instant but only sees Spotify through
// Discord, so it can miss his phone. stats.fm is slower but sees every device, and it is
// the only one that knows a clean preview.

export interface LiveTrack {
  title: string;
  artist: string;
  cover?: string;
  preview?: string | null;
  link?: string | null;
}

export interface Live {
  on: boolean;
  /** The current song, or the last one played while off air. */
  track: LiveTrack | null;
}

interface StatsTrack {
  name: string;
  explicit?: boolean;
  appleMusicPreview?: string | null;
  albums?: { image?: string }[];
  artists: { name: string }[];
  externalIds?: { spotify?: string[]; appleMusic?: string[] };
}

interface Spotify { song: string; artist: string; album_art_url?: string; track_id?: string }

const STATS = 'https://api.stats.fm/api/v1/users/buh/streams';
const SOCKET = 'wss://api.lanyard.rest/socket';
const DISCORD_ID = '294870523438170112';
const POLL_MS = 30000;

const same = (a: string, b: string) => a.localeCompare(b, undefined, { sensitivity: 'base' }) === 0;

function fromStats(t: StatsTrack): LiveTrack {
  const { spotify, appleMusic } = t.externalIds ?? {};
  return {
    title: t.name,
    artist: t.artists.slice(0, 2).map((a) => a.name).join(', '),
    cover: t.albums?.[0]?.image,
    preview: t.explicit ? null : t.appleMusicPreview,
    link: spotify?.[0] ? `https://open.spotify.com/track/${spotify[0]}` : appleMusic?.[0] ? `https://music.apple.com/gb/song/${appleMusic[0]}` : null,
  };
}

function fromSpotify(s: Spotify): LiveTrack {
  return {
    title: s.song,
    artist: s.artist.split(';').slice(0, 2).join(',').trim(),
    cover: s.album_art_url,
    link: s.track_id ? `https://open.spotify.com/track/${s.track_id}` : null,
  };
}

async function fetchJson(url: string) {
  const r = await fetch(url);
  if (!r.ok) return null;
  const text = await r.text(); // stats.fm answers with an empty body when nothing is playing
  return text ? JSON.parse(text) : null;
}

export function useLive(): Live {
  const [spotify, setSpotify] = useState<Spotify | null>(null);
  const [playing, setPlaying] = useState<LiveTrack | null>(null);
  const [last, setLast] = useState<LiveTrack | null>(null);

  useEffect(() => {
    let closed = false;
    let socket: WebSocket;
    let beat: ReturnType<typeof setInterval>;

    const connect = () => {
      socket = new WebSocket(SOCKET);
      socket.onmessage = (e) => {
        const data = JSON.parse(e.data);
        if (data.op === 1) {
          beat = setInterval(() => socket.readyState === WebSocket.OPEN && socket.send(JSON.stringify({ op: 3 })), data.d.heartbeat_interval);
          socket.send(JSON.stringify({ op: 2, d: { subscribe_to_id: DISCORD_ID } }));
        }
        if (data.op === 0 && (data.t === 'INIT_STATE' || data.t === 'PRESENCE_UPDATE')) {
          setSpotify(data.d.listening_to_spotify ? data.d.spotify : null);
        }
      };
      socket.onclose = () => {
        clearInterval(beat);
        if (!closed) setTimeout(connect, 1000);
      };
    };

    connect();
    return () => { closed = true; clearInterval(beat); socket.close(); };
  }, []);

  useEffect(() => {
    const poll = async () => {
      if (document.hidden) return;
      try {
        const current = await fetchJson(`${STATS}/current`);
        setPlaying(current?.item?.isPlaying && current.item.track ? fromStats(current.item.track) : null);
        if (!current?.item?.isPlaying) {
          const recent = await fetchJson(`${STATS}/recent?limit=1`);
          if (recent?.items?.[0]) setLast(fromStats(recent.items[0].track));
        }
      } catch {
        // Lanyard may still have it, and the next poll will try again.
      }
    };
    poll();
    const t = setInterval(poll, POLL_MS);
    document.addEventListener('visibilitychange', poll);
    return () => { clearInterval(t); document.removeEventListener('visibilitychange', poll); };
  }, []);

  // A new song on Lanyard: ask stats.fm early, for its preview.
  const song = spotify?.song;
  useEffect(() => {
    if (!song) return;
    const t = setTimeout(async () => {
      const current = await fetchJson(`${STATS}/current`).catch(() => null);
      if (current?.item?.isPlaying && current.item.track) setPlaying(fromStats(current.item.track));
    }, 4000);
    return () => clearTimeout(t);
  }, [song]);

  if (spotify) {
    const track = fromSpotify(spotify);
    return { on: true, track: playing && same(playing.title, track.title) ? { ...track, ...playing } : track };
  }
  return playing ? { on: true, track: playing } : { on: false, track: last };
}
