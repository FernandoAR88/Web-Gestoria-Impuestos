#!/usr/bin/env node
/**
 * Sirve la web compilada (dist/) en local, la recorre con un navegador real
 * y guarda capturas de escritorio y móvil de las páginas clave. Además detecta:
 *  - errores de JavaScript en consola
 *  - desbordamiento horizontal (scroll lateral en móvil)
 *  - respuestas HTTP con error
 *
 * Uso: npm run build && node scripts/screenshots.mjs [--out .preview/screenshots] [--pages /,/precios/]
 * En un equipo nuevo instala antes el navegador: npx playwright install chromium
 */
import { createServer } from 'node:http';
import { mkdir, readFile, stat, writeFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';
import { chromium } from 'playwright';

const args = process.argv.slice(2);
const arg = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? args[i + 1] : fallback;
};

const OUT = arg('out', '.preview/screenshots');
const PORT = Number(arg('port', 4329));
const BASE = `http://localhost:${PORT}`;
const PAGES = arg(
  'pages',
  '/,/precios/,/servicios/,/servicios/iva/,/como-funciona/,/calendario-fiscal/,/guias/modelo-303/,/quienes-somos/,/contacto/',
).split(',');
const VIEWPORTS = [
  { name: 'escritorio', width: 1440, height: 900 },
  { name: 'movil', width: 390, height: 844 },
];

const slug = (path) => (path === '/' ? 'inicio' : path.replace(/^\/|\/$/g, '').replace(/\//g, '_'));

const DIST = new URL('../dist/', import.meta.url).pathname;
const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.xml': 'application/xml',
  '.txt': 'text/plain',
};

/** Servidor estático mínimo sobre dist/ (directorios -> index.html, 404 -> 404.html). */
const server = createServer(async (req, res) => {
  const path = normalize(decodeURIComponent(new URL(req.url, BASE).pathname)).replace(/^(\.\.[/\\])+/, '');
  let file = join(DIST, path);
  try {
    if ((await stat(file)).isDirectory()) file = join(file, 'index.html');
    res.writeHead(200, { 'Content-Type': TYPES[extname(file)] ?? 'application/octet-stream' });
    res.end(await readFile(file));
  } catch {
    res.writeHead(404, { 'Content-Type': TYPES['.html'] });
    res.end(await readFile(join(DIST, '404.html')).catch(() => 'No encontrado'));
  }
});
await new Promise((resolve) => server.listen(PORT, resolve));
const report = [];

try {
  await mkdir(OUT, { recursive: true });
  const browser = await chromium.launch(
    process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {},
  );

  for (const vp of VIEWPORTS) {
    const context = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, locale: 'es-ES' });
    for (const path of PAGES) {
      const page = await context.newPage();
      const problems = [];
      page.on('pageerror', (err) => problems.push(`Error JS: ${err.message}`));
      page.on('console', (msg) => msg.type() === 'error' && problems.push(`Consola: ${msg.text()}`));
      const res = await page.goto(BASE + path, { waitUntil: 'networkidle' });
      if (!res || res.status() >= 400) problems.push(`HTTP ${res?.status()}`);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      if (overflow > 1) problems.push(`Desborda ${overflow}px en horizontal`);
      const file = `${OUT}/${slug(path)}-${vp.name}.png`;
      await page.screenshot({ path: file, fullPage: true });
      report.push({ page: path, viewport: vp.name, file, problems });
      await page.close();
    }
    await context.close();
  }
  await browser.close();
} finally {
  server.close();
}

const failing = report.filter((r) => r.problems.length);
const lines = [
  `# Informe de ejecución`,
  ``,
  `Fecha: ${new Date().toLocaleString('es-ES')}`,
  `Páginas revisadas: ${PAGES.length} × ${VIEWPORTS.length} tamaños de pantalla`,
  ``,
  failing.length ? `## Problemas (${failing.length})` : `## Sin problemas detectados`,
  ...failing.map((r) => `- ${r.page} (${r.viewport}): ${r.problems.join('; ')}`),
  ``,
  `## Capturas`,
  ...report.map((r) => `- ${r.page} (${r.viewport}): ${r.file}`),
  ``,
];
await writeFile(`${OUT}/INFORME.md`, lines.join('\n'));
console.log(lines.join('\n'));
process.exit(failing.length ? 1 : 0);
