# Índice del proyecto · AR Fiscal

Web de **AR Fiscal**, asesoría fiscal 100 % online de Fernando Ávila Rivero, especializada en los impuestos periódicos de autónomos y pymes: IVA, retenciones y pagos a cuenta del IRPF.

| Documento | Para qué sirve |
| --- | --- |
| [INDICE.md](INDICE.md) | Este índice: estructura, páginas y cómo trabajar con el proyecto |
| [ANALISIS.md](ANALISIS.md) | Análisis completo: enfoque, tecnología, mercado, precios, monetización, legal, SEO y hoja de ruta |
| [PENDIENTES.md](PENDIENTES.md) | Lista de comprobación antes del lanzamiento |
| [REVISION.md](REVISION.md) | Informe del agente revisor especialista (se regenera en cada revisión) |

## 1. Mapa de la web

| Ruta | Página | Objetivo |
| --- | --- | --- |
| `/` | Inicio | Propuesta de valor, servicios, proceso, precios, garantías, equipo, FAQ |
| `/servicios/` | Servicios | Catálogo de modelos y lo que no hacemos |
| `/servicios/iva/` | IVA | Modelos 303, 390, 349 y 347 |
| `/servicios/retenciones/` | Retenciones | Modelos 111, 190, 115 y 180 |
| `/servicios/irpf-autonomos/` | IRPF del autónomo | Modelos 130, 036 y renta (100) |
| `/precios/` | Precios | Planes, comparativa, pago anual, modelos sueltos y extras |
| `/como-funciona/` | Cómo funciona | Proceso en 4 pasos y requisitos para empezar |
| `/calendario-fiscal/` | Calendario fiscal | Próximos vencimientos (se actualiza solo) y calendario general |
| `/guias/` | Guías | Contenidos SEO: 303, 111, 115, 130 y Verifactu |
| `/quienes-somos/` | Quiénes somos | Fundador, valores y datos de la empresa |
| `/seguridad/` | Seguridad | Cómo se protegen los datos y cómo se presenta en nombre del cliente |
| `/preguntas-frecuentes/` | Preguntas frecuentes | Dudas agrupadas, con datos estructurados FAQPage |
| `/contacto/` | Contacto | Formulario (se rellena con el plan elegido), teléfono, WhatsApp, email |
| `/gracias/` | Gracias | Confirmación del formulario (no se indexa) |
| `/aviso-legal/`, `/privacidad/`, `/cookies/`, `/condiciones/` | Legales | LSSI, RGPD, cookies y contrato del servicio |
| `/404` | Error | Página no encontrada |

## 2. Estructura del código

```
├── astro.config.mjs          Configuración de Astro (dominio, sitemap)
├── public/                   Ficheros estáticos (favicon, imagen para redes)
├── src/
│   ├── config/site.ts        ★ Marca, contacto, datos legales, credenciales, garantías, equipo, formulario
│   ├── data/
│   │   ├── pricing.ts        ★ Planes, modelos sueltos y extras (precios sin IVA)
│   │   ├── services.ts       Servicios, modelos tributarios y exclusiones
│   │   ├── calendar.ts       Generador del calendario fiscal (traslada fines de semana)
│   │   └── faq.ts            Preguntas frecuentes
│   ├── content/guias/*.md    Guías en Markdown (añadir una = crear un fichero)
│   ├── content.config.ts     Esquema de las guías
│   ├── components/           Piezas reutilizables (cabecera, precios, pasos, FAQ, formulario...)
│   ├── layouts/              Plantilla base (SEO, Open Graph, JSON-LD) y plantilla legal
│   ├── pages/                Una ruta por fichero
│   └── styles/global.css     Sistema de diseño (colores, tipografía, botones, tarjetas, tablas)
├── scripts/
│   ├── verify.mjs            Verificación estática: enlaces, títulos, descripciones, H1
│   ├── screenshots.mjs       Capturas en escritorio y móvil + errores JS y scroll lateral
│   ├── preview-bundle.mjs    Versión autocontenida para publicar como vista previa
│   └── og-image.mjs          Imagen para redes (public/og-default.png) con la marca y el precio
├── .claude/agents/
│   ├── ejecucion-web.md      Agente de ejecución (compila, verifica, captura, empaqueta)
│   └── revisor-especialista.md  Agente revisor (fiscal, legal, conversión, SEO)
└── docs/                     Esta documentación
```

★ = ficheros que más vas a tocar.

## 3. Cómo trabajar

```bash
npm install            # una vez
npm run dev            # servidor local con recarga en http://localhost:4321
npm run build          # genera la web en dist/
npm run verify         # comprueba enlaces, títulos y descripciones
npm run screenshots    # capturas y errores en navegador real (.preview/screenshots/)
npm run ejecucion      # todo lo anterior + vista previa empaquetada
npm run og             # regenera la imagen para redes si cambias marca o precios
```

En un equipo nuevo, antes de las capturas: `npx playwright install chromium`.

### Cambios habituales

| Quiero... | Edita |
| --- | --- |
| Cambiar teléfono, email, horario o datos legales | `src/config/site.ts` |
| Cambiar precios o lo que incluye cada plan | `src/data/pricing.ts` (y la tabla de `src/pages/precios.astro`) |
| Activar el sello de colaborador social o del seguro de RC | `site.credentials` en `src/config/site.ts` |
| Añadir reseñas reales | `site.reviews` en `src/config/site.ts` |
| Añadir una guía | Nuevo `.md` en `src/content/guias/` con el mismo encabezado que las demás |
| Añadir una pregunta frecuente | `src/data/faq.ts` |
| Quitar la franja de «web en preparación» | `site.preLaunch = false` |

## 4. Agentes

- **Agente de ejecución** (`ejecucion-web`): tras cada cambio compila, verifica, recorre la web en escritorio y móvil, guarda capturas y prepara la vista previa. Devuelve un informe de estado.
- **Agente revisor especialista** (`revisor-especialista`): actúa como asesor fiscal, abogado de derecho digital, experto en conversión y experto en SEO; deja sus hallazgos priorizados en `docs/REVISION.md`.

Ambos se pueden invocar desde Claude Code pidiéndolo por su nombre (por ejemplo: «usa el agente revisor-especialista»).
