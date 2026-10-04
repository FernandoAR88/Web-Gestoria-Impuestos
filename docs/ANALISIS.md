# Análisis del proyecto · AR Fiscal

Documento de decisiones: qué vendemos, a quién, con qué tecnología, a qué precio y por qué, cómo se gana dinero, qué exige la ley y en qué orden construir. Datos de mercado consultados en octubre de 2026.

---

## 1. Enfoque del negocio

**Qué es.** Una asesoría fiscal 100 % online, con marca **AR Fiscal** (Ávila Rivero) y su fundador, Fernando Ávila Rivero, como cara visible.

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
- **Todo lo editable en datos**: marca, contacto, precios, FAQ y calendario viven en `src/config` y `src/data`; las páginas solo los pintan.
- **Calendario fiscal generado por código**: calcula los vencimientos de cada año y los traslada si caen en fin de semana; en el navegador se ocultan los pasados y se marca el siguiente.
- **Datos estructurados** (JSON-LD): ProfessionalService, BreadcrumbList, FAQPage, OfferCatalog y Article.
- **Accesibilidad**: HTML semántico, enlace «saltar al contenido», foco visible, menú móvil con `aria-expanded`, contraste AA, `prefers-reduced-motion`.
- **Calidad automatizada**: `npm run ejecucion` compila, verifica enlaces y metadatos, recorre la web con un navegador real en escritorio y móvil y detecta errores de JavaScript y scroll lateral.

**Alojamiento recomendado.** Netlify o Cloudflare Pages (plan gratuito suficiente al principio), con dominio `.es` propio y HTTPS. El formulario está preparado para Netlify Forms; ver el aviso de transferencias internacionales en el §6.

## 3. Mercado y competencia

Precios publicados por cada competidor y recogidos por comparativas del sector (octubre de 2026). Cambian a menudo: revísalos antes de usarlos en comunicación comercial.

| Competidor | Precio | Qué incluye |
| --- | --- | --- |
| TaxDown | 29,90 €/mes (Standard) · 59,90 €/mes (Premium) | Alta, trimestrales de IVA e IRPF, renta, chat; Premium añade gestor, WhatsApp y requerimientos |
| Declarando | 49,90 / 69,90 / 99,90 €/mes + IVA (planes con impuestos) | Software + gestión de impuestos |
| Taxfix (Pro) | 39,90 €/mes | Trimestrales y alta gratuita |
| Xolo | 0 € + 5 % por factura (Go) · 39 €/mes (Leap) · 59 €/mes (Global) | Orientado a freelance |
| Billeo | 65 €/mes + IVA (hasta 15 facturas) · 80 €/mes + IVA (hasta 100) · SL desde 159 €/mes + IVA | Incluye contabilidad; extras como nóminas o renta de no clientes |
| Holded Gestoría | desde 70 €/mes | Software + gestoría |
| Quipu (gestoría) | desde 49 €/mes | Software + gestoría |
| Asesorlex / Ayuda T Pymes | 39 €/mes / 29,95 €/mes | Gestoría online básica |
| Gestoría tradicional | 50–120 €/mes | Presencial, precio variable |

**Modelos sueltos en el mercado:** modelo 303 entre 25 y 60 € por presentación; modelo 115 entre 25 y 45 €; resúmenes anuales entre 40 y 150 €.

**Hueco de mercado.** Los grandes compiten con software propio y paquetes amplios. AR Fiscal compite con **especialización + persona visible + transparencia**: menos cosas, más baratas, mejor explicadas y con una cara detrás.

