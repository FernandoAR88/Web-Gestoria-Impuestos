#!/usr/bin/env node
/**
 * Auditoría funcional de la web compilada (dist/) con un navegador real.
 *
 * Recorre TODAS las páginas y, en cada una:
 *  - inventaría cada enlace, botón y formulario y comprueba a dónde lleva
 *    (página interna que existe, ancla que existe en destino, teléfono, email,
 *    WhatsApp o web externa con formato válido);
 *  - pulsa los enlaces internos y anota la URL final (mapa de navegación);
 *  - revisa los formularios: destino, campos obligatorios, etiquetas y que el
 *    envío lleve a la página de gracias;
 *  - comprueba metadatos (title, description, canonical, lang, viewport, OG),
 *    un único H1, orden de encabezados, IDs duplicados e imágenes sin alt;
 *  - pasa axe-core (WCAG 2.2 AA) en escritorio y detecta scroll lateral en móvil.
 *
 * Uso: npm run build && node scripts/auditoria.mjs
 * Resultado: docs/AUDITORIA-NAVEGACION.md (sale con código 1 si hay errores).
 */
import { createServer } from 'node:http';
import { readFile, readdir, stat, writeFile } from 'node:fs/promises';
import { extname, join, relative, sep } from 'node:path';
import { chromium } from 'playwright';

const ROOT = new URL('..', import.meta.url).pathname;
const DIST = join(ROOT, 'dist');
const PORT = 4331;
const BASE = `http://localhost:${PORT}`;
const TYPES = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.woff2': 'font/woff2', '.woff': 'font/woff', '.xml': 'application/xml', '.txt': 'text/plain' };

async function walk(dir) {
  const out = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const f = join(dir, e.name);
    if (e.isDirectory()) out.push(...(await walk(f)));
    else out.push(f);
  }
  return out;
}

// Servidor estático que además acepta POST (simula el envío del formulario).
const server = createServer(async (req, res) => {
  const path = decodeURIComponent(new URL(req.url, BASE).pathname);
  let file = join(DIST, path);
  try {
    if ((await stat(file)).isDirectory()) file = join(file, 'index.html');
    res.writeHead(200, { 'Content-Type': TYPES[extname(file)] ?? 'application/octet-stream' });
    res.end(await readFile(file));
  } catch {
    res.writeHead(404, { 'Content-Type': TYPES['.html'] });
    res.end(await readFile(join(DIST, '404.html')).catch(() => ''));
  }
});
await new Promise((r) => server.listen(PORT, r));

const pages = (await walk(DIST))
  .filter((f) => f.endsWith('.html'))
  .map((f) => '/' + relative(DIST, f).split(sep).join('/').replace(/index\.html$/, ''))
  .sort();

const errors = [];
const warnings = [];
const navMap = []; // { page, text, href, destino }
const forms = [];
const axeSummary = [];
const existsCache = new Map();

async function urlExists(url) {
  if (!existsCache.has(url)) existsCache.set(url, (await fetch(BASE + url)).status === 200);
  return existsCache.get(url);
}

const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
const desktop = await browser.newContext({ viewport: { width: 1440, height: 900 }, locale: 'es-ES' });
const mobile = await browser.newContext({ viewport: { width: 390, height: 844 }, locale: 'es-ES' });
const axeSource = await readFile(join(ROOT, 'node_modules/axe-core/axe.min.js'), 'utf8');

