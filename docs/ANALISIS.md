# Análisis del proyecto · AR Fiscal

Documento de decisiones: qué vendemos, a quién, con qué tecnología, a qué precio y por qué, cómo se gana dinero, qué exige la ley y en qué orden construir. Datos de mercado consultados en octubre de 2026.

---

## 1. Enfoque del negocio

**Qué es.** Una asesoría fiscal 100 % online, con marca **AR Fiscal**.

**Qué vende.** Solo impuestos periódicos sencillos y automatizables:

| Bloque | Modelos |
| --- | --- |
| IVA | 303 (trimestral), 390 (resumen anual), 349 (intracomunitarias), 347 (operaciones con terceros) |
| Retenciones | 111 y 190 (profesionales y trabajadores), 115 y 180 (alquileres) |
| IRPF del autónomo | 130 (pago fraccionado), 036 (censal), 100 (renta del autónomo) |

**A quién.** Autónomos en estimación directa y micropymes de territorio común. Quedan fuera, de momento: módulos, territorios forales, Canarias, Ceuta y Melilla, contabilidad mercantil e Impuesto sobre Sociedades, nóminas y herencias. Decirlo abiertamente en la web genera confianza y evita clientes que no encajan.

**Por qué este enfoque.** Son trabajos repetitivos, con reglas claras y plazos fijos: se pueden estandarizar y automatizar, lo que permite precios bajos con buen margen y un servicio sin errores. Es también el dolor más frecuente del autónomo («que no se me pase el trimestre»).

**Promesa de marca.** *Tus impuestos, siempre al día*: precio cerrado y público, sin permanencia, borrador con el importe antes de presentar y garantía de plazo.

## 2. Tecnología: por qué Astro

| Opción | A favor | En contra | Veredicto |
| --- | --- | --- | --- |
| **Astro (estático)** | Carga instantánea (Core Web Vitals), SEO excelente, alojamiento gratuito o casi, sin base de datos que atacar, guías en Markdown, se puede ampliar con servidor más adelante | Requiere un servicio externo para formularios | **Elegida** |
| Next.js | Ideal para área de cliente con login y pagos | Más complejidad y coste ahora que no hace falta | Fase 3, si se necesita |
| WordPress | Editable sin programar | Mantenimiento, plugins, seguridad, velocidad | Descartada |
| Webflow / Framer | Diseño visual rápido | Cuota mensual, dependencia del proveedor | Descartada |

**Decisiones técnicas tomadas**

- **Identidad visual señorial y sobria**: azul tinta, oro viejo y fondo marfil; titulares en Cormorant Garamond (serif clásica), texto en Source Sans 3, monograma «AR» tipo sello, filetes dorados y esquinas casi rectas. Transmite solvencia y tradición sin parecer anticuada.
- **Fuentes alojadas en la propia web** (paquetes Fontsource, solo el juego latino): sin Google Fonts ni scripts de terceros. Cero peticiones externas, cero cookies, sin banner de consentimiento y mejor RGPD.
- **Todo lo editable en datos**: marca, contacto, servicios, FAQ y calendario viven en `src/config` y `src/data`; las páginas solo los pintan.
- **Calendario fiscal generado por código**: calcula los vencimientos de cada año y los traslada si caen en fin de semana; en el navegador se ocultan los pasados y se marca el siguiente.
- **Datos estructurados** (JSON-LD): ProfessionalService, BreadcrumbList, FAQPage, OfferCatalog y Article.
- **Accesibilidad**: HTML semántico, enlace «saltar al contenido», foco visible, menú móvil con `aria-expanded`, contraste AA, `prefers-reduced-motion`.
- **Calidad automatizada**: `npm run ejecucion` compila, verifica enlaces y metadatos, recorre la web con un navegador real en escritorio y móvil y detecta errores de JavaScript y scroll lateral.

**Alojamiento recomendado.** Netlify o Cloudflare Pages (plan gratuito suficiente al principio), con dominio `.es` propio y HTTPS. El formulario está preparado para Netlify Forms; ver el aviso de transferencias internacionales en el §6.

## 3. Mercado, honorarios y monetización

La web no publica precios: los honorarios se comunican en una propuesta escrita tras la primera consulta. El análisis de mercado, la tabla de honorarios, las igualas y los escenarios de ingresos son **documentación interna** y se guardan fuera de este repositorio (`interno/`, excluido de Git).

## 4. Legal y cumplimiento

