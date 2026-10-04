/**
 * Tarifas. Todos los importes son SIN IVA (servicio B2B para autónomos y empresas);
 * en la web se muestra también el total con IVA para que no haya sorpresas.
 * La justificación de cada precio frente al mercado está en docs/ANALISIS.md §4.
 */

export const VAT_RATE = 0.21;

export const eur = (n: number) =>
  n.toLocaleString('es-ES', {
    minimumFractionDigits: Number.isInteger(n) ? 0 : 2,
    maximumFractionDigits: 2,
  }) + ' €';

export const withVat = (n: number) => Math.round(n * (1 + VAT_RATE) * 100) / 100;

export type Plan = {
  id: string;
  name: string;
  monthly: number;
  /** Pago anual: 12 meses al precio de 10. */
  yearly: number;
  audience: string;
  invoicesPerQuarter: number;
  highlighted?: boolean;
  includes: string[];
  notIncluded?: string[];
};

export const plans: Plan[] = [
  {
    id: 'esencial',
    name: 'Esencial',
    monthly: 24.9,
    yearly: 249,
    audience: 'Autónomos que empiezan o tienen poca actividad, sin empleados ni local alquilado.',
    invoicesPerQuarter: 60,
    includes: [
      'IVA trimestral (modelo 303)',
      'Pago fraccionado del IRPF (modelo 130)',
      'Resumen anual del IVA (modelo 390)',
      'Alta, cambios y baja en Hacienda (modelo 036)',
      'Borrador con el importe antes de presentar',
      'Avisos de plazos y de documentación pendiente',
      'Soporte por email y chat',
    ],
    notIncluded: ['Retenciones (111, 115)', 'Declaración de la renta (59 € aparte)'],
  },
  {
    id: 'completo',
    name: 'Completo',
    monthly: 39.9,
    yearly: 399,
    audience: 'Autónomos con proveedores profesionales, local alquilado o clientes en la UE.',
    invoicesPerQuarter: 150,
    highlighted: true,
    includes: [
      'Todo lo del plan Esencial',
      'Retenciones de profesionales y trabajadores (modelos 111 y 190)',
      'Retenciones del alquiler del local (modelos 115 y 180)',
      'Operaciones intracomunitarias (modelo 349)',
      'Operaciones con terceros (modelo 347)',
      'Declaración de la renta anual (modelo 100) incluida',
      'Asesor asignado por teléfono y WhatsApp',
    ],
  },
  {
    id: 'plus',
    name: 'Plus',
    monthly: 64.9,
    yearly: 649,
    audience: 'Autónomos con más volumen y pequeñas sociedades que quieren delegar sus modelos.',
    invoicesPerQuarter: 400,
    includes: [
      'Todo lo del plan Completo',
      'Válido para sociedades (modelos de IVA y retenciones)',
      'Requerimientos de Hacienda sobre los modelos que presentamos',
      'Revisión fiscal trimestral por videollamada (20 min)',
      'Respuesta prioritaria en 4 horas laborables',
    ],
    notIncluded: ['Impuesto sobre Sociedades y cuentas anuales (presupuesto aparte)'],
  },
];

export type SingleModel = {
  code: string;
  name: string;
  period: string;
  price: number;
  note?: string;
};

/** Presentaciones sueltas, sin suscripción. Precios por presentación. */
export const singleModels: SingleModel[] = [
  { code: '303', name: 'Autoliquidación del IVA', period: 'Trimestral', price: 39 },
  { code: '130', name: 'Pago fraccionado del IRPF', period: 'Trimestral', price: 35 },
  { code: '303 + 130', name: 'Pack trimestral del autónomo', period: 'Trimestral', price: 65 },
  { code: '111', name: 'Retenciones de trabajadores y profesionales', period: 'Trimestral', price: 35 },
  { code: '115', name: 'Retenciones por alquiler de locales', period: 'Trimestral', price: 29 },
  { code: '349', name: 'Operaciones intracomunitarias', period: 'Trimestral o mensual', price: 35 },
  { code: '390', name: 'Resumen anual del IVA', period: 'Anual', price: 45 },
  { code: '190', name: 'Resumen anual de retenciones (111)', period: 'Anual', price: 39 },
  { code: '180', name: 'Resumen anual de retenciones de alquiler (115)', period: 'Anual', price: 35 },
  { code: '347', name: 'Operaciones con terceros', period: 'Anual', price: 45 },
  { code: '036', name: 'Alta, modificación o baja censal', period: 'Puntual', price: 35, note: 'Gratis con cualquier plan' },
  { code: '100', name: 'Declaración de la renta del autónomo', period: 'Anual', price: 79, note: '59 € con el plan Esencial; incluida en Completo y Plus' },
];

export type Extra = { name: string; price: string; detail: string };

export const extras: Extra[] = [
  {
    name: 'Facturas adicionales',
    price: '+5 €/mes',
    detail: 'Por cada bloque de 50 facturas al trimestre por encima del límite de tu plan.',
  },
  {
    name: 'Trimestres atrasados',
    price: 'Desde 35 € por modelo',
    detail: 'Regularizamos presentaciones pendientes. Te damos presupuesto cerrado antes de empezar.',
  },
  {
    name: 'Requerimientos de Hacienda',
    price: 'Desde 60 €',
    detail: 'Incluidos en el plan Plus. Si el requerimiento se debe a un error nuestro, es gratis en cualquier plan.',
  },
  {
    name: 'Declaración complementaria',
    price: '25 €',
    detail: 'Cuando hay que corregir un modelo por documentación que nos llegó después de presentarlo.',
  },
];

/** Referencias de mercado (octubre de 2026) usadas para fijar las tarifas. Solo para uso interno. */
export const marketReference = {
  updated: 'octubre 2026',
  onlineMonthlyRange: [25, 80],
  traditionalMonthlyRange: [50, 120],
  single303Range: [25, 60],
};
