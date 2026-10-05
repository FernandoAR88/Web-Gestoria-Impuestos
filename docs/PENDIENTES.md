# Pendientes antes del lanzamiento

Marca cada casilla al completarla. El build avisa por consola de los datos de `src/config/site.ts` que siguen sin rellenar.

## 1. Datos que solo puedes aportar tú (`src/config/site.ts`)

- [ ] Razón social o nombre del titular, NIF y domicilio fiscal (`site.legal`)
- [ ] Datos del Registro Mercantil, si eres sociedad
- [ ] Colegio o asociación profesional y número (si aplica)
- [ ] Email, teléfono y WhatsApp reales (`site.contact`)
- [ ] Email de privacidad (`site.legal.dpoEmail`)
- [ ] Foto profesional del equipo (sustituye al icono de usuario)
- [ ] Dominio definitivo en `astro.config.mjs` (`site`)
- [ ] Quitar la franja de «web en preparación» (`site.preLaunch = false`)

## 2. Decisiones de negocio

- [ ] Revisar la tabla interna de honorarios (fuera del repositorio)
- [ ] Mantener o quitar la **garantía de plazo** (pagar recargos y sanciones por error propio). Requiere seguro de RC
- [ ] Baja en planes anuales: ¿se devuelve la parte proporcional? (`/condiciones/`, punto 4)
- [ ] Día límite de entrega de documentación (ahora el día 10: `site.docsDeadlineDay`)
- [ ] Horario de atención y horario reforzado en picos
- [ ] Forma de cobro: domiciliación SEPA, tarjeta o ambas (`/condiciones/`, punto 3)
- [ ] Plazo de respuesta a reclamaciones (`/condiciones/`, punto 10)

## 3. Legal y profesional

- [ ] Revisión de los textos legales por un abogado (aviso legal, privacidad, cookies, condiciones)
- [ ] Revisión del contenido fiscal (guías, FAQ, servicios) por un asesor colegiado
- [ ] Unirse a una asociación o colegio con **convenio de colaboración social** con la AEAT y activar `colaboradorSocialAEAT`
- [ ] Contratar el **seguro de responsabilidad civil profesional** y activar `seguroRC`
- [ ] Manual y procedimientos de **prevención del blanqueo de capitales** (Ley 10/2010)
- [ ] Contrato de servicio y anexo de **encargo del tratamiento** (art. 28 RGPD) para firmar online
- [ ] Registro de actividades de tratamiento y contratos con cada proveedor (alojamiento, formularios, correo, firma, cobros)
- [ ] Decidir cómo se cumplen las **transferencias internacionales** (proveedor con datos en la UE o actualizar la política de privacidad)
- [ ] Lista de proveedores en la política de privacidad (`[LISTA DE PROVEEDORES Y PAÍS]`)
- [ ] Estudio de anterioridades y **registro de la marca «AR Fiscal»** en la OEPM (existen «AR Asesores» y «AR Consulting»)
- [ ] Hojas de reclamaciones, si tu comunidad autónoma las exige a servicios online
- [ ] Programa de facturación propio adaptado a **Verifactu** antes de la fecha que te corresponda

## 4. Técnico

- [ ] **Hacer privado el repositorio de GitHub** (Settings → General → Danger zone → Change visibility)
- [ ] Activar `site.security.*` solo para las medidas realmente implantadas
- [ ] Contrato de encargo del tratamiento con Netlify (o formulario con proveedor UE)

- [ ] Elegir alojamiento (Netlify o Cloudflare Pages) y conectar el repositorio
- [ ] Configurar el formulario: Netlify Forms (por defecto) o Formspree (`site.form`)
- [ ] Probar un envío real del formulario y la página de gracias
- [ ] Revisar la imagen para redes `public/og-default.png` (se regenera con `npm run og`)
- [ ] Email profesional con el dominio (SPF, DKIM y DMARC configurados)
- [ ] Google Search Console y envío del sitemap
- [ ] Analítica sin cookies alojada en la UE (si se quiere medir)
- [ ] Revisar `npm run ejecucion` sin errores antes de cada publicación

## 5. Marketing y confianza

- [ ] Perfil de empresa en Google y en Trustpilot para reseñas verificadas
- [ ] Añadir las primeras reseñas reales en `site.reviews`
- [ ] Vídeo corto de presentación del fundador
- [ ] Ficha de autor con credenciales para las guías
- [ ] Perfiles de LinkedIn e Instagram (`site.social`)
- [ ] Plan de contenidos para los picos de enero, abril, julio y octubre
