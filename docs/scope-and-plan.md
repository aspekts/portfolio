# Aspekts FM: scope and plan

## Tonight

- [x] Station pictures (`tools/fm/make_pictures.py`)
- [x] Encoder and decoder (`src/fm/dsp.ts`) with round-trip test
- [x] Receiver worker, band waterfall, dial, RDS, sound
- [x] Programme guide, The Shelf, Off air, contact
- [x] Mobile, keyboard, reduced motion
- [x] Production build served locally

## Needs Marcus

- Photos of the actual CDs, if wanted alongside the album covers
- Karting detail: track name, best lap
- Hand-picked song per station, if preferred to the live chart
- Updated CV PDF

## Later

- Sound design on the band
- Open Graph image

## Decisions

| Decision | Choice | Why |
| --- | --- | --- |
| Audio delivery | Generated in the browser from each image | Tiny download, no lossy codec, still a real signal path |
| Frequency range | 3 to 7 kHz | Enough bandwidth for 240 lines in about 12 seconds |
| Real music | Apple previews from stats.fm and Apple's album track lists | Never hosted here; approved by Marcus |
| Prices | Never shown | Discogs values are not the point of a shelf |
