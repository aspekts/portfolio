'use client';

import { useState, useEffect, useRef } from 'react';

interface SpotifyData {
  song: string;
  artist: string;
  album: string;
  track_id: string;
  timestamps: { start: number; end: number };
}

interface Activity {
  type: number;
  application_id: string;
  state?: string;
  details?: string;
  timestamps: { start: number };
}

interface PresenceData {
  listening_to_spotify: boolean;
  spotify?: SpotifyData;
  activities?: Activity[];
}

interface Payload {
  op: number;
  d?: {
    subscribe_to_id?: string;
  };
}

const LANYARD_SOCKET_URL = 'wss://api.lanyard.rest/socket';
const LANYARD_USER_ID = '294870523438170112';

function msToMinutesAndSeconds(ms: number): string {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

function msToHMS(ms: number): string {
  return new Date(ms).toISOString().substring(11, 19);
}

const useLanyard = () => {
  const [presence, setPresence] = useState<PresenceData | null>(null);
  const lanyardHeartbeat = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    let socket: WebSocket;
    
    const connectToLanyard = () => {
      socket = new WebSocket(LANYARD_SOCKET_URL);

      const send = (op: number, d?: Payload['d']) => {
        if (socket.readyState === WebSocket.OPEN) {
          socket.send(JSON.stringify({ op, d }));
        }
      };

      socket.onopen = () => {
        console.log('Connected to Lanyard');
      };

      socket.onmessage = (event) => {
        const data = JSON.parse(event.data);

        if (data.op === 1) {
          lanyardHeartbeat.current = setInterval(() => send(3), data.d.heartbeat_interval);
          send(2, { subscribe_to_id: LANYARD_USER_ID });
        }

        if (data.op === 0 && ['INIT_STATE', 'PRESENCE_UPDATE'].includes(data.t)) {
          setPresence(data.d);
        }
      };

      socket.onclose = () => {
        console.log('Lanyard socket closed, reconnecting...');
        setTimeout(connectToLanyard, 1000);
      };
    };

    connectToLanyard();

    return () => {
      socket?.close();
      if (lanyardHeartbeat.current) {
        clearInterval(lanyardHeartbeat.current);
      }
    };
  }, []);

  const spotifyPresence = presence?.listening_to_spotify
    ? {
        song: presence.spotify?.song,
        artist: presence.spotify?.artist,
        album: presence.spotify?.album,
        trackURL: `https://open.spotify.com/track/${presence.spotify?.track_id}`,
        duration: presence.spotify?.timestamps?.end
          ? msToMinutesAndSeconds(
              presence.spotify.timestamps.end - presence.spotify.timestamps.start
            )
          : 'N/A',
        timestamp: presence.spotify?.timestamps?.start,
        elapsed: msToMinutesAndSeconds(
          Date.now() - (presence.spotify?.timestamps?.start ?? 0)
        ),
      }
    : null;

  const vscodeActivity = presence?.activities?.find(
    (activity) => activity.type === 0 && activity.application_id === '383226320970055681'
  );

  const vscodePresence = vscodeActivity
    ? {
        details: vscodeActivity.details,
        state: vscodeActivity.state,
        activity: vscodeActivity,
        elapsed: msToHMS(Date.now() - (vscodeActivity.timestamps.start ?? 0)),
      }
    : null;

  return { spotifyPresence, vscodePresence };
};

export { msToMinutesAndSeconds, msToHMS };
export default useLanyard;
