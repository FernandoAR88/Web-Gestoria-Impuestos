/** Servicios y modelos tributarios que se ofrecen. */

export type TaxModel = {
  code: string;
  name: string;
  who: string;
  when: string;
};

export type Service = {
  slug: string;
  title: string;
  short: string;
  icon: 'euro' | 'percent' | 'file';
  models: TaxModel[];
};

export const services: Service[] = [
  {
    slug: 'iva',
    title: 'IVA',
    short: 'Preparamos y presentamos tu IVA trimestral y el resumen anual, con borrador previo para que sepas cuánto vas a pagar.',
    icon: 'euro',
    models: [
      {
        code: '303',
        name: 'Autoliquidación del IVA',
        who: 'Autónomos y sociedades en régimen general del IVA.',
        when: 'Trimestral: del 1 al 20 de abril, julio y octubre, y del 1 al 30 de enero.',
      },
      {
        code: '390',
        name: 'Declaración resumen anual del IVA',
        who: 'Quien presenta el 303 (salvo los casos exonerados).',
        when: 'Anual: del 1 al 30 de enero.',
      },
      {
        code: '349',
        name: 'Declaración recapitulativa de operaciones intracomunitarias',
        who: 'Quien compra o vende bienes o servicios a empresas de otros países de la UE.',
        when: 'Mensual o trimestral según volumen, en los mismos plazos que el IVA.',
      },
      {
        code: '347',
        name: 'Declaración anual de operaciones con terceros',
        who: 'Quien ha tenido operaciones de más de 3.005,06 € al año con un mismo cliente o proveedor.',
        when: 'Anual: durante el mes de febrero.',
      },
    ],
  },
  {
    slug: 'retenciones',
    title: 'Retenciones',
    short: 'Si pagas a profesionales, tienes trabajadores o alquilas un local, ingresamos por ti las retenciones cada trimestre.',
    icon: 'percent',
    models: [
      {
        code: '111',
        name: 'Retenciones de trabajo y actividades profesionales',
        who: 'Quien paga nóminas o facturas de profesionales con retención.',
        when: 'Trimestral: del 1 al 20 de abril, julio, octubre y enero.',
      },
      {
        code: '190',
        name: 'Resumen anual de retenciones del 111',
        who: 'Quien ha presentado el modelo 111 durante el año.',
        when: 'Anual: del 1 al 31 de enero.',
      },
      {
        code: '115',
        name: 'Retenciones por alquiler de inmuebles urbanos',
        who: 'Quien alquila un local u oficina para su actividad y debe practicar retención.',
        when: 'Trimestral: del 1 al 20 de abril, julio, octubre y enero.',
      },
      {
        code: '180',
        name: 'Resumen anual de retenciones del 115',
        who: 'Quien ha presentado el modelo 115 durante el año.',
        when: 'Anual: del 1 al 31 de enero.',
      },
    ],
  },
  {
    slug: 'irpf-autonomos',
    title: 'IRPF del autónomo',
    short: 'Pagos fraccionados del IRPF, alta en Hacienda y declaración de la renta del autónomo en estimación directa.',
    icon: 'file',
    models: [
      {
        code: '130',
        name: 'Pago fraccionado del IRPF (estimación directa)',
        who: 'Autónomos en estimación directa, salvo que el 70 % o más de sus ingresos ya lleve retención.',
        when: 'Trimestral: del 1 al 20 de abril, julio y octubre, y del 1 al 30 de enero.',
      },
      {
        code: '036',
        name: 'Declaración censal de alta, modificación y baja',
        who: 'Todo autónomo o empresa al empezar, cambiar de actividad o cesar.',
        when: 'Antes de iniciar la actividad o en el mes siguiente a cualquier cambio.',
      },
      {
        code: '100',
        name: 'Declaración de la renta',
        who: 'Autónomos (y sus rendimientos personales: trabajo, alquileres, ahorro).',
        when: 'Anual: campaña de abril a finales de junio.',
      },
    ],
  },
];

/** Qué no hacemos (decirlo genera más confianza que prometerlo todo). */
export const notCovered = [
  'Autónomos en estimación objetiva (módulos, modelo 131)',
  'Territorios forales (País Vasco y Navarra), Canarias (IGIC), Ceuta y Melilla (IPSI)',
  'Contabilidad mercantil, Impuesto sobre Sociedades y cuentas anuales',
  'Nóminas, contratos y seguros sociales',
  'Herencias, donaciones e impuestos patrimoniales',
];