for (const path of pages) {
  const page = await desktop.newPage();
  const consoleErrors = [];
  page.on('pageerror', (e) => consoleErrors.push(e.message));
  page.on('console', (m) => m.type() === 'error' && consoleErrors.push(m.text()));
  const res = await page.goto(BASE + path, { waitUntil: 'networkidle' });
  const isUtility = path === '/404.html' || path.startsWith('/gracias');
  if (res.status() !== 200 && path !== '/404.html') errors.push(`${path}: responde HTTP ${res.status()}`);
  consoleErrors.forEach((e) => errors.push(`${path}: error en consola: ${e}`));

  const info = await page.evaluate(() => {
    const q = (s) => [...document.querySelectorAll(s)];
    const meta = (n) => document.querySelector(`meta[name="${n}"], meta[property="${n}"]`)?.getAttribute('content') ?? null;
    const ids = q('[id]').map((e) => e.id);
    return {
      lang: document.documentElement.lang,
      title: document.title,
      description: meta('description'),
      viewport: meta('viewport'),
      ogTitle: meta('og:title'),
      ogImage: meta('og:image'),
      canonical: document.querySelector('link[rel="canonical"]')?.href ?? null,
      h1: q('h1').length,
      headings: q('h1,h2,h3,h4').map((h) => Number(h.tagName[1])),
      dupIds: ids.filter((id, i) => ids.indexOf(id) !== i),
      imgsNoAlt: q('img:not([alt])').map((i) => i.src),
      links: q('a[href]').map((a) => ({
        text: (a.textContent || a.getAttribute('aria-label') || '').replace(/\s+/g, ' ').trim().slice(0, 60),
        href: a.getAttribute('href'),
        target: a.getAttribute('target'),
        rel: a.getAttribute('rel'),
        inNav: !!a.closest('header, footer'),
      })),
      buttons: q('button').map((b) => ({ text: (b.textContent || b.getAttribute('aria-label') || '').replace(/\s+/g, ' ').trim(), type: b.type, label: b.getAttribute('aria-label') || b.querySelector('.sr-only')?.textContent || '' })),
      forms: q('form').map((f) => ({
        name: f.getAttribute('name'),
        action: f.getAttribute('action'),
        method: f.getAttribute('method'),
        fields: [...f.querySelectorAll('input:not([type=hidden]), select, textarea')].map((el) => ({
          name: el.name,
          required: el.required,
          labelled: !!(el.id && document.querySelector(`label[for="${el.id}"]`)) || !!el.closest('label') || !!el.getAttribute('aria-label'),
        })),
      })),
    };
  });

  // Metadatos y estructura
  if (info.lang !== 'es') errors.push(`${path}: <html lang> = "${info.lang}" (debe ser "es")`);
  if (!info.viewport) errors.push(`${path}: falta meta viewport`);
  if (!isUtility) {
    if (!info.description) errors.push(`${path}: falta meta description`);
    if (!info.canonical) warnings.push(`${path}: falta canonical`);
    if (!info.ogTitle || !info.ogImage) warnings.push(`${path}: Open Graph incompleto`);
  }
  if (info.h1 !== 1) errors.push(`${path}: ${info.h1} encabezados H1 (debe haber 1)`);
  info.headings.forEach((lvl, i) => {
    if (i > 0 && lvl > info.headings[i - 1] + 1) warnings.push(`${path}: salto de encabezado H${info.headings[i - 1]} → H${lvl}`);
  });
  info.dupIds.forEach((id) => errors.push(`${path}: id duplicado "${id}"`));
  info.imgsNoAlt.forEach((src) => errors.push(`${path}: imagen sin alt (${src})`));
  info.buttons.filter((b) => !b.text && !b.label).forEach(() => errors.push(`${path}: botón sin texto accesible`));

  // Enlaces: a dónde llevan
  for (const l of info.links) {
    const h = l.href;
    let destino;
    if (h.startsWith('#')) {
      const ok = h === '#' ? false : await page.$(h).then(Boolean).catch(() => false);
      destino = ok ? `ancla ${h} en la misma página` : `ANCLA INEXISTENTE ${h}`;
      if (!ok) errors.push(`${path}: enlace «${l.text}» apunta a un ancla que no existe (${h})`);
    } else if (h.startsWith('/')) {
      const [p, hash] = h.split('#');
      const clean = p.split('?')[0];
      const ok = await urlExists(clean);
      destino = ok ? `página ${h}` : `PÁGINA INEXISTENTE ${h}`;
      if (!ok) errors.push(`${path}: enlace «${l.text}» lleva a una página que no existe (${h})`);
      else if (hash) {
        const html = await (await fetch(BASE + clean)).text();
        if (!html.includes(`id="${hash}"`)) {
          errors.push(`${path}: enlace «${l.text}» apunta a ${h} pero el ancla #${hash} no existe en destino`);
          destino += ' (ancla inexistente)';
        }
      }
    } else if (h.startsWith('tel:')) {
      destino = `llamada a ${h.slice(4)}`;
      if (!/^tel:\+?\d{9,15}$/.test(h)) errors.push(`${path}: teléfono con formato no válido (${h})`);
    } else if (h.startsWith('mailto:')) {
      destino = `email a ${h.slice(7)}`;
      if (!/^mailto:[^@\s]+@[^@\s]+\.[a-z]{2,}$/i.test(h)) errors.push(`${path}: email con formato no válido (${h})`);
    } else if (/^https:\/\/wa\.me\//.test(h)) {
      destino = `WhatsApp ${h.split('?')[0].replace('https://wa.me/', '+')}`;
      if (!/^https:\/\/wa\.me\/\d{9,15}/.test(h)) errors.push(`${path}: enlace de WhatsApp con formato no válido (${h})`);
    } else if (/^https?:\/\//.test(h)) {
      destino = `web externa ${new URL(h).host}`;
      if (h.startsWith('http://')) warnings.push(`${path}: enlace externo sin HTTPS (${h})`);
      if (l.target === '_blank' && !/noopener/.test(l.rel || '')) warnings.push(`${path}: enlace externo en nueva pestaña sin rel="noopener" (${h})`);
    } else {
      destino = `DESTINO DESCONOCIDO ${h}`;
      warnings.push(`${path}: enlace con destino no reconocido (${h})`);
    }
    if (!l.text) warnings.push(`${path}: enlace sin texto visible ni aria-label (${h})`);
    if (!l.inNav || path === '/') navMap.push({ page: path, text: l.text || '(sin texto)', href: h, destino });
  }

  // Formularios
  for (const f of info.forms) {
    const unlabelled = f.fields.filter((x) => !x.labelled && x.name !== 'empresa_web');
    unlabelled.forEach((x) => errors.push(`${path}: campo «${x.name}» del formulario sin etiqueta`));
    forms.push({ page: path, ...f, required: f.fields.filter((x) => x.required).map((x) => x.name) });
  }

  // Accesibilidad automática (axe-core, WCAG 2.2 AA)
  await page.addScriptTag({ content: axeSource });
  const axe = await page.evaluate(async () => {
    // eslint-disable-next-line no-undef
    const r = await axe.run(document, { runOnly: ['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'] });
    return r.violations.map((v) => ({ id: v.id, impact: v.impact, help: v.help, nodes: v.nodes.length }));
  });
  axe.forEach((v) => {
    const msg = `${path}: accesibilidad [${v.impact}] ${v.help} (${v.id}, ${v.nodes} elementos)`;
    (v.impact === 'critical' || v.impact === 'serious' ? errors : warnings).push(msg);
  });
  axeSummary.push({ page: path, violations: axe.length });
  await page.close();

  // Móvil: scroll lateral
  const m = await mobile.newPage();
  await m.goto(BASE + path, { waitUntil: 'networkidle' });
  const overflow = await m.evaluate(() => document.documentElement.scrollWidth - innerWidth);
  if (overflow > 1) errors.push(`${path}: en móvil desborda ${overflow}px en horizontal`);
  await m.close();
}

