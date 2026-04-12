'use client';

import useLanyard from '@/hooks/useLanyard';

interface LanyardStatusProps {
  style?: React.CSSProperties;
  className?: string;
}

/**
 * Live presence widget powered by Lanyard WebSocket.
 * Shows VSCode (coding activity) and/or Spotify (now playing) when active.
 * Renders nothing when neither is present.
 */
export default function LanyardStatus({ style, className = '' }: LanyardStatusProps) {
  const { spotifyPresence, vscodePresence } = useLanyard();

  if (!vscodePresence && !spotifyPresence) return null;

  return (
    <div style={style} className={`flex flex-col gap-[6px] ${className}`}>
      {vscodePresence && (
        <p className="font-mono text-[11px] leading-none flex items-center gap-[7px]">
          {/* VSCode hex — signal/45, one of its intentional subtle uses */}
          <span className="text-signal/45 flex-shrink-0" aria-hidden="true">⬡</span>
          <span className="text-white/22">coding ·</span>
          {vscodePresence.details && (
            <span className="text-white/50">{vscodePresence.details}</span>
          )}
          {vscodePresence.state && (
            <span className="text-white/22">· {vscodePresence.state}</span>
          )}
        </p>
      )}

      {spotifyPresence && (
        <a
          href={spotifyPresence.trackURL}
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-[11px] leading-none flex items-center gap-[7px] group w-fit"
          aria-label={`Now playing: ${spotifyPresence.song} by ${spotifyPresence.artist}`}
        >
          {/* Play triangle — neutral, not branded green */}
          <span className="text-white/30 flex-shrink-0 group-hover:text-white/50 transition-colors duration-150" aria-hidden="true">▶</span>
          <span className="text-white/22">listening ·</span>
          <span className="text-white/50 group-hover:text-white/70 transition-colors duration-150">
            {spotifyPresence.song}
          </span>
          <span className="text-white/22">— {spotifyPresence.artist}</span>
          {/* Elapsed / duration */}
          <span className="text-white/18 group-hover:text-white/30 transition-colors duration-150 tabular-nums">
            {spotifyPresence.elapsed}/{spotifyPresence.duration}
          </span>
        </a>
      )}
    </div>
  );
}
