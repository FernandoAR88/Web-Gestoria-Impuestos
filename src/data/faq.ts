export type Faq = { q: string; a: string; group: 'servicio' | 'honorarios' | 'seguridad' | 'impuestos' };

export const faqs: Faq[] = [
  {
    group: 'servicio',
    q: '¿Presentáis algo sin que yo lo vea antes?',
    a: 'No. Antes de cada presentación te enviamos el papel de trabajo con el detalle del cálculo y el borrador con el resultado (a pagar, a compensar o a devolver), y solo lo presentamos con tu conformidad. Después recibes el justificante oficial de la AEAT.',
  },
  {
    group: 'servicio',
    q: '¿Qué tengo que enviaros y cuándo?',
    a: 'Tus facturas emitidas y recibidas del trimestre (PDF o foto) y, si aplica, los recibos del alquiler o las nóminas. Puedes subirlas en cualquier momento del trimestre; como muy tarde, el día 10 del mes de presentación.',
  },
  {
    group: 'servicio',
    q: '¿Puedo cambiarme desde otra gestoría o asesoría?',
    a: 'Sí, y nos encargamos nosotros. Solo necesitamos las últimas declaraciones presentadas para revisar tu situación. El cambio no tiene coste.',
  },
  {
    group: 'servicio',
    q: '¿Trabajáis con autónomos de toda España?',
    a: 'Sí, de todo el territorio común. No llevamos de momento País Vasco y Navarra (régimen foral) ni Canarias, Ceuta y Melilla, que no tributan por IVA.',
  },
  {
    group: 'honorarios',
    q: '¿Cuánto cuestan vuestros servicios?',
    a: 'Depende de los modelos que necesites y del volumen de documentación. Tras una primera consulta sin compromiso te enviamos una propuesta de honorarios cerrada y por escrito, antes de empezar ningún trabajo.',
  },
  {
    group: 'honorarios',
    q: '¿Qué incluyen los honorarios?',
    a: 'El proceso completo de cada modelo: revisión de la documentación, papel de trabajo con el detalle del cálculo, borrador para tu aprobación, presentación en plazo, justificante oficial y archivo. Cualquier trabajo adicional se presupuesta antes.',
  },
  {
    group: 'honorarios',
    q: '¿Hay permanencia?',
    a: 'No. Puedes dar por terminado el encargo cuando quieras por escrito. Te entregamos toda tu documentación.',
  },
  {
    group: 'honorarios',
    q: '¿Y si os equivocáis vosotros?',
    a: 'Si un modelo se presenta fuera de plazo o con un error imputable a nosotros, corregimos la declaración sin coste y asumimos el recargo o la sanción correspondiente.',
  },
  {
    group: 'seguridad',
    q: '¿Dónde se guardan mis datos?',
    a: 'En servidores ubicados en la Unión Europea, cifrados en tránsito y en reposo. Solo acceden las personas del equipo que llevan tu cuenta y nunca cedemos tus datos con fines comerciales.',
  },
  {
    group: 'impuestos',
    q: '¿Qué pasa si se me pasa un plazo?',
    a: 'Si presentas fuera de plazo sin requerimiento previo de Hacienda se aplica un recargo del 1 % más otro 1 % por cada mes completo de retraso; pasados 12 meses, el recargo es del 15 % más intereses de demora. Si nos lo encargas, regularizamos los trimestres atrasados con presupuesto cerrado.',
  },
  {
    group: 'impuestos',
    q: '¿Me afecta Verifactu?',
    a: 'Sí, si emites facturas con un programa informático. Será obligatorio usar un software adaptado desde el 1 de enero de 2027 para sociedades y desde el 1 de julio de 2027 para autónomos. Te orientamos para elegir uno compatible con nuestro servicio.',
  },
];