// Recorrido real: pulsar los botones principales y comprobar adónde llegan.
const journeys = [];
{
  const page = await desktop.newPage();
  await page.goto(BASE + '/', { waitUntil: 'networkidle' });
  const ctas = await page.$$eval('main a.btn', (as) => [...new Set(as.map((a) => a.textContent.replace(/\s+/g, ' ').trim()))]);
  for (const text of ctas) {
    await page.goto(BASE + '/', { waitUntil: 'networkidle' });
    const link = page.locator('main a.btn', { hasText: text }).first();
    const href = await link.getAttribute('href');
    if (!href || !href.startsWith('/')) {
      journeys.push({ from: '/', click: text, to: href });
      continue;
    }
    await Promise.all([page.waitForLoadState('networkidle'), link.click()]);
    journeys.push({ from: '/', click: text, to: new URL(page.url()).pathname + new URL(page.url()).search });
  }
  // Formulario de contacto: rellenar, enviar y verificar destino.
  await page.goto(BASE + '/contacto/?motivo=propuesta&servicio=iva', { waitUntil: 'networkidle' });
  const pre = await page.evaluate(() => ({ motivo: document.getElementById('cf-motivo')?.value, servicio: document.getElementById('cf-servicio')?.value }));
  journeys.push({ from: '/contacto/?motivo=propuesta&servicio=iva', click: 'Precarga del formulario', to: `motivo=${pre.motivo}, servicio=${pre.servicio}` });
  if (pre.motivo !== 'propuesta' || pre.servicio !== 'iva') errors.push('/contacto/: el formulario no se precarga con los parámetros del enlace');
  const form = page.locator('form[name="contacto"]');
  await form.locator('#cf-nombre').fill('Prueba Auditoría');
  await form.locator('#cf-email').fill('prueba@example.com');
  await form.locator('#cf-perfil').selectOption({ index: 1 });
  await form.locator('input[name="acepta_privacidad"]').check();
  await Promise.all([page.waitForLoadState('networkidle'), form.locator('button[type="submit"]').click()]);
  const after = new URL(page.url()).pathname;
  journeys.push({ from: '/contacto/', click: 'Enviar consulta (datos de prueba)', to: after });
  if (after !== '/gracias/') errors.push(`/contacto/: tras enviar el formulario se llega a ${after} en lugar de /gracias/`);
  // Formulario vacío: no debe enviarse.
  await page.goto(BASE + '/contacto/', { waitUntil: 'networkidle' });
  await page.locator('form[name="contacto"] button[type="submit"]').click();
  await page.waitForTimeout(300);
  const stayed = new URL(page.url()).pathname === '/contacto/';
  journeys.push({ from: '/contacto/', click: 'Enviar con el formulario vacío', to: stayed ? 'se queda en /contacto/ (validación correcta)' : 'SE ENVÍA VACÍO' });
  if (!stayed) errors.push('/contacto/: el formulario se envía vacío');
  // Menú móvil
  const m = await mobile.newPage();
  await m.goto(BASE + '/', { waitUntil: 'networkidle' });
  await m.click('.site-nav__toggle');
  const open = await m.isVisible('#menu-principal');
  journeys.push({ from: '/ (móvil)', click: 'Abrir menú', to: open ? 'menú visible' : 'NO SE ABRE' });
  if (!open) errors.push('Menú móvil: no se abre al pulsar el botón');
  await m.keyboard.press('Escape');
  const closed = !(await m.isVisible('#menu-principal'));
  journeys.push({ from: '/ (móvil)', click: 'Tecla Escape', to: closed ? 'menú cerrado' : 'NO SE CIERRA' });
  await m.close();
  await page.close();
}

