# Cómo publicar la web en internet

La web es estática: se compila una vez (`npm run build`) y la carpeta `dist/` se sirve tal cual. Recomendado: **Netlify** (gratis, HTTPS automático, formularios incluidos). El fichero `netlify.toml` ya está preparado.

## Antes de publicar (imprescindible)

1. Rellenar los datos reales en `src/config/site.ts`: titular, NIF, domicilio, teléfono, email, WhatsApp y tu biografía. Ahora hay marcadores entre [CORCHETES].
2. Revisar los textos legales (aviso legal, privacidad, condiciones) con un abogado.
3. Dejar `preLaunch: false` en `src/config/site.ts` para quitar la franja de «web en preparación».

## Paso a paso

1. **Fusionar la rama** `claude/wonderful-maxwell-kgw2iy` en `main` en GitHub (o publicar directamente esa rama).
2. **Crear cuenta en Netlify** (netlify.com) entrando con tu cuenta de GitHub.
3. **Add new site → Import an existing project → GitHub** y elegir `Web-Gestoria-Impuestos`. Netlify lee `netlify.toml`: no hay que tocar nada. Pulsar *Deploy*.
4. En 1–2 minutos tendrás una dirección provisional del tipo `ar-fiscal.netlify.app`, ya visible para cualquiera.
5. **Formularios:** en Netlify → *Forms* → activar la detección de formularios. Las consultas aparecen ahí. En *Forms → Notifications* añade tu email para recibir cada consulta.
6. **Dominio propio** (p. ej. `arfiscal.es`): comprarlo en un registrador (DonDominio, IONOS, Namecheap…), y en Netlify → *Domain management → Add domain* seguir las instrucciones de DNS. El certificado HTTPS se crea solo.
7. Cambiar `site` en `astro.config.mjs` por el dominio definitivo y volver a publicar (cada push a la rama publicada se despliega solo).
8. Dar de alta el dominio en **Google Search Console** y enviar `sitemap-index.xml`.

## Costes orientativos

- Netlify: 0 € (plan gratuito, 100 envíos de formulario al mes).
- Dominio `.es`: unos 10–15 €/año.
- Email profesional con el dominio: desde unos 3–6 €/mes por buzón.

## Alternativas

- **Cloudflare Pages**: también gratis, servidores rápidos en Europa; el formulario necesitaría un servicio externo (p. ej. Formspree) cambiando `site.form`.
- **Hosting tradicional** (IONOS, Hostinger…): subir el contenido de `dist/` por FTP. Más manual y sin formularios integrados.
