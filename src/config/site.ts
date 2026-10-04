/**
 * Configuración central de la web.
 *
 * Todo lo que aparece entre [CORCHETES] es un dato pendiente que debes
 * rellenar antes de publicar (ver docs/PENDIENTES.md). El build avisa por
 * consola de los campos que siguen sin completar.
 */

export const site = {
  /** Marca comercial: AR = Ávila Rivero. Pendiente de comprobar y registrar en la OEPM. */
  name: 'AR Fiscal',
  /** Persona fundadora: dar la cara genera confianza y autoridad (E-E-A-T en Google). */
  founder: 'Fernando Ávila Rivero',
  tagline: 'Tus impuestos, siempre al día',
  /** Descriptor que acompaña a la marca. Ver nota sobre "gestoría" en docs/ANALISIS.md §6. */
  descriptor: 'Asesoría fiscal online para autónomos y pymes',
  description:
    'Presentamos tu IVA, tus retenciones y tus pagos a cuenta del IRPF por un precio cerrado y sin permanencia. Asesoría fiscal 100 % online para autónomos y pequeñas empresas de toda España.',
  locale: 'es_ES',

  /** Muestra una franja superior de "web en preparación". Ponlo a false al lanzar. */
  preLaunch: true,

  contact: {
    email: 'hola@example.com',
    /** Teléfono en formato internacional sin espacios (para enlaces tel: y WhatsApp). */
    phone: '+34900000000',
    phoneDisplay: '900 000 000',
    whatsapp: '+34600000000',
    hours: 'Lunes a jueves de 9:00 a 18:00 y viernes de 9:00 a 15:00',
    /** Horario reforzado en semanas de presentación trimestral. */
    hoursPeak: 'Del 1 al 20 de enero, abril, julio y octubre: lunes a viernes de 9:00 a 19:00',
    responseTime: '24 horas laborables',
  },

  /** Datos obligatorios por la LSSI (art. 10). Deben coincidir con tu alta censal. */
  legal: {
    ownerName: '[RAZÓN SOCIAL O NOMBRE Y APELLIDOS DEL TITULAR]',
    taxId: '[NIF/CIF]',
    address: '[DOMICILIO FISCAL COMPLETO]',
    registry: '[DATOS DEL REGISTRO MERCANTIL, si eres sociedad: tomo, folio, hoja]',
    /** Colegio o asociación profesional de los asesores (si aplica). */
    professionalBody: '[COLEGIO / ASOCIACIÓN PROFESIONAL Y Nº DE COLEGIADO]',
    insurer: '[ASEGURADORA DEL SEGURO DE RESPONSABILIDAD CIVIL PROFESIONAL]',
    dpoEmail: 'privacidad@example.com',
    /** Fecha de la última revisión de los textos legales. */
    lastReview: '4 de octubre de 2026',
  },

  /**
   * Sellos de confianza. Activa solo los que sean 100 % ciertos:
   * anunciar una credencial que no tienes es publicidad engañosa.
   */
  credentials: {
    /** ¿Perteneces a una asociación con convenio de colaboración social con la AEAT? */
    colaboradorSocialAEAT: false,
    /** ¿Tienes seguro de responsabilidad civil profesional contratado? */
    seguroRC: false,
    seguroRCImporte: '[IMPORTE CUBIERTO, p. ej. 600.000 €]',
    /** Años de experiencia del equipo (deja null si prefieres no indicarlo). */
    yearsExperience: null as number | null,
  },

  /** Garantías comerciales. Son compromisos contractuales: mantén solo las que vayas a cumplir. */
  guarantees: {
    noPermanence: true,
    /** Si presentamos fuera de plazo por un error nuestro, pagamos el recargo o la sanción. */
    deadlineGuarantee: true,
    /** Te enviamos el borrador con el importe y no presentamos nada sin tu aprobación. */
    approvalBeforeFiling: true,
  },

  /** Día del mes de presentación hasta el que el cliente debe enviar la documentación. */
  docsDeadlineDay: 10,

  /** Reseñas reales y verificables. Déjalo vacío hasta tenerlas: nunca inventes opiniones. */
  reviews: [] as { author: string; text: string; source: string; url?: string; rating?: number }[],
  /** Enlace al perfil público de reseñas (Google, Trustpilot...). */
  reviewsProfileUrl: '',

  /** Equipo. Poner caras y nombres reales es de lo que más confianza genera. */
  team: [
    {
      name: 'Fernando Ávila Rivero',
      role: 'Fundador · Responsable del servicio',
      credentials: '[Titulación] · [Colegio/asociación y nº de colegiado]',
      bio: '[Dos líneas sobre tu experiencia: años, sectores en los que has trabajado y por qué creaste AR Fiscal.]',
    },
  ],

  /** Formulario de contacto. Por defecto preparado para Netlify Forms. */
  form: {
    /** 'netlify' | 'formspree' | 'custom' */
    provider: 'netlify' as 'netlify' | 'formspree' | 'custom',
    /** URL de envío si usas Formspree u otro servicio (p. ej. https://formspree.io/f/xxxx). */
    action: '',
    successPath: '/gracias/',
  },

  social: {
    linkedin: '',
    instagram: '',
    youtube: '',
  },
};

export const nav = [
  { href: '/servicios/', label: 'Servicios' },
  { href: '/precios/', label: 'Precios' },
  { href: '/como-funciona/', label: 'Cómo funciona' },
  { href: '/calendario-fiscal/', label: 'Calendario fiscal' },
  { href: '/guias/', label: 'Guías' },
  { href: '/quienes-somos/', label: 'Quiénes somos' },
];

export const whatsappUrl = (text = 'Hola, quiero información sobre vuestros planes') =>
  `https://wa.me/${site.contact.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(text)}`;

/** Devuelve las rutas de los campos que aún contienen [PENDIENTE] o ejemplos. */
export function pendingFields(): string[] {
  const out: string[] = [];
  const walk = (obj: unknown, path: string) => {
    if (typeof obj === 'string') {
      if (/\[[^\]]+\]/.test(obj) || obj.includes('example.com') || obj.includes('900000000') || obj.includes('600000000')) {
        out.push(path);
      }
    } else if (obj && typeof obj === 'object') {
      for (const [k, v] of Object.entries(obj)) walk(v, path ? `${path}.${k}` : k);
    }
  };
  walk(site, 'site');
  return out;
}
