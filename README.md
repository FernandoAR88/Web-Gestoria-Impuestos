# AR Fiscal · Web

Web de **AR Fiscal**, asesoría fiscal 100 % online de Fernando Ávila Rivero para autónomos y pymes: IVA, retenciones y pagos a cuenta del IRPF por un precio cerrado y sin permanencia.

Construida con [Astro](https://astro.build) como sitio estático: rápida, segura, sin cookies de terceros y fácil de alojar gratis.

## Empezar

```bash
npm install
npm run dev          # http://localhost:4321
```

| Comando | Qué hace |
| --- | --- |
| `npm run build` | Genera la web en `dist/` |
| `npm run verify` | Comprueba enlaces rotos, títulos, descripciones y encabezados |
| `npm run screenshots` | Recorre la web en escritorio y móvil, detecta errores y guarda capturas |
| `npm run ejecucion` | Todo lo anterior y prepara la vista previa en `.preview/` |

Para las capturas en un equipo nuevo: `npx playwright install chromium`.

## Documentación

- [Índice del proyecto](docs/INDICE.md): mapa de la web, estructura y cambios habituales.
- [Análisis](docs/ANALISIS.md): enfoque, tecnología, mercado, precios, monetización, legal, SEO y hoja de ruta.
- [Pendientes](docs/PENDIENTES.md): lista de comprobación antes de lanzar.

## Lo que más vas a editar

- `src/config/site.ts`: marca, contacto, datos legales, credenciales, garantías y equipo.
- `src/data/pricing.ts`: planes, modelos sueltos y extras.
- `src/content/guias/`: guías en Markdown.