Fuentes: [TaxDown precios](https://taxdown.es/precios), [Declarando precios](https://declarando.es/precios), [Billeo precios](https://www.billeo.es/precios), [Guía Fiscal: 8 gestorías online comparadas](https://guiafiscal.es/comparativas/mejor-gestoria-online/), [Cronoshare: cuánto cuesta una gestoría](https://www.cronoshare.com/cuanto-cuesta/gestoria), [¿Cuánto cuesta presentar el 303?](https://cuantomecuesta.com/es/declaracion-modelo-303/).

## 4. Estrategia de precios

Precios **sin IVA** (servicio a profesionales), mostrando siempre el total con IVA al lado.

| Plan | Mensual | Anual (2 meses gratis) | Posición frente al mercado |
| --- | --- | --- | --- |
| **Esencial** | 24,90 € | 249 € | Entrada más barata que TaxDown Standard (29,90 €) porque no incluye la renta. Gancho de captación. |
| **Completo** ★ | 39,90 € | 399 € | Plan ancla. Igual que Taxfix Pro y por debajo de Declarando (69,90 €) y Billeo (65–80 €), con retenciones y renta incluidas. |
| **Plus** | 64,90 € | 649 € | Sociedades que solo quieren delegar IVA y retenciones, más requerimientos y revisión trimestral. Muy por debajo de una SL completa (159 € o más) porque no incluye contabilidad ni Impuesto sobre Sociedades. |

**Por qué estos números**

- **El plan del medio se vende solo**: Plus hace de referencia alta y Esencial de entrada; Completo concentra el valor (renta incluida, valorada en 79 €).
- **Precios terminados en ,90**: alineados con la competencia directa y percibidos como cerrados.
- **Modelos sueltos más caros por unidad** para empujar a la suscripción: el pack trimestral 303 + 130 cuesta 65 €; un año suelto (4 × 65 € + 45 € del 390) son 305 €, más que el plan Esencial (298,80 €), que además incluye alta, avisos y soporte.
- **Pago anual con 2 meses gratis** (−16,7 %): adelanta caja, reduce bajas y cubre el pico de trabajo de enero.
- **Extras con precio publicado** (facturas adicionales, atrasados, requerimientos, complementarias): evitan discusiones y convierten el trabajo extra en ingreso.

**Coste en tiempo estimado** (con automatización y revisión humana; estimación a validar con los primeros clientes):

| Plan | Presentaciones al año | Horas al año por cliente | Ingreso por hora |
| --- | --- | --- | --- |
| Esencial | 9 (4 × 303, 4 × 130, 390) | ≈ 3,8 h | ≈ 79 € |
| Completo | ≈ 21 + renta | ≈ 10,7 h | ≈ 45 € |
| Plus | ≈ 21 + revisiones trimestrales | ≈ 14 h | ≈ 56 € |

Si el ingreso por hora de Completo baja de 40 € con clientes reales, hay que automatizar más (importación de facturas) o subir el precio.

## 5. Monetización

1. **Suscripciones (ingreso recurrente)**: el núcleo del negocio.
2. **Modelos sueltos**: producto de entrada en picos de demanda (enero, abril, renta) y para quien no quiere suscribirse. Si contrata un plan, se descuenta lo pagado ese trimestre.
3. **Extras**: renta para clientes Esencial, facturas adicionales, trimestres atrasados, requerimientos y complementarias.
4. **Altas de autónomo gratis con plan**: imán de captación en el momento de mayor necesidad.
5. **Alianzas con comisión** (siempre declaradas al cliente): software de facturación adaptado a Verifactu, cuentas bancarias para autónomos y seguros. Verifactu será obligatorio para autónomos el 1 de julio de 2027: es una oportunidad comercial clara.
6. **Derivación recíproca** con gestorías laborales (nóminas), abogados y coworkings.
7. **Más adelante**: plan Empresa con contabilidad e Impuesto sobre Sociedades, talleres o cursos para autónomos.

**Escenario orientativo** (mezcla 40 % Esencial, 45 % Completo, 15 % Plus):

| Clientes | Ingreso mensual recurrente | Ingreso anual (sin extras) | Horas de trabajo al año |
| --- | --- | --- | --- |
| 100 | ≈ 3.765 € | ≈ 45.200 € | ≈ 840 h (media jornada) |
| 300 | ≈ 11.300 € | ≈ 135.500 € | ≈ 2.530 h (1,5 personas) |

**Métricas que hay que seguir desde el primer día**: coste de captación por cliente, valor de vida del cliente (un cliente Completo durante 24 meses ≈ 958 €), bajas mensuales (objetivo < 2 %), porcentaje de pago anual, minutos por modelo y satisfacción.

**Costes fijos a prever**: dominio y alojamiento (0–20 €/mes), programa fiscal para preparar y presentar modelos, firma electrónica, correo profesional, seguro de responsabilidad civil profesional, cuota de la asociación profesional, pasarela de cobro (domiciliación SEPA o tarjeta) y marketing.

## 6. Legal y cumplimiento

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

## 7. Confianza y conversión

**Ya implementado**

- Precio público, cerrado y con IVA visible; comparativa de planes; modelos sueltos y extras con precio.
- Garantías concretas y por escrito: borrador antes de presentar, garantía de plazo, sin permanencia y precio cerrado.
- Persona real con nombre (el fundador) y datos completos de la empresa.
- Canales y horario publicados (teléfono, WhatsApp, email) y tiempo de respuesta comprometido.
- Página de seguridad con aviso antifraude («nunca te pediremos tus claves»).
- Exclusiones claras («lo que no hacemos»).
- Utilidad real: calendario fiscal vivo y «próximo plazo» en portada.
- Formulario corto que se rellena solo con el plan elegido.

**Lo que más confianza añadiría (pendiente de material real)**

1. Foto profesional y vídeo de 60 segundos de Fernando explicando cómo trabaja.
2. Reseñas verificadas (perfil de Google y Trustpilot) desde los primeros clientes.
3. Sellos reales: colaborador social de la AEAT, asociación profesional y seguro de RC.
4. Casos reales anonimizados, con permiso del cliente.
5. Número de clientes o declaraciones presentadas, solo cuando sea real.

## 8. SEO y captación

| Intención | Búsquedas objetivo | Página |
| --- | --- | --- |
| Informativa | modelo 303, modelo 130, modelo 111, modelo 115, calendario fiscal autónomos, Verifactu 2027 | Guías y calendario |
| Comparativa | gestoría online autónomos, asesoría fiscal online, cuánto cuesta una gestoría | Inicio y precios |
| Transaccional | presentar modelo 303 online, alta autónomo online | Servicios y modelos sueltos |

- **Calendario editorial**: publicar y actualizar guías antes de cada pico (marzo, junio, septiembre y diciembre para los trimestrales; diciembre y enero para 390, 190, 180 y 347; marzo y abril para la renta).
- **E-E-A-T**: guías firmadas por Fernando Ávila Rivero con fecha de actualización; falta una ficha de autor con credenciales.
- **Marca personal**: LinkedIn e Instagram del fundador con consejos de plazo; avisos por email a la lista.
- **Imanes de captación**: calculadora de IVA y de pago fraccionado, calendario descargable, plantilla de factura.
- **Técnico**: sitemap, robots, canónicas, datos estructurados y velocidad ya resueltos. Al lanzar: Google Search Console y analítica sin cookies con servidores en la UE.

## 9. Hoja de ruta

| Fase | Plazo | Contenido |
| --- | --- | --- |
| **0. Web base** | Hecho | Esta web: marca, páginas, precios, guías, legales, agentes de ejecución y revisión |
| **1. Prelanzamiento** | 2–4 semanas | Completar `PENDIENTES.md`: datos legales, revisión jurídica, dominio y alojamiento, formulario con datos en la UE, email profesional, imagen para redes, asociación con convenio, seguro de RC, manual de prevención del blanqueo, contrato y anexo de encargo del tratamiento, pasarela de cobro, registro de marca |
| **2. Captación** | 1–3 meses | Contenidos SEO, marca personal, alianzas, campañas en los picos de enero y abril, imanes de captación |
| **3. Área de cliente** | 3–6 meses | Acceso privado: subida de facturas, estado de cada trimestre, aprobación del borrador con un clic, cobros recurrentes y notificaciones. Astro con servidor y base de datos con alojamiento en la UE |
| **4. Automatización** | 6–12 meses | Lectura automática de facturas, conexión con programas de facturación, generación de ficheros de modelos y presentación masiva como colaborador social |
