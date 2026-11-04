'use client';

import useLanyard from '@/hooks/useLanyard';

/** Spotify only: VS Code presence can expose private workspace names. */
export default function NowPlaying() {
  const { spotifyPresence: song } = useLanyard();
  if (!song) return null;
  return (
    <p className="now-playing">
      Compiled while listening to <a href={song.trackURL}>{song.song}</a>, {song.artist}
    </p>
  );
}