| Tema | Qué implica | Estado |
| --- | --- | --- |
| **Denominación «gestoría»** | «Gestor administrativo» y «gestoría administrativa» son denominaciones reservadas a colegiados (Decreto 424/1963 y RD 2532/1998); usarlas sin colegiarse puede considerarse intrusismo. «Asesor fiscal» no es una profesión regulada. | La web usa «asesoría fiscal online». No usar «gestoría administrativa» salvo colegiación o alianza con un colegiado. |
| **Presentar en nombre del cliente** | Apoderamiento individual en el Registro de Apoderamientos de la AEAT, o **colaboración social** perteneciendo a una asociación o colegio con convenio con la AEAT (permite presentación masiva y da un sello de confianza). | Explicado en la web. Recomendado: unirse a una asociación con convenio. |
| **LSSI (art. 10)** | Aviso legal con titular, NIF, domicilio, email, datos registrales y colegio profesional si lo hay. | Plantilla lista; faltan los datos reales. |
| **RGPD y LOPDGDD** | Registro de actividades de tratamiento, contratos de encargado con cada proveedor, información en dos capas en formularios, derechos, conservación, medidas de seguridad. | Textos y primera capa listos; faltan proveedores reales y el registro de actividades. |
| **Transferencias internacionales** | Netlify, Formspree y muchos proveedores de correo son estadounidenses. La política de privacidad dice ahora que no hay transferencias fuera del EEE. | **Decidir**: proveedor con datos en la UE o cambiar el texto e indicar la garantía (Marco de Privacidad de Datos UE-EE. UU. o cláusulas tipo). |
| **Prevención del blanqueo (Ley 10/2010)** | Los asesores fiscales son sujetos obligados: identificar al cliente y al titular real, conservar documentación 10 años, política interna y formación. Hay obligaciones simplificadas para profesionales pequeños. | Mencionado en el proceso de alta y en privacidad; falta el manual interno. |
| **Consumidores** | Para particulares: precio final con IVA, información previa y 14 días de desistimiento. | Contemplado en condiciones; los precios muestran el total con IVA. |
| **Publicidad y reseñas** | Las garantías publicadas obligan. Prohibido inventar o comprar reseñas (Ley de Competencia Desleal tras la transposición de la Directiva Ómnibus). | La sección de reseñas solo aparece con reseñas reales. |
| **Cookies** | Sin analítica ni terceros no hace falta banner. | Política acorde. Si se añade analítica, usar una sin cookies o pedir consentimiento. |
| **Verifactu (tu propia facturación)** | Software adaptado obligatorio desde el 1-1-2027 (sociedades) o el 1-7-2027 (autónomos), según el RDL 15/2025. | Elegir programa de facturación adaptado. |
| **Marca** | Existen «AR Asesores» y «AR Consulting». Registrar «AR Fiscal» como marca mixta (con el logotipo) en la OEPM tras un estudio de anterioridades; las clases a valorar son la 35 y la 36. | Pendiente. |
| **Seguro de RC profesional** | No siempre obligatorio, pero imprescindible para ofrecer la garantía de plazo y a menudo exigido por las asociaciones. | Pendiente; el sello se activa en `site.ts` cuando exista. |

> Los textos legales de la web son plantillas de trabajo. Deben revisarlos un abogado y, en lo fiscal, un asesor colegiado antes de publicar.

## 5. Confianza y conversión

**Ya implementado**

- Honorarios cerrados por escrito antes de empezar, sin permanencia.
- Garantías concretas y por escrito: borrador antes de presentar, garantía de plazo, sin permanencia y precio cerrado.
- Persona real con nombre (el fundador) y datos completos de la empresa.
- Canales y horario publicados (teléfono, WhatsApp, email) y tiempo de respuesta comprometido.
- Página de seguridad con aviso antifraude («nunca te pediremos tus claves»).
- Exclusiones claras («lo que no hacemos»).
- Utilidad real: calendario fiscal vivo y «próximo plazo» en portada.
- Formulario corto que se rellena solo con el plan elegido.

**Lo que más confianza añadiría (pendiente de material real)**

1. Vídeo corto de presentación del despacho.
2. Reseñas verificadas (perfil de Google y Trustpilot) desde los primeros clientes.
3. Sellos reales: colaborador social de la AEAT, asociación profesional y seguro de RC.
4. Casos reales anonimizados, con permiso del cliente.
5. Número de clientes o declaraciones presentadas, solo cuando sea real.

## 6. SEO y captación

| Intención | Búsquedas objetivo | Página |
| --- | --- | --- |
| Informativa | modelo 303, modelo 130, modelo 111, modelo 115, calendario fiscal autónomos, Verifactu 2027 | Guías y calendario |
| Comparativa | gestoría online autónomos, asesoría fiscal online, cuánto cuesta una gestoría | Inicio y servicios |
| Transaccional | presentar modelo 303 online, alta autónomo online | Servicios y modelos sueltos |

- **Calendario editorial**: publicar y actualizar guías antes de cada pico (marzo, junio, septiembre y diciembre para los trimestrales; diciembre y enero para 390, 190, 180 y 347; marzo y abril para la renta).
- **E-E-A-T**: guías firmadas por AR Fiscal con fecha de actualización.
- **Marca personal**: LinkedIn e Instagram del fundador con consejos de plazo; avisos por email a la lista.
- **Imanes de captación**: calculadora de IVA y de pago fraccionado, calendario descargable, plantilla de factura.
- **Técnico**: sitemap, robots, canónicas, datos estructurados y velocidad ya resueltos. Al lanzar: Google Search Console y analítica sin cookies con servidores en la UE.

## 7. Hoja de ruta

| Fase | Plazo | Contenido |
| --- | --- | --- |
| **0. Web base** | Hecho | Esta web: marca, páginas, guías, legales, agentes de ejecución y revisión |
| **1. Prelanzamiento** | 2–4 semanas | Completar `PENDIENTES.md`: datos legales, revisión jurídica, dominio y alojamiento, formulario con datos en la UE, email profesional, imagen para redes, asociación con convenio, seguro de RC, manual de prevención del blanqueo, contrato y anexo de encargo del tratamiento, pasarela de cobro, registro de marca |
| **2. Captación** | 1–3 meses | Contenidos SEO, marca personal, alianzas, campañas en los picos de enero y abril, imanes de captación |
| **3. Área de cliente** | 3–6 meses | Acceso privado: subida de facturas, estado de cada trimestre, aprobación del borrador con un clic, cobros recurrentes y notificaciones. Astro con servidor y base de datos con alojamiento en la UE |
| **4. Automatización** | 6–12 meses | Lectura automática de facturas, conexión con programas de facturación, generación de ficheros de modelos y presentación masiva como colaborador social |
