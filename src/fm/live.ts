'use client';

import { useEffect, useRef, useState } from 'react';

// What Marcus is listening to right now. Lanyard is instant but only sees Spotify through
// Discord, so it can miss his phone. stats.fm is slower but sees every device, and it is
// the only one that knows a clean preview.

export interface LiveTrack {
  /** Spotify's IDs for the recording: titles alone can match a different song. */
  ids: string[];
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
const STALE_MS = POLL_MS * 2.5; // after this long without an answer, stop claiming it is live
const RETRY_MS = 1000;

function fromStats(t: StatsTrack): LiveTrack {
  const { spotify, appleMusic } = t.externalIds ?? {};
  return {
    ids: spotify ?? [],
    title: t.name,
    artist: t.artists.slice(0, 2).map((a) => a.name).join(', '),
    cover: t.albums?.[0]?.image,
    preview: t.explicit ? null : t.appleMusicPreview,
    link: spotify?.[0] ? `https://open.spotify.com/track/${spotify[0]}` : appleMusic?.[0] ? `https://music.apple.com/gb/song/${appleMusic[0]}` : null,
  };
}

function fromSpotify(s: Spotify): LiveTrack {
  return {
    ids: s.track_id ? [s.track_id] : [],
    title: s.song,
    artist: s.artist.split(';').slice(0, 2).join(',').trim(),
    cover: s.album_art_url,
    link: s.track_id ? `https://open.spotify.com/track/${s.track_id}` : null,
  };
}

async function fetchJson(url: string) {
  const r = await fetch(url);
  if (!r.ok) throw new Error(String(r.status));
  const text = await r.text(); // stats.fm answers with an empty body when nothing is playing
  return text ? JSON.parse(text) : null;
}

export function useLive(): Live {
  const [spotify, setSpotify] = useState<Spotify | null>(null);
  const [playing, setPlaying] = useState<LiveTrack | null>(null);
  const [last, setLast] = useState<LiveTrack | null>(null);
  const request = useRef(0);
  const answeredAt = useRef(Date.now());
  const seenAt = useRef(0);

  useEffect(() => {
    let closed = false;
    let socket: WebSocket;
    let beat: ReturnType<typeof setInterval>;
    let retry: ReturnType<typeof setTimeout>;

    const connect = () => {
      if (closed) return;
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
        setSpotify(null); // a silent socket proves nothing, so stats.fm takes over
        if (!closed) retry = setTimeout(connect, RETRY_MS);
      };
    };

    connect();
    return () => { closed = true; clearInterval(beat); clearTimeout(retry); socket.close(); };
  }, []);

  // Only the newest request may change anything: a slow answer must not undo a newer one.
  const refresh = useRef(async () => {
    const mine = ++request.current;
    try {
      const current = await fetchJson(`${STATS}/current`);
      if (mine !== request.current) return;
      answeredAt.current = Date.now();
      const on = current?.item?.isPlaying && current.item.track;
      setPlaying(on ? fromStats(current.item.track) : null);
      if (on) return;
      const recent = (await fetchJson(`${STATS}/recent?limit=1`))?.items?.[0];
      // Anything heard live here is newer than history unless history says otherwise.
      if (mine === request.current && recent && Date.parse(recent.endTime) >= seenAt.current) setLast(fromStats(recent.track));
    } catch {
      if (mine === request.current && Date.now() - answeredAt.current > STALE_MS) setPlaying(null);
    }
  });

  useEffect(() => {
    const poll = () => { if (!document.hidden) refresh.current(); };
    poll();
    const t = setInterval(poll, POLL_MS);
    document.addEventListener('visibilitychange', poll);
    return () => { clearInterval(t); document.removeEventListener('visibilitychange', poll); };
  }, []);

  // A new song on Lanyard: ask stats.fm early, for its preview.
  const song = spotify?.track_id ?? spotify?.song;
  useEffect(() => {
    if (!song) return;
    const t = setTimeout(() => refresh.current(), 4000);
    return () => clearTimeout(t);
  }, [song]);

  const heard = spotify ? fromSpotify(spotify) : null;
  const match = heard && playing && heard.ids.some((id) => playing.ids.includes(id)) ? playing : null;
  const track = heard ? { ...heard, preview: match?.preview, ids: heard.ids } : playing;

  // Remember the song while it plays, so going off air can name it.
  const signature = track ? track.ids[0] ?? track.title : '';
  useEffect(() => {
    if (!track) return;
    seenAt.current = Date.now();
    setLast(track);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signature]);

  return track ? { on: true, track } : { on: false, track: last };
}
