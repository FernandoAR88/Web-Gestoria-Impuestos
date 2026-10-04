#!/usr/bin/env node
/**
 * Descarga y optimiza las fotos corporativas en public/img/ desde Unsplash
 * (Licencia Unsplash: uso comercial gratuito, sin atribución obligatoria).
 * Antes de publicar, comprueba en cada enlace que la foto NO es «Unsplash+».
 *
 * Uso: node scripts/fotos.mjs            (necesita acceso a unsplash.com e images.unsplash.com)
 * Para cambiar una foto, sustituye su identificador abajo o deja tu propio .jpg en public/img/.
 */
import { mkdir, writeFile } from 'node:fs/promises';
import sharp from 'sharp';

const FOTOS = {
  // Portada: reunión con clientes, ambiente cordial y profesional.
  hero: ['NacPS--G7jM', 'khxA-NYntQ4'],
  // Banda central: equipo trabajando a gusto.
  despacho: ['UikYLDQj9_I', 'amkB8DYKrkc', 'YyJNda7nsPo'],
  // Cabeceras interiores: dos profesionales trabajando en un despacho moderno.
  cabecera: ['THOeRE2WhWQ', 'CN54mBf1f8I'],
};

await mkdir('public/img', { recursive: true });
for (const [nombre, ids] of Object.entries(FOTOS)) {
  let ok = false;
  for (const id of ids) {
    try {
      const res = await fetch(`https://unsplash.com/photos/${id}/download?force=true`, { redirect: 'follow' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const buf = Buffer.from(await res.arrayBuffer());
      const jpg = await sharp(buf).resize({ width: 2000, withoutEnlargement: true }).jpeg({ quality: 76, mozjpeg: true }).toBuffer();
      await writeFile(`public/img/${nombre}.jpg`, jpg);
      console.log(`✓ ${nombre}.jpg  ←  https://unsplash.com/photos/${id}  (${Math.round(jpg.length / 1024)} KB)`);
      ok = true;
      break;
    } catch (e) {
      console.log(`  ${nombre}: ${id} no disponible (${e.message}), pruebo la siguiente…`);
    }
  }
  if (!ok) console.log(`✗ ${nombre}: ninguna foto descargada; la web usará el fondo de raya diplomática.`);
}
