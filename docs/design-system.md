# Aspekts FM: design system

A radio station that broadcasts pictures. Every station on the dial transmits an
image as sound, and the page decodes it from that signal in the browser, the way
slow-scan television works. Tuning off-frequency really does degrade the picture,
because noise is added to the signal before it is demodulated.

## Rules

1. **The first view stands alone.** Name, face, what he does and how to reach him
   read without touching anything, with sound off.
2. **The signal is real.** Pictures go image, FM audio, noise, demodulator, image.
   Nothing is a CSS filter pretending to be interference.
3. **Sound is music.** Off by default, and always a real song from his listening. No signal tones or static. Off-frequency, music closes down through a low-pass filter.
4. **No voice.** Words reach the visitor as RDS station text and plain page copy.
5. **Bright, not dark.** Radio spectrum displays are usually neon on black. This one
   is ink on saturated paper colour.
6. **No web-portfolio furniture.** No hero stats, pills, card grids, cursor effects
   or code puns.

## Colour

| Token | Hex | Use |
| --- | --- | --- |
| `--paper` | `#FFD400` | Page, signal yellow |
| `--ink` | `#0A23D8` | Text, rules, strong signal |
| `--hot` | `#FF3B1D` | Needle, focus, weak signal |
| `--white` | `#FFFFFF` | Reading areas |

## Type

| Role | Face |
| --- | --- |
| Station identity, names | Dela Gothic One |
| Reading text | Spline Sans |
| RDS display, frequencies | Doto |

## Components

- **Receiver**: picture screen, RDS display, frequency readout.
- **Band**: a live waterfall of 87.5 to 108 MHz, drawn from each station's real
  signal in halftone ink. It is also the dial.
- **On Air**: a live station. Lanyard gives instant updates and stats.fm covers devices Discord cannot see. The album cover goes out through the signal, and the channel is empty static when nothing is playing.
- **Programme guide**: the work, as a listings page. Each entry tunes the receiver.
- **The Shelf**: the CD collection as real covers, with a disc behind the selected one. Tracks come from Apple's list for that exact album.
- **On rotation**: this week's chart from stats.fm.
- **Off air**: the person outside work.

## Signal format

`AFM-320`: 320 by 240 pixels, 10.8 seconds a frame, 64 kHz. It is never played aloud,
so it can sit above the audible band and carry more detail. All stations run on one
clock, so everyone receives the same broadcast at the same moment.
