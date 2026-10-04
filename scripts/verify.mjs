#!/usr/bin/env node
/**
 * Verificación estática del build (dist/):
 *  - enlaces internos rotos (href, src, action)
 *  - cada página tiene <title>, meta description y un único <h1>
 *  - títulos y descripciones duplicados o fuera de longitud recomendada
 *  - imágenes sin texto alternativo
 *
 * Uso: npm run build && node scripts/verify.mjs
 * Sale con código 1 si encuentra errores (los avisos no bloquean).
 */
import { readdir, readFile, stat } from 'node:fs/promises';
import { join, relative, sep } from 'node:path';

const DIST = new URL('../dist/', import.meta.url).pathname;

async function walk(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(full)));
    else out.push(full);
  }
  return out;
}

async function exists(path) {
  try {
    await stat(path);
    return true;
  } catch {
    return false;
  }
}

/** Convierte una URL interna en el fichero que debería existir en dist/. */
function targetFile(url) {
  const clean = url.split('#')[0].split('?')[0];
  if (clean === '' || clean === '/') return join(DIST, 'index.html');
  if (clean.endsWith('/')) return join(DIST, clean, 'index.html');
  return join(DIST, clean);
}

const files = await walk(DIST);
const pages = files.filter((f) => f.endsWith('.html'));
const errors = [];
const warnings = [];
const titles = new Map();
const descriptions = new Map();

for (const file of pages) {
  const html = await readFile(file, 'utf8');
  const page = '/' + relative(DIST, file).split(sep).join('/').replace(/index\.html$/, '');
  const isUtility = page === '/404.html' || page.startsWith('/gracias');

  const title = html.match(/<title>([^<]*)<\/title>/)?.[1]?.trim();
  const description = html.match(/<meta name="description" content="([^"]*)"/)?.[1]?.trim();
  const h1s = html.match(/<h1[\s>]/g)?.length ?? 0;

  if (!title) errors.push(`${page}: falta <title>`);
  if (!description) errors.push(`${page}: falta meta description`);
  if (h1s !== 1) errors.push(`${page}: tiene ${h1s} <h1> (debe haber exactamente 1)`);

  if (!isUtility) {
    if (title && title.length > 70) warnings.push(`${page}: título largo (${title.length} caracteres): "${title}"`);
    if (description && (description.length < 70 || description.length > 165)) {
      warnings.push(`${page}: description de ${description.length} caracteres (recomendado 70-165)`);
    }
    if (title) titles.set(title, [...(titles.get(title) ?? []), page]);
    if (description) descriptions.set(description, [...(descriptions.get(description) ?? []), page]);
  }

  for (const [, attr, url] of html.matchAll(/\s(href|src|action)="(\/[^"]*)"/g)) {
    if (url.startsWith('//')) continue;
    if (!(await exists(targetFile(url)))) errors.push(`${page}: enlace roto ${attr}="${url}"`);
  }

  for (const [img] of html.matchAll(/<img\b[^>]*>/g)) {
    if (!/\salt="/.test(img)) errors.push(`${page}: imagen sin alt: ${img.slice(0, 80)}`);
  }
}

for (const [t, where] of titles) if (where.length > 1) warnings.push(`Título duplicado "${t}" en ${where.join(', ')}`);
for (const [d, where] of descriptions) if (where.length > 1) warnings.push(`Description duplicada en ${where.join(', ')}`);

console.log(`\nVerificación de ${pages.length} páginas en dist/`);
if (warnings.length) console.log(`\nAvisos (${warnings.length}):\n  - ${warnings.join('\n  - ')}`);
if (errors.length) {
  console.log(`\nErrores (${errors.length}):\n  - ${errors.join('\n  - ')}\n`);
  process.exit(1);
}
console.log('\nSin errores.\n');
