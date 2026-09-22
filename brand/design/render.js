#!/usr/bin/env node
// Render YD Perfums editorial layouts to PNGs.
//
//   NODE_PATH=$(npm root -g) node brand/design/render.js <layout.html> [outDir] [--sheet]
//
// Every <section class="canvas" data-name="..."> in the HTML file becomes <outDir>/<data-name>.png,
// sized by the element itself (.p45 = 1080x1350 post, .p916 = 1080x1920 reel/story).
// Fonts (fonts.css, inlined as data URIs so no CDN is needed) and base.css are injected automatically.
// --sheet also writes <outDir>/<file>-sheet.png: every frame side by side, for quick review.
// See brand/design-system.md.
const fs = require("fs");
const path = require("path");
const { chromium } = require("playwright");

const DIR = __dirname;
const FONTS = fs.readFileSync(path.join(DIR, "fonts.css"), "utf8").replace(/url\((fonts\/[^)]+)\)/g, (_, f) =>
  `url(data:font/woff2;base64,${fs.readFileSync(path.join(DIR, f)).toString("base64")})`);
const BASE = FONTS + fs.readFileSync(path.join(DIR, "base.css"), "utf8");

async function main() {
  const args = process.argv.slice(2);
  const sheet = args.includes("--sheet");
  const [input, outDir = path.dirname(input || ".")] = args.filter((a) => a !== "--sheet");
  if (!input || !input.endsWith(".html")) throw new Error("usage: render.js <layout.html> [outDir] [--sheet]");
  fs.mkdirSync(outDir, { recursive: true });

  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
  await page.setContent(fs.readFileSync(input, "utf8").replace("</head>", `<style>${BASE}</style></head>`));
  await page.evaluate(() => document.fonts.ready);

  const shots = [];
  for (const el of await page.$$("section.canvas[data-name]")) {
    const file = path.join(outDir, `${await el.getAttribute("data-name")}.png`);
    await el.screenshot({ path: file });
    shots.push(file);
    console.log("rendered", file);
  }

  if (sheet && shots.length) {
    const imgs = shots.map((f) => `<img src="data:image/png;base64,${fs.readFileSync(f).toString("base64")}">`).join("");
    const sp = await browser.newPage({ viewport: { width: 400, height: 400 } });
    await sp.setContent(`<body style="margin:0;background:#d9d2c7"><div id="s" style="display:inline-flex;gap:40px;padding:40px;align-items:flex-start">${imgs}</div>
      <style>img{height:1350px;width:auto;box-shadow:0 10px 40px rgba(0,0,0,.18)}</style></body>`);
    const file = path.join(outDir, `${path.basename(input, ".html")}-sheet.png`);
    await (await sp.$("#s")).screenshot({ path: file });
    console.log("sheet", file);
  }
  await browser.close();
}

main().catch((e) => { console.error(e); process.exit(1); });
