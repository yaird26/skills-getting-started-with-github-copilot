#!/usr/bin/env node
// Render YD Perfums design-system slides from a JSON content file to PNGs.
//
//   NODE_PATH=$(npm root -g) node brand/design/render.js brand/design/samples/content.json brand/design/samples
//
// Content format: see brand/design-system.md ("Content file").
const fs = require("fs");
const path = require("path");
const { chromium } = require("playwright");

const DIR = __dirname;
// Fonts are inlined as data URIs so rendering works offline and without a font CDN.
const FONTS = fs.readFileSync(path.join(DIR, "fonts.css"), "utf8").replace(/url\((fonts\/[^)]+)\)/g, (_, f) =>
  `url(data:font/woff2;base64,${fs.readFileSync(path.join(DIR, f)).toString("base64")})`);
const CSS = FONTS + fs.readFileSync(path.join(DIR, "yd.css"), "utf8");
const LOGO = ["yd-logo.svg", "yd-logo.png"].map((f) => path.join(DIR, "assets", f)).find((f) => fs.existsSync(f));

const ICONS = {
  drop: '<path d="M28 6C28 6 12 25 12 36a16 16 0 0 0 32 0C44 25 28 6 28 6z"/>',
  leaf: '<path d="M10 46C10 22 26 10 48 8c0 24-14 38-38 38z"/><path d="M10 46L34 22"/>',
  clock: '<circle cx="28" cy="28" r="20"/><path d="M28 16v12l8 6"/>',
  flame: '<path d="M28 6c4 10 14 14 14 28a14 14 0 0 1-28 0c0-8 6-12 6-20 4 4 6 8 8 12 2-8 0-14 0-20z"/>',
};

const esc = (s = "") => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]);
const isHebrew = (s = "") => /[֐-׿]/.test(s);
const dirAttr = (s) => (isHebrew(s) ? ' dir="rtl"' : "");
const titleClass = (s) => (isHebrew(s) ? "title" : "title latin");
const lines = (s) => esc(s).replace(/\n/g, "<br>");

function watermark(show) {
  if (show === false) return "";
  if (LOGO) {
    const mime = LOGO.endsWith(".svg") ? "image/svg+xml" : "image/png";
    return `<img class="watermark" src="data:${mime};base64,${fs.readFileSync(LOGO).toString("base64")}">`;
  }
  return '<div class="watermark">YD</div>';
}

function footer(brand) {
  return `<div class="footer"><div class="mark">YD</div><div class="word">${esc(brand.wordmark)}</div></div>`;
}

const templates = {
  highlight: (s, brand) => `
    <div class="canvas highlight">
      <div class="ring"></div>${watermark(s.watermark)}
      <div class="stack">
        <div class="eyebrow">${esc(brand.wordmark)}</div>
        <div class="${titleClass(s.title)}"${dirAttr(s.title)}>${lines(s.title)}</div>
        <div class="subtitle"${dirAttr(s.subtitle)}>${esc(s.subtitle)}</div>
        <div class="rule"></div>
        <div class="sig">YD</div>
      </div>
    </div>`,

  cover: (s, brand) => `
    <div class="canvas post cover">
      <div class="frame"></div>${watermark(s.watermark)}
      <div class="eyebrow"${dirAttr(s.category)}>${esc(s.category)}</div>
      <div class="${titleClass(s.title)}"${dirAttr(s.title)}>${lines(s.title)}</div>
      <div class="rule"></div>
      ${s.subtitle ? `<div class="subtitle"${dirAttr(s.subtitle)}>${esc(s.subtitle)}</div>` : ""}
      ${footer(brand)}
    </div>`,

  slide: (s, brand) => `
    <div class="canvas post slide">
      <div class="frame"></div>${watermark(s.watermark)}
      <div class="eyebrow"${dirAttr(s.category)}>${esc(s.category)}</div>
      <div class="${titleClass(s.title)}"${dirAttr(s.title)}>${lines(s.title)}</div>
      ${s.latin ? `<div class="latin-sub">${esc(s.latin)}</div>` : ""}
      <div class="rule"></div>
      <div class="body"${dirAttr(s.title)}>
        ${s.icon && ICONS[s.icon] ? `<svg class="icon" viewBox="0 0 56 56">${ICONS[s.icon]}</svg>` : ""}
        ${(s.paragraphs || []).map((p) => `<p>${lines(p)}</p>`).join("")}
        ${s.emphasis ? `<p class="emphasis">${lines(s.emphasis)}</p>` : ""}
      </div>
      ${s.counter ? `<div class="counter">${esc(s.counter)}</div>` : ""}
      ${footer(brand)}
    </div>`,
};

const SIZES = { highlight: [1080, 1920], cover: [1080, 1350], slide: [1080, 1350] };

async function main() {
  const [input, outDir = path.dirname(input || ".")] = process.argv.slice(2);
  if (!input) throw new Error("usage: render.js <content.json> [outDir]");
  const content = JSON.parse(fs.readFileSync(input, "utf8"));
  const brand = { wordmark: "YD PERFUMES", ...content.brand };
  fs.mkdirSync(outDir, { recursive: true });

  const browser = await chromium.launch();
  for (const s of content.slides) {
    const tpl = templates[s.type];
    if (!tpl) throw new Error(`unknown slide type "${s.type}" (${s.file})`);
    const [width, height] = SIZES[s.type];
    const page = await browser.newPage({ viewport: { width, height } });
    await page.setContent(`<!doctype html><html lang="he"><head><meta charset="utf-8"><style>${CSS}</style></head><body>${tpl(s, brand)}</body></html>`);
    await page.evaluate(() => document.fonts.ready);
    const file = path.join(outDir, `${s.file}.png`);
    await page.screenshot({ path: file });
    await page.close();
    console.log("rendered", file);
  }
  await browser.close();
}

main().catch((e) => { console.error(e); process.exit(1); });
