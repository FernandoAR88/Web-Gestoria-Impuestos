/**
 * Configuración central de la web.
 *
 * Todo lo que aparece entre [CORCHETES] es un dato pendiente que debes
 * rellenar antes de publicar (ver docs/PENDIENTES.md). El build avisa por
 * consola de los campos que siguen sin completar.
 */

export const site = {
  /** Marca comercial. Pendiente de comprobar y registrar en la OEPM. */
  name: 'AR Fiscal',
  tagline: 'Tus impuestos, siempre al día',
  /** Descriptor que acompaña a la marca. Ver nota sobre "gestoría" en docs/ANALISIS.md §6. */
  descriptor: 'Asesoría fiscal online para autónomos y pymes',
  description:
    'Preparamos y presentamos tu IVA, tus retenciones y tu IRPF con papel de trabajo y borrador para tu aprobación. Asesoría fiscal online para autónomos y pymes.',
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
    hoursPeak: 'Del 1 al 20 de abril, julio y octubre y del 1 al 31 de enero: lunes a viernes de 9:00 a 19:00',
    /** Compromiso de respuesta (se usa en toda la web: «en menos de …»). */
    responseTime: '1 día laborable',
  },

  /** Datos obligatorios por la LSSI (art. 10). Deben coincidir con tu alta censal. */
  legal: {
    ownerName: '[RAZÓN SOCIAL O NOMBRE Y APELLIDOS DEL TITULAR]',
    taxId: '[NIF/CIF]',
    address: '[DOMICILIO FISCAL COMPLETO]',
    /** Solo sociedades. Pon null si eres autónomo y la línea desaparece del aviso legal. */
    registry: '[DATOS DEL REGISTRO MERCANTIL, si eres sociedad: tomo, folio, hoja]' as string | null,
    /** Colegio o asociación profesional de los asesores (si aplica). */
    /** Pon null si no perteneces a ningún colegio o asociación. */
    professionalBody: '[COLEGIO / ASOCIACIÓN PROFESIONAL Y Nº DE COLEGIADO]' as string | null,
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

  /**
   * Medidas de seguridad realmente implantadas. Cada sello o frase de la web depende
   * de estos valores: actívalos solo cuando sean ciertos (publicidad engañosa y RGPD).
   */
  security: {
    /** Todos los proveedores (formulario, correo, documentos) guardan los datos en la UE. */
    euDataOnly: false,
    /** Los documentos se almacenan cifrados en reposo. */
    encryptionAtRest: false,
    /** Acceso con verificación en dos pasos y registro de accesos. */
    twoFactor: false,
    /** Copias de seguridad automáticas diarias. */
    dailyBackups: false,
  },

  /** Canal real por el que el cliente envía su documentación (se muestra en «Cómo trabajamos»). */
  documentChannel: '[CANAL DE DOCUMENTACIÓN: p. ej. una carpeta privada en un proveedor con servidores en la UE, con tu enlace personal]',

  /** Primera consulta y propuesta de honorarios. */
  firstConsultation: {
    free: true,
    minutes: 30,
    /** Plazo comprometido para enviar la propuesta tras la consulta. */
    proposalHours: 48,
  },

  /** Garantías comerciales. Son compromisos contractuales: mantén solo las que vayas a cumplir. */
  guarantees: {
    noPermanence: true,
    /**
     * Si presentamos fuera de plazo por un error nuestro, pagamos el recargo o la sanción.
     * Solo se muestra si además credentials.seguroRC es true (ver showDeadlineGuarantee).
     */
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
  { href: '/como-funciona/', label: 'Cómo trabajamos' },
  { href: '/calendario-fiscal/', label: 'Calendario' },
  { href: '/guias/', label: 'Guías' },
  { href: '/quienes-somos/', label: 'Quiénes somos' },
];

/** La garantía de plazo solo se anuncia si hay seguro de responsabilidad civil que la respalde. */
export const showDeadlineGuarantee = site.guarantees.deadlineGuarantee && site.credentials.seguroRC;

export const whatsappUrl = (text = 'Hola, quiero información sobre vuestros servicios') =>
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
