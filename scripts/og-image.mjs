#!/usr/bin/env node
/**
 * Genera public/og-default.png (1200 × 630), la imagen que se ve al compartir
 * la web en WhatsApp, LinkedIn o redes. Toma la marca y el precio de los datos.
 *
 * Uso: node scripts/og-image.mjs
 */
import { readFile } from 'node:fs/promises';
import { chromium } from 'playwright';

const root = new URL('..', import.meta.url).pathname;
const site = await readFile(`${root}src/config/site.ts`, 'utf8');
const pricing = await readFile(`${root}src/data/pricing.ts`, 'utf8');
const brand = site.match(/name: '([^']+)'/)?.[1] ?? 'AR Fiscal';
const tagline = site.match(/tagline: '([^']+)'/)?.[1] ?? '';
const minPrice = Math.min(...[...pricing.matchAll(/monthly: ([\d.]+)/g)].map((m) => Number(m[1])));
const price = minPrice.toLocaleString('es-ES', { minimumFractionDigits: 2 });

const fontCss = async (pkg, weight) => {
  const css = await readFile(`${root}node_modules/@fontsource/${pkg}/latin-${weight}.css`, 'utf8');
  const file = css.match(/url\(\.\/files\/([^)]+\.woff2)\)/)[1];
  const data = (await readFile(`${root}node_modules/@fontsource/${pkg}/files/${file}`)).toString('base64');
  return css.replace(/src:[^;]+;/, `src: url(data:font/woff2;base64,${data}) format('woff2');`);
};
const fonts = (
  await Promise.all([fontCss('cormorant-garamond', 600), fontCss('cormorant-garamond', 700), fontCss('source-sans-3', 600)])
).join('\n');

const html = `<!doctype html><html><head><meta charset="utf-8"><style>${fonts}
  body{margin:0;width:1200px;height:630px;font-family:'Source Sans 3',system-ui,sans-serif;background:#0e1a2e;color:#fbf8f2;display:flex}
  .frame{position:absolute;inset:22px;border:1px solid rgba(205,176,122,.55)}
  .frame:after{content:'';position:absolute;inset:6px;border:1px solid rgba(205,176,122,.25)}
  .wrap{position:relative;padding:76px 92px;display:flex;flex-direction:column;justify-content:space-between;width:100%}
  .brand{display:flex;align-items:center;gap:22px}
  .name{font-family:'Cormorant Garamond',serif;font-size:46px;font-weight:700;line-height:1}
  .name span{font-weight:600;opacity:.92}
  .sub{font-size:15px;letter-spacing:.3em;text-transform:uppercase;color:#cdb07a;margin-top:6px;font-weight:600}
  h1{font-family:'Cormorant Garamond',serif;font-weight:600;font-size:66px;line-height:1.08;margin:0;max-width:980px;text-wrap:balance}
  .rule{width:90px;height:1px;background:#cdb07a;margin:0 0 26px}
  .foot{display:flex;gap:34px;font-size:24px;font-weight:600;color:#d9dfe9;letter-spacing:.04em}
  .foot b{color:#cdb07a;font-weight:600}
</style></head><body><div class="frame"></div><div class="wrap">
  <div class="brand"><svg width="84" height="84" viewBox="0 0 40 40"><rect width="40" height="40" rx="3" fill="#1e3354"/>
    <rect x="3" y="3" width="34" height="34" rx="1.5" fill="none" stroke="#cdb07a" stroke-width="0.8"/>
    <text x="20" y="26.6" text-anchor="middle" fill="#cdb07a" font-family="Cormorant Garamond" font-weight="700" font-size="19">AR</text></svg>
    <div><div class="name">${brand.replace(/^(\S+)\s(.*)$/, '$1 <span>$2</span>')}</div><div class="sub">Asesoría fiscal · Ávila Rivero</div></div></div>
  <div><div class="rule"></div><h1>${tagline}. IVA, retenciones e IRPF de autónomos y pymes.</h1></div>
  <div class="foot"><span><b>Desde ${price} €</b>/mes + IVA</span><span>Sin permanencia</span><span>100 % online</span></div>
</div></body></html>`;

const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
await page.setContent(html);
await page.evaluate(() => document.fonts.ready);
await page.screenshot({ path: `${root}public/og-default.png` });
await browser.close();
console.log('Imagen para redes generada en public/og-default.png');
