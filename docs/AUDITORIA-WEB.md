# Auditoría web externa — AR Fiscal

Fecha: 5 de octubre de 2026 · Auditor: auditor web externo (independiente) · Alcance: rama actual, build de `dist/` (23 páginas), `netlify.toml`, `docs/PUBLICAR.md`.

Herramientas ejecutadas: `npm run build` (OK, 23 páginas), `npm run verify` (sin errores), `npm run auditoria` (23 páginas, 194 enlaces, 0 errores, 0 avisos, axe-core 0 incidencias; ver `docs/AUDITORIA-NAVEGACION.md`), `npm run screenshots` (revisadas capturas de escritorio y móvil), `npm audit --omit=dev` (0 vulnerabilidades), inspección manual de código y de `dist/`.

> Los datos entre [CORCHETES], `example.com`, `900 000 000` y la ausencia de precios no se cuentan como hallazgos (son provisionales o decisión de negocio).

---

## 1. Veredicto

**Todavía no se puede publicar**, y no solo por los datos provisionales. La base técnica es muy buena (web estática ligera, navegación completa sin enlaces rotos, formulario bien marcado para Netlify, accesibilidad automática limpia), pero la web **afirma medidas de seguridad y una garantía que la propia configuración declara como no implantadas** (`site.security.*` y `credentials.seguroRC` están a `false` y no se usan), y la **política de privacidad niega transferencias internacionales** cuando el formulario elegido (Netlify Forms) guarda los datos en EE. UU. Ambos son riesgos legales (publicidad engañosa y RGPD) en un despacho que vende precisamente rigor. Corrigiendo los 2 bloqueantes y las 4 altas (esfuerzo total aproximado: 1–2 días) la web queda lista para salir.

| Área | Nota |
| --- | --- |
| Navegación | 9 |
| Formularios | 6 |
| Rendimiento | 9 |
| SEO técnico | 7 |
| Accesibilidad | 7 |
| Seguridad y privacidad | 4 |
| Diseño y responsive | 8 |
| Contenido, confianza y legal | 6 |

---

## 2. Hallazgos priorizados

