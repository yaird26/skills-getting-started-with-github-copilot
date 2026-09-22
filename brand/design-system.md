# YD Perfums — Educational Design System

The default visual language for **all new YD Perfums educational posts,
carousels and highlight covers**. Visual references live in
[`design/references/`](design/references/). Use them for style only and never
copy their text unless asked.

**Feel:** luxury, minimal, elegant, clean. Calm, premium, niche.
**Never:** loud colors, busy layouts, stickers, gradients or neon, stock
"social media" clutter, more than one accent color.

## Tokens

| Token | Value | Use |
|---|---|---|
| Background | `#F3ECE1` with a soft vignette to `#E9DFCF` at the edges | Every format |
| Ink | `#1F1B17` | Titles, emphasized sentence |
| Ink soft | `#4D453D` | Body, secondary lines |
| Gold | `#AB8A55` | Frame, rules, subtitles, monogram, slide counter |
| Frame | Double 1px gold hairline, inset 44px (inner line 8px further in), about 50% opacity | Posts and slides |
| Watermark | Centered "YD" monogram or logo, gold at about 6–7% opacity | When it doesn't compete with the text |

## Typography

| Role | Font | Style |
|---|---|---|
| Headline (Hebrew) | **Frank Ruhl Libre** 400 | Refined serif, large, centered |
| Headline (Latin) / monogram | **Cormorant Garamond** 400 (italic for Latin subtitles) | |
| Secondary lines | **Assistant** 200–300 | Thin and widely spaced: Latin +0.3–0.5em, Hebrew +0.1em (Hebrew doesn't take wide tracking well) |
| Body | Assistant 300, 34px on 1080 | Short, clean paragraphs, line height 1.65 |
| Emphasis | Frank Ruhl Libre 500, 38px | One bold sentence at most per slide |

Fonts are bundled in `design/fonts/` (SIL Open Font License), so nothing loads
from a CDN.

## Layout principles

- Centered and symmetrical. Everything is aligned on the vertical axis.
- Lots of negative space: at least 130px side margins on posts, and body
  text no wider than about 780px.
- One small gold rule with a diamond ornament separates the title from the
  body.
- Icons only when they add meaning: one thin gold line icon, 56px
  (`drop`, `leaf`, `clock`, `flame`).
- Copy follows [`voice-hebrew.md`](voice-hebrew.md): Hebrew by default, with
  English only for the brand, product names, Latin material names and
  selected labels.

## Formats

### 1. Highlight cover — 1080×1920 (story)
Everything sits inside the central circle that Instagram crops to, marked by
a thin double gold ring.
- **Top:** `YD PERFUMES` (thin, spaced)
- **Center:** category title (serif): חומרי גלם / אקורדים / פירמידת הריח
- **Subtitle:** `Learning Series` or a Hebrew series name
- **Bottom:** rule and `YD` signature

### 2. Carousel cover — 1080×1350 (4:5)
- Small category line, e.g. סדרת לימוד
- Large serif title, which may wrap to 2 lines
- Gold rule, then a one-line subtitle in gold
- Brand footer: `YD` monogram above `YD PERFUMES`

### 3. Inner carousel slide — 1080×1350
- Small category line at the top (the series name)
- Main title, optionally with a Latin subtitle in gold italic (e.g. *Top Notes*)
- Gold rule
- 1–2 short paragraphs, then an optional bold sentence
- Brand footer, plus a slide counter such as `02 / 04` at the bottom corner

### 4. Single educational post — 1080×1350
The same as the inner slide, without the counter.

## Producing designs

Write the content as JSON and render it to PNG:

```bash
NODE_PATH=$(npm root -g) node brand/design/render.js <content.json> <outDir>
```

### Content file

```json
{
  "brand": { "wordmark": "YD PERFUMES" },
  "slides": [
    { "type": "highlight", "file": "hl-raw", "title": "חומרי גלם", "subtitle": "Learning Series" },
    { "type": "cover", "file": "c-01", "category": "סדרת לימוד", "title": "פירמידת\nהריח", "subtitle": "איך בושם מתפתח על העור" },
    { "type": "slide", "file": "c-02", "counter": "02 / 04", "category": "פירמידת הריח",
      "title": "תווי ראש", "latin": "Top Notes", "icon": "drop",
      "paragraphs": ["…", "…"], "emphasis": "…" }
  ]
}
```

Optional on any slide: `"watermark": false` hides the background monogram.
If `design/assets/yd-logo.svg` or `yd-logo.png` exists, it replaces the typeset
"YD" watermark.

A full worked example is in [`design/samples/`](design/samples/): 3 highlight
covers, a 4-slide carousel and a single post.
