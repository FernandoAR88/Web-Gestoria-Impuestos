import { existsSync } from 'node:fs';
import { join } from 'node:path';

/**
 * Fotos corporativas opcionales en public/img/ (.webp o .jpg, horizontal, ≥ 1920 px).
 * Si la foto existe se usa; si no, la web muestra un fondo de «raya diplomática»
 * azul tinta y oro. Así puedes ir añadiendo fotos sin tocar el código.
 *
 *   hero.jpg       Portada: despacho, reunión o persona trabajando
 *   despacho.jpg   Banda intermedia de la portada
 *   cabecera.jpg   Fondo de las cabeceras de las páginas interiores
 */
export function photo(name: string): string | null {
  // WebP primero (más ligero); JPEG como alternativa.
  for (const ext of ['webp', 'jpg']) {
    if (existsSync(join(process.cwd(), 'public', 'img', `${name}.${ext}`))) return `/img/${name}.${ext}`;
  }
  return null;
}

/** Variable CSS --photo lista para usar en un atributo style. */
export function photoVar(name: string): string | undefined {
  const p = photo(name);
  return p ? `--photo: url('${p}')` : undefined;
}
