#!/usr/bin/env node
/**
 * Genera una copia de la web lista para publicarse como vista previa en un
 * entorno sin servidor propio (por ejemplo, un Artifact de claude.ai):
 *  - convierte los enlaces absolutos (/precios/) en relativos (precios/index.html)
 *  - incrusta la hoja de estilos en cada página
 *  - evita que el formulario intente enviarse (muestra la página de gracias)
 *  - la portada se entrega sin <html>/<head>/<body>, porque el visor los añade
 *
 * Uso: npm run build && node scripts/preview-bundle.mjs
 * Resultado: .preview/site/ y .preview/files.json (mapa de ficheros a publicar)
 */
import { cp, mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import { dirname, join, relative, sep } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname;
const DIST = join(ROOT, 'dist');
const OUT = join(ROOT, '.preview', 'site');
const SKIP = [/^sitemap.*\.xml$/, /^robots\.txt$/];

async function walk(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) out.push(...(await walk(full)));
    else out.push(full);
  }
  return out;
}

await rm(OUT, { recursive: true, force: true });
await mkdir(OUT, { recursive: true });

const siteConfig = await readFile(join(ROOT, 'src', 'config', 'site.ts'), 'utf8');
const brand = siteConfig.match(/name: '([^']+)'/)?.[1] ?? 'Vista previa';

const all = await walk(DIST);
const cssCache = new Map();
const files = {};

const toRelative = (url, prefix) => {
  const [pathAndQuery, hash = ''] = url.split('#');
  const [path, query = ''] = pathAndQuery.split('?');
  let target = path.replace(/^\//, '');
  if (target === '' || target.endsWith('/')) target += 'index.html';
  return prefix + target + (query ? `?${query}` : '') + (hash ? `#${hash}` : '');
};

const formShim = (prefix) => `<script>
document.addEventListener('submit', function (e) {
  var form = e.target;
  if (!(form instanceof HTMLFormElement) || form.method.toLowerCase() !== 'post') return;
  e.preventDefault();
  location.href = '${prefix}gracias/index.html';
});
</script>`;

for (const file of all) {
  const rel = relative(DIST, file).split(sep).join('/');
  if (SKIP.some((re) => re.test(rel))) continue;
  const dest = join(OUT, rel);
  await mkdir(dirname(dest), { recursive: true });

  if (!rel.endsWith('.html')) {
    if (!rel.endsWith('.css') && !/\.woff2?$/.test(rel)) {
      await cp(file, dest);
      files[rel] = relative(ROOT, dest);
    }
    continue;
  }

  const depth = rel.split('/').length - 1;
  const prefix = '../'.repeat(depth);
  let html = await readFile(file, 'utf8');

  // Hojas de estilo locales -> <style> incrustado, con las fuentes woff2 como data: URI
  // (el visor no siempre permite cargar fuentes desde ficheros).
  const links = [...html.matchAll(/<link rel="stylesheet" href="(\/[^"]+)">/g)];
  for (const [tag, href] of links) {
    if (!cssCache.has(href)) {
      let css = await readFile(join(DIST, href), 'utf8');
      for (const [match, url] of [...css.matchAll(/url\((\/[^)]+\.woff2)\)/g)]) {
        const data = (await readFile(join(DIST, url))).toString('base64');
        css = css.replace(match, `url(data:font/woff2;base64,${data})`);
      }
      css = css.replace(/,\s*url\(\/[^)]+\.woff\) format\(["']woff["']\)/g, '');
      cssCache.set(href, css);
    }
    html = html.replace(tag, () => `<style>${cssCache.get(href)}</style>`);
  }

  // Quita enlaces que no aplican en la vista previa.
  html = html.replace(/<link rel="(canonical|sitemap)"[^>]*>/g, '');
  html = html.replace(/<link rel="preload"[^>]*as="font"[^>]*>/g, '');

  // Enlaces absolutos internos -> relativos.
  html = html.replace(/(\s(?:href|src|action))="(\/(?!\/)[^"]*)"/g, (_, attr, url) => `${attr}="${toRelative(url, prefix)}"`);

  // Fotos referenciadas desde estilos en línea (style="--photo: url('/img/…')").
  html = html.replace(/url\('\/(?!\/)([^']*)'\)/g, (_, path) => `url('${prefix}${path}')`);

  // Envío del formulario simulado.
  html = html.replace('</body>', `${formShim(prefix)}</body>`);

  if (rel === 'index.html') {
    // El visor envuelve la portada en su propio documento: entregamos solo el contenido.
    const head = html.match(/<head>([\s\S]*)<\/head>/)?.[1] ?? '';
    const body = html.match(/<body[^>]*>([\s\S]*)<\/body>/)?.[1] ?? '';
    const headClean = head
      .replace(/<meta charset="[^"]*">/, '')
      .replace(/<meta name="viewport"[^>]*>/, '')
      .replace(/<title>[^<]*<\/title>/, '');
    html = `<title>${brand}</title>\n${headClean}\n${body}`;
  }

  await writeFile(dest, html);
  files[rel] = relative(ROOT, dest);
}

await writeFile(join(ROOT, '.preview', 'files.json'), JSON.stringify(files, null, 2));
console.log(`Vista previa generada en .preview/site (${Object.keys(files).length} ficheros).`);