await browser.close();
server.close();

// Informe
const uniq = (arr) => [...new Set(arr)];
const byDest = new Map();
for (const n of navMap) {
  const key = `${n.text} → ${n.destino}`;
  byDest.set(key, uniq([...(byDest.get(key) ?? []), n.page]));
}
const lines = [
  '# Auditoría de navegación',
  '',
  `Generado: ${new Date().toLocaleString('es-ES')} · ${pages.length} páginas · ${navMap.length} enlaces de contenido revisados`,
  '',
  `## Resumen: ${errors.length} errores · ${uniq(warnings).length} avisos`,
  '',
  errors.length ? '## Errores' : '## Errores: ninguno',
  ...uniq(errors).map((e) => `- ${e}`),
  '',
  uniq(warnings).length ? '## Avisos' : '## Avisos: ninguno',
  ...uniq(warnings).map((w) => `- ${w}`),
  '',
  '## Recorridos de usuario (clic real en el navegador)',
  '',
  '| Desde | Acción | Resultado |',
  '| --- | --- | --- |',
  ...journeys.map((j) => `| ${j.from} | ${j.click} | ${j.to} |`),
  '',
  '## Formularios',
  '',
  ...forms.map((f) => `- ${f.page}: «${f.name}» → ${f.method?.toUpperCase()} ${f.action} · obligatorios: ${f.required.join(', ')}`),
  '',
  '## Mapa de enlaces (adónde lleva cada opción)',
  '',
  '| Enlace → destino | Aparece en |',
  '| --- | --- |',
  ...[...byDest].sort().map(([k, v]) => `| ${k.replace(/\|/g, '/')} | ${v.length > 4 ? `${v.length} páginas` : v.join(', ')} |`),
  '',
  '## Accesibilidad (axe-core, WCAG 2.2 AA)',
  '',
  ...axeSummary.map((a) => `- ${a.page}: ${a.violations} tipos de incidencia`),
  '',
];
await writeFile(join(ROOT, 'docs', 'AUDITORIA-NAVEGACION.md'), lines.join('\n'));
console.log(`Auditoría: ${pages.length} páginas, ${errors.length} errores, ${uniq(warnings).length} avisos → docs/AUDITORIA-NAVEGACION.md`);
if (errors.length) {
  console.log(uniq(errors).slice(0, 40).map((e) => '  ✗ ' + e).join('\n'));
  process.exit(1);
}
