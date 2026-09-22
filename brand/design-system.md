# YD Perfums — Editorial Design System (v2)

YD Perfums education should feel like a **premium perfume education brand**,
something between a luxury magazine and a perfumer's archive. It should
never look like a Canva template. v2 replaces the v1 "centered text on beige"
system, which was too plain and generic.

> **Status:** three candidate directions are in
> [`design/directions/`](design/directions/): **A Journal**, **B Archive** and
> **C Maison**. Once one is chosen, it becomes the house style and this doc
> gets its final tokens. Until then, the principles below apply to all three.

## 1. Content strategy: reels-first

- **Reels are the primary format.** Every educational topic starts as a reel,
  with a hook in the first 1–2 seconds.
- **Static carousels support the reel.** They are the saveable, deeper
  version of the same topic, so they must feel serious and structured.
- Every topic ships as a set:
  **reel cover (9:16) + carousel of 5–7 slides (4:5) + optional highlight cover**.
- Reel covers keep all key content inside the central **1080×1440** area,
  because the profile grid crops to 3:4.

## 2. Principles

1. **Hierarchy before decoration.** Every slide has one dominant element (a
   title, a number, a quote or a diagram) and clear steps down from it.
2. **Asymmetric, not centered.** Default to right-aligned Hebrew (RTL) on a
   grid. Centered compositions are reserved for quote or insight moments.
3. **Structure is the luxury.** Use running headers, section labels, page
   numbers, tables, spec cells, framed boxes and hairline dividers. Content
   should look edited, not typed onto a background.
4. **Layered depth.** Use oversized ghost numerals or quote marks, offset
   frames, subtle paper grain and tonal panels. Never flat and empty.
5. **Vary the layout, keep the system.** Consecutive slides must not share the
   same layout (see §5). The colors, type and furniture stay constant.
6. **Restraint.** One accent color (gold), and at most one dark panel per
   slide. Icons are thin-line only and used only when they explain something.

## 3. Type hierarchy (1080px wide canvas)

| Level | Role | Typeface | Size |
|---|---|---|---|
| H0 | Cover title / reel title | Noto Serif Hebrew 600 · Bellefair (Maison) · Frank Ruhl Libre 300 (Archive) | 170–230px |
| H1 | Slide title | Same family as H0 | 70–92px |
| Q | Pull quote / key claim | Serif display 500 (or Bellefair) | 76–92px |
| D | Display numerals, Latin names | **Bodoni Moda** (numerals) · Cormorant Garamond italic (Latin terms) | 40–84px |
| L | Section label, running header | IBM Plex Sans Hebrew 400, gold, +0.1em · Latin in Bodoni or IBM Plex Mono | 19–24px |
| B | Body | IBM Plex Sans Hebrew 300, line height 1.55–1.65 | 25–33px |
| M | Metadata, data values | IBM Plex Mono, +0.12em | 15–19px |

Rules:
- Hebrew never gets wide letter-spacing (at most +0.12em). Wide tracking is
  only for Latin caps.
- Latin terms (Extrait, Top Notes, Oud) are set in Latin serif italic next to
  the Hebrew, never transliterated.
- Numbers, ranges and Latin runs are isolated (`<span class="ltr">` or an
  LTR block) so RTL bidi never flips "15–20%".
- All fonts are bundled in `design/fonts/` (SIL OFL). Nothing loads from a CDN.

## 4. Palette

| Token | Hex | Use |
|---|---|---|
| cream | `#F2EBDF` | Main background |
| paper | `#F6F1E8` | Lighter surface (Archive, cards) |
| cream-deep | `#E8DECE` | Vignette edges |
| ink | `#1B1714` | Titles |
| ink-2 / ink-3 | `#3F372F` / `#7A6E61` | Body / metadata |
| gold | `#A8844C` | Rules, labels, accents |
| champagne | `#D2B47C` | Gold on dark panels |
| espresso | `#1F1A16` | Dark panels and slides (Maison) |
| tonal browns | `#54443A` `#9A8166` `#D9C7AA` | Graded bands and scales only |

## 5. Slide-type library

Every carousel is assembled from these layouts. No two adjacent slides may
use the same one.

| Type | Use for | Key elements |
|---|---|---|
| **Cover** | Slide 1 | Series label + issue number, H0, Latin subtitle, a one-line intro, optional table of contents |
| **Breakdown table** | Comparing 3–5 items | Hairline rows, a Bodoni number column, a proportion bar, Latin name with a Hebrew description |
| **Spec cards** | Profiles of materials or categories | 2×2 framed cards, mono index, big numeral, spec rows, thin-line meters |
| **Depth bands** | Anything graded (concentration, intensity) | Tonal horizontal bands of decreasing width with a description beside each |
| **Pull quote + columns** | The key idea | Ghost quote mark, Q-size claim with a gold emphasis word, 2 columns with a rule between them |
| **Myth vs. reality** | Correcting a misconception | Split box; the myth side is struck through in gold |
| **Framed insight** | Takeaway or pro tip | Double-hairline frame with diamond corners, or a solid ink/espresso box |
| **Diagram** | Structures (pyramid, concentration, accords) | Thin gold line drawing with mono leader labels |
| **Closing / CTA** | Last slide | Summary line, save/follow CTA in Hebrew per `voice-hebrew.md` |

## 6. Brand furniture (every frame)

- **Running header:** `YD PERFUMES` wordmark and the series or issue label.
- **Folio:** page number `03 / 06` (or `REEL`).
- **Footer:** `@yd.perfums` and/or the `YD` monogram.
- **Frame:** a thin gold hairline or crop-mark corners, depending on the
  direction.
- **Watermark:** only where it adds depth (a cover or a quiet slide), never
  behind body text. If `design/assets/yd-logo.svg` or `.png` exists, use it
  instead of the typeset monogram.

## 7. Never

Centered text-only slides · big empty areas with no structure · Canva-style
stock layouts · emoji or cartoon icons · more than one accent color · wide
letter-spacing on Hebrew · clip-art perfume bottles · gradients beyond a
subtle vignette.

## 8. Producing designs

Each post is an HTML layout file. Every
`<section class="canvas p45|p916" data-name="…">` inside it becomes one PNG.

```bash
NODE_PATH=$(npm root -g) node brand/design/render.js <layout.html> <outDir> --sheet
```

`base.css` (tokens, sizes, grain) and the bundled fonts are injected
automatically. `--sheet` also writes a side-by-side contact sheet for review.
Start new posts by copying the chosen direction's file from
`design/directions/`. Copy follows [`voice-hebrew.md`](voice-hebrew.md).
Reference images go in `design/references/`; use them for style only.
