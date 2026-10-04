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

const html = `<!doctype html><html><head><meta charset="utf-8"><style>
  body{margin:0;width:1200px;height:630px;font-family:system-ui,-apple-system,'Segoe UI',Roboto,Arial,sans-serif;
    background:radial-gradient(900px 500px at 90% -10%,#1d4372 0%,transparent 60%),#0b1f38;color:#fff;display:flex}
  .wrap{padding:72px 80px;display:flex;flex-direction:column;justify-content:space-between;width:100%}
  .brand{display:flex;align-items:center;gap:20px;font-size:40px;font-weight:800;letter-spacing:-.02em}
  .brand span{font-weight:500}
  h1{font-size:58px;line-height:1.1;margin:0;letter-spacing:-.025em;max-width:1000px;text-wrap:balance}
  .foot{display:flex;gap:18px;font-size:28px;font-weight:600;color:#cfe0f4}
  .pill{background:#0c8f6b;color:#fff;border-radius:999px;padding:12px 26px;white-space:nowrap}
  .pill.alt{background:#16365f}
</style></head><body><div class="wrap">
  <div class="brand"><svg width="76" height="76" viewBox="0 0 36 36"><rect width="36" height="36" rx="9" fill="#16365f"/>
    <g fill="none" stroke-linecap="round" stroke-linejoin="round" stroke-width="2.8"><polyline points="6.5 27 12 9.5 17.5 27" stroke="#fff"/>
    <line x1="8.6" y1="20.6" x2="15.4" y2="20.6" stroke="#fff"/><path d="M21 27V9.5h4.6a4.4 4.4 0 0 1 0 8.8H21" stroke="#fff"/>
    <line x1="24.6" y1="18.3" x2="29.5" y2="27" stroke="#2fd3a0"/></g></svg>
    <div>${brand.replace(/^(\S+)\s(.*)$/, '$1 <span>$2</span>')}</div></div>
  <h1>${tagline}. IVA, retenciones e IRPF de autónomos, sin sorpresas.</h1>
  <div class="foot"><span class="pill">Desde ${price} €/mes + IVA</span><span class="pill alt">Sin permanencia</span><span class="pill alt">100 % online</span></div>
</div></body></html>`;

const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
await page.setContent(html);
await page.screenshot({ path: `${root}public/og-default.png` });
await browser.close();
console.log('Imagen para redes generada en public/og-default.png');
