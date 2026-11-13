// Dev-time helper (not part of the app build): renders the ORVANE icons and the 1200x630 social card with Playwright.
// Run from the project root: node scripts/make-brand-assets.mjs   (needs `npx playwright install chromium` once).
// Outputs: src/app/icon.svg (hand-written), src/app/icon.png, src/app/apple-icon.png, src/app/favicon.ico,
//          src/app/opengraph-image.png (also used as twitter:image via src/lib/metadata.ts); the source stays the hero.
import { chromium } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const app = path.join(root, "src/app");
const MARK = (stroke, line) =>
  `<path d="M2 13 C 7 3, 21 3, 26 13" stroke="${stroke}" stroke-width="2" stroke-linecap="square" fill="none"/><path d="M10 15 H18" stroke="${line}" stroke-width="2" stroke-linecap="square"/>`;

const iconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="6" fill="#0b0c0e"/><g transform="translate(2 7.5) scale(1)">${MARK("#f4f1ec", "#d9772b")}</g></svg>`;
fs.writeFileSync(path.join(app, "icon.svg"), iconSvg + "\n");

const browser = await chromium.launch();
async function render(html, w, h, file, opts = {}) {
  const page = await browser.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
  await page.setContent(html, { waitUntil: "load" });
  const buf = await page.screenshot({ type: "png", ...opts });
  await page.close();
  if (file) fs.writeFileSync(file, buf);
  return buf;
}

const iconHtml = (size, pad) =>
  `<body style="margin:0"><svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 32 32"><rect width="32" height="32" rx="${pad}" fill="#0b0c0e"/><g transform="translate(2 7.5)">${MARK("#f4f1ec", "#d9772b")}</g></svg></body>`;
await render(iconHtml(512, 6), 512, 512, path.join(app, "icon.png"), { omitBackground: true });
await render(iconHtml(180, 0), 180, 180, path.join(app, "apple-icon.png"));
const png32 = await render(iconHtml(32, 6), 32, 32, null, { omitBackground: true });
// ICO container with one embedded 32x32 PNG.
const head = Buffer.alloc(22);
head.writeUInt16LE(0, 0); head.writeUInt16LE(1, 2); head.writeUInt16LE(1, 4);
head.writeUInt8(32, 6); head.writeUInt8(32, 7); head.writeUInt8(0, 8); head.writeUInt8(0, 9);
head.writeUInt16LE(1, 10); head.writeUInt16LE(32, 12); head.writeUInt32LE(png32.length, 14); head.writeUInt32LE(22, 18);
fs.writeFileSync(path.join(app, "favicon.ico"), Buffer.concat([head, png32]));

// Social card: hero photo (already in the repo) + gradient + mark and wide wordmark.
const hero = fs.readFileSync(path.join(root, "public/images/brand/hero-home-desktop.webp")).toString("base64");
const fontFile = fs.readdirSync(path.join(root, ".next/static/media")).find((f) => f.endsWith(".woff2") && fs.statSync(path.join(root, ".next/static/media", f)).size > 60000 && fs.statSync(path.join(root, ".next/static/media", f)).size < 120000);
const font = fontFile ? fs.readFileSync(path.join(root, ".next/static/media", fontFile)).toString("base64") : "";
const ogHtml = `<style>
@font-face{font-family:A;src:url(data:font/woff2;base64,${font});font-weight:100 900;font-stretch:62% 125%}
body{margin:0;width:1200px;height:630px;background:#0b0c0e;position:relative;overflow:hidden;font-family:A,Arial,sans-serif;color:#f4f1ec}
img{position:absolute;right:-60px;top:0;height:630px;width:auto;opacity:.95}
.g{position:absolute;inset:0;background:linear-gradient(90deg,#0b0c0e 0%,#0b0c0ecc 38%,#0b0c0e00 75%),linear-gradient(0deg,#0b0c0e 0%,#0b0c0e00 40%)}
.t{position:absolute;left:72px;bottom:84px}
.w{display:flex;align-items:center;gap:20px}
.n{font-size:56px;font-weight:600;letter-spacing:.42em;font-stretch:125%;text-transform:uppercase}
.s{margin-top:22px;font-size:28px;letter-spacing:.02em;opacity:.85;font-family:Arial,sans-serif}
.c{position:absolute;left:72px;top:64px;font-size:16px;letter-spacing:.24em;text-transform:uppercase;color:#d9772b;font-family:Arial,sans-serif;font-weight:600}
</style><body><img src="data:image/webp;base64,${hero}"><div class="g"></div><div class="c">Concept project by VIZAM</div>
<div class="t"><div class="w"><svg width="84" height="48" viewBox="0 0 28 16" fill="none">${MARK("#f4f1ec", "#d9772b")}</svg><span class="n">Orvane</span></div><div class="s">Electric performance. Calm at any speed.</div></div></body>`;
const og = await render(ogHtml, 1200, 630, path.join(app, "opengraph-image.png"));
fs.writeFileSync(path.join(app, "opengraph-image.alt.txt"), "ORVANE: a fictional electric performance car brand, a VIZAM concept project. The Aren sedan on a coastal road at blue hour.\n");
// No separate twitter-image file: src/lib/metadata.ts points twitter:image at the same /opengraph-image.png.
await browser.close();
console.log("done", og.length, "bytes og");
