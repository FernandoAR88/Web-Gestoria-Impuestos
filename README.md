# AR Fiscal · Web

Web de **AR Fiscal**, asesoría fiscal 100 % online para autónomos y pymes: IVA, retenciones y pagos a cuenta del IRPF, con papel de trabajo y borrador para tu aprobación.

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
- [Análisis](docs/ANALISIS.md): enfoque, tecnología, legal, SEO y hoja de ruta.
- [Pendientes](docs/PENDIENTES.md): lista de comprobación antes de lanzar.

## Lo que más vas a editar

- `src/config/site.ts`: marca, contacto, datos legales, credenciales, seguridad y garantías.
- `src/content/guias/`: guías en Markdown.