| Prioridad | Área | Problema | Evidencia | Propuesta concreta | Esfuerzo |
| --- | --- | --- | --- | --- | --- |
| **Bloqueante** | Seguridad / Contenido | La web promete cifrado en reposo, servidores en la UE, doble factor, registro de accesos, copias diarias y «área de cliente», pero la configuración dice que nada de eso está implantado y los indicadores `site.security.*` no se usan en ningún fichero. | `src/config/site.ts:65-78` (`euDataOnly`, `encryptionAtRest`, `twoFactor`, `dailyBackups` = `false`, «Cada sello o frase de la web depende de estos valores»); `grep` de `site.security` → 0 usos. Afirmaciones fijas en `src/pages/seguridad.astro:8-34`, `src/components/TrustBar.astro:10` («Datos cifrados en la UE», visible en el hero de la portada), `src/data/faq.ts:46-48` («servidores ubicados en la UE, cifrados en tránsito y en reposo»), `src/pages/privacidad.astro:84`. | Condicionar cada frase a su indicador: en `seguridad.astro` construir `blocks` con `site.security.encryptionAtRest && {...}`, etc., y dejar siempre un bloque cierto («Conexión cifrada HTTPS», «Secreto profesional»); en `TrustBar.astro:10` usar `site.security.euDataOnly && site.security.encryptionAtRest && {...}`; en `faq.ts` generar la respuesta de «¿Dónde se guardan mis datos?» a partir de `site.security`; en `privacidad.astro:84` describir solo las medidas activas. Quitar «área de cliente» mientras no exista (el canal es `site.documentChannel`). | M |
| **Bloqueante** | Seguridad / Legal | La garantía de plazo («pagamos el recargo o la sanción») se muestra aunque no hay seguro de RC. Existe `showDeadlineGuarantee` precisamente para evitarlo, pero ningún componente lo usa. | `src/config/site.ts:137` define `showDeadlineGuarantee` (= `false` hoy); `src/components/Guarantees.astro:12` usa `g.deadlineGuarantee`; captura de portada, bloque «Confianza que puedes comprobar» muestra «Garantía de plazo»; `src/data/faq.ts:41-43` (FAQ mostrada en portada y en `/preguntas-frecuentes/`); `src/pages/condiciones.astro:71`; `src/pages/quienes-somos.astro:27` («Si nos equivocamos, lo asumimos y lo pagamos nosotros»). | Sustituir `g.deadlineGuarantee` por `showDeadlineGuarantee` en `Guarantees.astro` y `condiciones.astro`; en `faq.ts` añadir la pregunta solo si `showDeadlineGuarantee` (o reformular: «lo corregimos sin coste» sin prometer pagar sanciones); en `quienes-somos.astro:27` dejar «Si nos equivocamos, lo corregimos sin coste» salvo que `showDeadlineGuarantee`. | S |
| **Alta** | Formularios / Privacidad | La política de privacidad y la primera capa del formulario no reflejan el destino real de los datos: Netlify Forms (Netlify Inc., EE. UU.) almacena los envíos en EE. UU. y además el hosting registra IPs. La política dice «No realizamos transferencias internacionales fuera del EEE» y la primera capa «no se ceden datos a terceros». WhatsApp (Meta) tampoco aparece. | `src/pages/privacidad.astro:70`; `src/components/ContactForm.astro:92`; `src/config/site.ts:115` (`provider: 'netlify'`). Netlify confirma almacenamiento de envíos en EE. UU. y DPA con cláusulas contractuales tipo ([foro Netlify](https://answers.netlify.com/t/netlify-forms-data-center-location/24588), [docs](https://docs.netlify.com/manage/forms/submissions/)). | Elegir una de dos: (a) mantener Netlify y en `privacidad.astro` §3 sustituir la frase por: «El formulario y el alojamiento web los presta Netlify, Inc. (EE. UU.) como encargado del tratamiento; la transferencia se ampara en el Marco de Privacidad de Datos UE-EE. UU. y/o cláusulas contractuales tipo», añadir WhatsApp (Meta Platforms Ireland) si se usa con clientes, y en `ContactForm.astro:92` poner «Destinatarios: no se ceden datos salvo obligación legal; encargado: Netlify, Inc. (EE. UU.), con garantías adecuadas»; firmar el DPA de Netlify y borrar los envíos tras pasarlos al correo/CRM. (b) Pasar a un proveedor de formularios con datos en la UE (`site.form.provider = 'formspree'` o propio) si se quiere mantener «todo en la UE». | S |
| **Alta** | Accesibilidad / Diseño | En las 3 páginas de servicio los botones del hero son casi invisibles: «Cómo trabajamos» es texto azul marino sobre fondo azul marino y «Solicitar propuesta» es un botón azul marino sobre el mismo fondo. axe no lo detecta porque el fondo es una imagen. Es la llamada a la acción principal de las páginas que más convierten. | `src/pages/servicios/[slug].astro:154-155` (`btn--primary` y `btn--secondary` dentro de `PageHero`, fondo `--navy-900`); captura `.preview/screenshots/servicios_iva-movil.png` (hero). | Usar las mismas variantes que la portada: `btn btn--gold` para «Solicitar propuesta» y `btn btn--ghost-light` para «Cómo trabajamos». Añadir a `scripts/auditoria.mjs` una comprobación de contraste de botones dentro de `.page-hero`. | S |
| **Alta** | SEO / Despliegue | No hay salvaguarda para el periodo de pre-lanzamiento: `docs/PUBLICAR.md:16` publica en `*.netlify.app` «ya visible para cualquiera» con `preLaunch: true`, datos provisionales y canónicas/sitemap apuntando a `https://www.example.com`; robots permite indexar. Si se olvida el paso 7, todas las canónicas quedan en `example.com`. | `astro.config.mjs:8`; `dist/robots.txt` (`Allow: /`, `Sitemap: https://www.example.com/...`); `src/layouts/BaseLayout.astro:61` (noindex solo por página). | En `BaseLayout.astro`, emitir `<meta name="robots" content="noindex, nofollow">` cuando `site.preLaunch` sea `true`; en `robots.txt.ts`, devolver `Disallow: /` si `site.preLaunch`. Añadir en `astro.config.mjs` (o en `scripts/verify.mjs`) un fallo de build si `!site.preLaunch && site` contiene `example.com` o `pendingFields().length > 0`. | S |
| **Alta** | Seguridad / Negocio | El repositorio es público (según `.gitignore`: «el repositorio es público») y contiene la estrategia de precios y márgenes en `docs/ANALISIS.md:52-82` (planes, precios ancla, competencia) y en el historial (`src/data/pricing.ts`, commits `1f3f0dc`, `4387bb5`). Contradice la decisión de no publicar precios y la expone a la competencia. | `docs/ANALISIS.md:74-82`; `git log -- src/data/pricing.ts`. | Hacer privado el repositorio en GitHub (Netlify funciona igual con repos privados). Si debe seguir público, mover `docs/ANALISIS.md` a `interno/` y reescribir historial (o crear un repo nuevo limpio). | S |
| Media | Seguridad | Sin `Content-Security-Policy`. El resto de cabeceras es correcto (HSTS, X-Frame-Options, nosniff, Referrer-Policy, Permissions-Policy). | `netlify.toml:11-18`. Hay scripts en línea (`<script type="module">` del menú y del próximo plazo) y estilos en atributo (`style="--photo: url(...)"`). | Añadir en `netlify.toml` → `[headers.values]`: `Content-Security-Policy = "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self'; form-action 'self'; frame-ancestors 'none'; base-uri 'self'; object-src 'none'; upgrade-insecure-requests"`. Mejor aún, activar `security: { csp: true }` de Astro 7 (hashes en lugar de `unsafe-inline` en scripts) y comprobar con `npm run screenshots` que las fotos de fondo siguen viéndose. | S |
| Media | Formularios | La prueba de envío de `npm run auditoria` solo demuestra que el navegador llega a `/gracias/` en local; la recepción real en Netlify, la notificación por email y el filtro antispam no se han probado. No hay plan B si el envío falla (el usuario vería un error genérico de Netlify). | `docs/AUDITORIA-NAVEGACION.md` (recorrido «Enviar consulta → /gracias/»); `docs/PUBLICAR.md:19`. | Tras el primer despliegue: activar *Form detection*, configurar notificación por email a 2 destinatarios, enviar 3 consultas de prueba (una con honeypot relleno) y confirmar que llegan. En `/gracias/` y bajo el botón de envío añadir «¿No funciona? Escríbenos a {email} o por WhatsApp». | S |
| Media | Despliegue | `docs/PUBLICAR.md` está desactualizado: las cuentas nuevas de Netlify usan planes por créditos (300 créditos/mes en el gratuito; ~15 créditos por despliegue a producción, formularios ilimitados). Cada push a la rama publicada consume créditos y, al agotarlos, el plan gratuito pausa el sitio. | `docs/PUBLICAR.md:24` («100 envíos de formulario al mes»). Fuente: [Netlify, créditos](https://docs.netlify.com/manage/accounts-and-billing/billing/billing-for-credit-based-plans/how-credits-work/). | Actualizar el apartado de costes; publicar desde `main` y trabajar en ramas (los *deploy previews* no se publican en producción); desactivar despliegues automáticos de otras ramas en *Build & deploy*. | S |
| Media | Contenido / SEO | Las guías (contenido fiscal, YMYL) van firmadas por «AR Fiscal», sin autor ni credenciales, y el JSON-LD `Article` no tiene `datePublished`, `image` ni autor persona. La portada promete «Personas reales» y «Un asesor fiscal revisa cada modelo», pero `/quienes-somos/` no presenta a ninguna persona. | `src/pages/guias/[slug].astro:20-29,35`; `src/pages/index.astro:162-170`; captura `quienes-somos-escritorio.png`. | Crear `site.team` (nombre, cargo, colegiación, foto) y una ficha de autor; en `[slug].astro` usar `author: { '@type': 'Person', name, jobTitle }`, añadir `datePublished` al esquema de la colección e `image: og-default.png`. Mostrar el equipo en `/quienes-somos/` en cuanto se puedan publicar los datos. | M |
| Media | Navegación / SEO | Las guías no enlazan al servicio correspondiente (solo un «escríbenos» genérico y la banda final). Los servicios sí enlazan a las guías: el enlazado es de un solo sentido. | `docs/AUDITORIA-NAVEGACION.md`: «IVA → /servicios/iva/» solo aparece en `/` y `/servicios/`; `src/pages/guias/[slug].astro:41-44`. | Añadir al front-matter de las guías `service: 'iva' \| 'retenciones' \| 'irpf-autonomos'` y en `[slug].astro`, antes del aviso final, una caja: «¿Quieres que lo hagamos por ti? Ver el servicio de IVA → / Solicitar propuesta» con `?motivo=propuesta&servicio=...`. | S |
| Media | Mantenibilidad | Documentación interna obsoleta tras quitar precios: referencias a `src/data/pricing.ts`, `/precios/` y planes. | `docs/PENDIENTES.md` (§2: «Confirmar los precios de `src/data/pricing.ts`», «`/precios/`», «planes anuales»); `docs/INDICE.md:16,21,41,84`; `README.md:32`. | Eliminar esas líneas y sustituir por «Plantilla de propuesta de honorarios» como pendiente de negocio. Borrar capturas antiguas `.preview/screenshots/precios-*.png`. | S |
| Baja | Rendimiento | Las fotos son JPEG de 1024 px servidas por CSS a cualquier ancho: en escritorio 1440 px el hero se ve algo blando y en móvil se descargan 116 KB sin necesidad; la imagen de fondo del hero (candidata a LCP) no se precarga. | `dist/img/hero.jpg` (1024×768, 116 KB), `cabecera.jpg` (55 KB); `src/lib/photos.ts`. | Generar con `sharp` versiones AVIF/WebP a 800/1600 px y usar `image-set()` en `--photo`; añadir `<link rel="preload" as="image" imagesrcset=...>` solo en la portada. | S |
| Baja | Rendimiento | 6 pesos de fuente (≈120 KB en woff2) sin precarga. | `src/layouts/BaseLayout.astro:1-6`. | Quitar Cormorant 700 si no se usa en titulares y precargar `source-sans-3-latin-400` y `cormorant-garamond-latin-600`. | S |
| Baja | Accesibilidad | El enlace a privacidad de la casilla abre pestaña nueva sin avisarlo. | `src/components/ContactForm.astro:85`. | Añadir `rel="noopener"` y el texto oculto `<span class="sr-only">(se abre en una pestaña nueva)</span>`. | S |
| Baja | Contenido | El calendario traslada plazos de fin de semana, pero no festivos nacionales; y no indica el plazo de domiciliación (día 15 / 25 de enero). | `src/data/calendar.ts:1-7,30-45`. | Añadir una lista `holidays` (1/1, 6/1, 1/5, 15/8, 12/10, 1/11, 6/12, 8/12, 25/12) a `businessDay()` y una columna «domiciliación» en la tabla. | S |
| Baja | Contenido | «Llamada sin coste adicional» bajo el teléfono solo es cierto con un 900; si el número definitivo es geográfico o móvil, el texto engaña. | Captura `contacto-escritorio.png`; `src/pages/contacto.astro`. | Generarlo desde configuración (`site.contact.phoneNote`) o quitarlo. | S |

**Lo que está bien (sin acción):** build y verificación sin errores; 0 enlaces rotos, 0 IDs duplicados, 0 scroll lateral en móvil; axe-core 0 incidencias en 23 páginas; menú móvil con `aria-expanded` y cierre con Escape; migas de pan con `BreadcrumbList`; menú activo con `aria-current`; `prefers-reduced-motion` respetado; 404 y `/gracias/` útiles y con `noindex`; `/gracias/` fuera del sitemap; títulos y descripciones únicos; Open Graph correcto (imagen 1200×630 revisada); canónicas y `lang="es"`; JS mínimo (2 scripts pequeños), CSS ≈28 KB, HTML de portada 42 KB, `dist/` total 1,2 MB; caché inmutable en `/_astro/*`; enlaces externos con `rel="noopener"`; sin cookies ni terceros, coherente con `/cookies/`; contenido fiscal de las guías correcto a fecha de hoy (recargos, 7 %/15 %, 19 % alquileres, 70 % exención del 130, Verifactu 2027 tras el RDL 15/2025); la garantía de seguro y los sellos AEAT ya se ocultan bien con sus indicadores en `TrustBar`.

---

## 3. Mapa de navegación comentado

| Recorrido | Cómo se hace | Estado |
| --- | --- | --- |
| Portada → propuesta | Botón dorado del hero «Solicitar propuesta» → `/contacto/?motivo=propuesta` (motivo precargado). También en cabecera, banda final y pie. | Funciona (clic real verificado). |
| Servicio → contacto | `/servicios/iva/` → «Solicitar propuesta» → `/contacto/?motivo=propuesta&servicio=iva` (motivo y servicio precargados). | Funciona, **pero el botón del hero es casi invisible** (hallazgo Alta). El botón de la cabecera y la banda final sí se ven. |
| Guía → contacto | `/guias/modelo-303/` → «escríbenos» (`/contacto/`, sin precarga) o banda final «Solicitar propuesta». | Funciona; falta el paso intermedio guía → servicio y la precarga del servicio (Media). |
| Calendario → contacto | Cabecera y banda final. | Funciona. |
| Móvil | Menú hamburguesa con todas las opciones, teléfono y CTA; se cierra con Escape; sin scroll lateral a 390 px. | Funciona. |
| Contacto → gracias | Envío → `/gracias/` → «Mientras tanto, lee nuestras guías» / «Volver al inicio». | Funciona en local; pendiente de probar en Netlify. |
| 404 | «Ir al inicio», «Ver servicios», «Contactar». | Correcto. |

Sin páginas huérfanas: las 23 páginas reciben enlaces (las legales desde el pie, `/gracias/` solo desde el formulario, como debe ser). «Solicitar propuesta» está a un clic desde todas las páginas gracias a la cabecera.

---

## 4. Destino de los datos del formulario

**Flujo real:** `/contacto/` → `POST /gracias/` con `data-netlify="true"`, `form-name=contacto` y honeypot `empresa_web` → Netlify detecta el formulario al desplegar, guarda cada envío en su base de datos (**EE. UU.**), lo filtra como spam (honeypot + filtro propio) y, si se configura en *Forms → Notifications*, envía un email con el contenido al despacho → el usuario ve `/gracias/`.

**Campos:** nombre, email, teléfono (opcional), situación, motivo, servicio, volumen de facturas, mensaje libre y casilla de privacidad (obligatoria, no premarcada). Validación nativa HTML correcta; primera capa RGPD presente.

**Riesgos:**
1. Transferencia internacional no informada (privacidad dice lo contrario) → hallazgo Alta.
2. El campo libre invita a contar datos fiscales: quedan en Netlify indefinidamente. Exportar y borrar periódicamente (p. ej. mensual) y fijar ese plazo en la política (ahora «máximo 1 año»).
3. Dependencia de un único aviso por email: si la notificación falla, nadie se entera. Configurar 2 destinatarios y revisar el panel de *Forms* semanalmente.
4. Sin alternativa visible si el envío falla → añadir email/WhatsApp junto al botón.
5. Detección de formularios desactivada por defecto en sitios nuevos: si no se activa, los envíos se pierden aunque el usuario vea `/gracias/` → paso obligatorio en la checklist.

---

## 5. Lista de comprobación previa a la publicación

- [ ] Corregir las afirmaciones de seguridad para que dependan de `site.security` (Bloqueante).
- [ ] Usar `showDeadlineGuarantee` en garantías, FAQ, condiciones y quiénes somos (Bloqueante).
- [ ] Actualizar privacidad y primera capa con Netlify (EE. UU.), WhatsApp y garantías de transferencia; firmar DPA de Netlify.
- [ ] Botones del hero de servicios con `btn--gold` / `btn--ghost-light`.
- [ ] `noindex` + `Disallow: /` mientras `preLaunch` sea `true`; fallo de build si se publica con `example.com`.
- [ ] Repositorio privado (o retirar `docs/ANALISIS.md` y limpiar historial).
- [ ] Rellenar todos los [CORCHETES] de `src/config/site.ts` (el build los lista) y quitar `preLaunch`.
- [ ] Cambiar `site` en `astro.config.mjs` al dominio definitivo.
- [ ] Revisión de textos legales por abogado y de guías por asesor colegiado.
- [ ] Netlify: activar *Form detection*, notificaciones a 2 emails, prueba real de 3 envíos.
- [ ] Añadir CSP y comprobar capturas.
- [ ] Dominio propio con HTTPS; redirección `*.netlify.app` → dominio (opción *Primary domain*).
- [ ] Email profesional con SPF, DKIM y DMARC.
- [ ] Search Console + envío de `sitemap-index.xml`.
- [ ] `npm run build && npm run verify && npm run auditoria` sin errores en la versión final.

---

## 6. Mejoras de nivel «despacho grande»

1. **Equipo con nombre y credenciales**: foto profesional, número de colegiado y LinkedIn del responsable; autor visible en cada guía con fecha de revisión. Es la señal de confianza número uno en servicios profesionales (y en YMYL para Google).
2. **Ejemplo descargable del papel de trabajo** (PDF anonimizado): convierte el diferenciador principal en algo tangible.
3. **Portal de documentación real** en proveedor UE (p. ej. una sala de datos con 2FA) y, cuando esté, activar los indicadores de `site.security`; entonces la página `/seguridad/` sí será un argumento comercial.
4. **Reserva de la consulta gratuita de 30 minutos** con calendario integrado (proveedor UE) tras el envío del formulario, en `/gracias/`.
5. **Recordatorios de plazos por email** (lista de avisos con doble confirmación) desde `/calendario-fiscal/`: capta contactos fuera de temporada.
6. **Sellos verificables** en cuanto sean ciertos: colaborador social AEAT, seguro RC con importe, asociación profesional, reseñas de Google con enlace al perfil.
7. **Página por perfil** («Autónomo que empieza», «Vengo de otra gestoría», «Trimestres atrasados») enlazadas desde los motivos del formulario.
8. **Imágenes propias** (despacho, equipo) en lugar de fotos de stock CC BY de Flickr, con formatos AVIF/WebP.
9. **Analítica sin cookies alojada en la UE** para medir la conversión de cada CTA sin banner.
