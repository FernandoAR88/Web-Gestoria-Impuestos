/**
 * Calendario fiscal de los modelos que gestionamos (territorio común).
 *
 * Los vencimientos se generan con las reglas generales de la AEAT y se
 * trasladan al lunes si caen en sábado o domingo. No contempla festivos
 * nacionales: revisa cada año el calendario oficial del contribuyente.
 */

export type Deadline = {
  /** Fecha límite en formato AAAA-MM-DD. */
  date: string;
  title: string;
  models: string[];
  period: string;
};

const pad = (n: number) => String(n).padStart(2, '0');

const iso = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

/** Traslada al siguiente día hábil si cae en fin de semana. */
function businessDay(year: number, month: number, day: number): string {
  const d = new Date(year, month - 1, day, 12);
  while (d.getDay() === 0 || d.getDay() === 6) d.setDate(d.getDate() + 1);
  return iso(d);
}

const lastDayOfMonth = (year: number, month: number) => new Date(year, month, 0, 12).getDate();

export function deadlinesForYear(year: number): Deadline[] {
  const prev = year - 1;
  const quarterly = ['303', '130', '111', '115', '349'];
  return [
    { date: businessDay(year, 1, 20), title: 'Retenciones del 4.º trimestre', models: ['111', '115'], period: `4T ${prev}` },
    { date: businessDay(year, 1, 30), title: 'IVA y pago fraccionado del 4.º trimestre', models: ['303', '130', '349'], period: `4T ${prev}` },
    { date: businessDay(year, 1, 30), title: 'Resumen anual del IVA', models: ['390'], period: `Ejercicio ${prev}` },
    { date: businessDay(year, 1, 31), title: 'Resúmenes anuales de retenciones', models: ['190', '180'], period: `Ejercicio ${prev}` },
    { date: businessDay(year, 2, lastDayOfMonth(year, 2)), title: 'Operaciones con terceros', models: ['347'], period: `Ejercicio ${prev}` },
    { date: businessDay(year, 4, 20), title: 'Trimestrales del 1.er trimestre', models: quarterly, period: `1T ${year}` },
    { date: businessDay(year, 6, 30), title: 'Fin de la campaña de la renta', models: ['100'], period: `Ejercicio ${prev}` },
    { date: businessDay(year, 7, 20), title: 'Trimestrales del 2.º trimestre', models: quarterly, period: `2T ${year}` },
    { date: businessDay(year, 10, 20), title: 'Trimestrales del 3.er trimestre', models: quarterly, period: `3T ${year}` },
  ];
}

export function upcomingDeadlines(from: Date, count = 8): Deadline[] {
  const today = iso(from);
  const year = from.getFullYear();
  return [...deadlinesForYear(year), ...deadlinesForYear(year + 1), ...deadlinesForYear(year + 2)]
    .filter((d) => d.date >= today)
    .slice(0, count);
}

export function formatDate(isoDate: string, opts: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' }) {
  const [y, m, d] = isoDate.split('-').map(Number);
  return new Date(y, m - 1, d, 12).toLocaleDateString('es-ES', opts);
}

export function daysUntil(isoDate: string, from: Date) {
  const [y, m, d] = isoDate.split('-').map(Number);
  const target = new Date(y, m - 1, d);
  const start = new Date(from.getFullYear(), from.getMonth(), from.getDate());
  return Math.round((target.getTime() - start.getTime()) / 86_400_000);
}

/** Tabla general (sin años) para explicar el calendario. */
export const generalCalendar = [
  { period: '1.er trimestre (enero–marzo)', deadline: '1 al 20 de abril', models: '303, 130, 111, 115, 349' },
  { period: '2.º trimestre (abril–junio)', deadline: '1 al 20 de julio', models: '303, 130, 111, 115, 349' },
  { period: '3.er trimestre (julio–septiembre)', deadline: '1 al 20 de octubre', models: '303, 130, 111, 115, 349' },
  { period: '4.º trimestre (octubre–diciembre)', deadline: '1 al 20 de enero', models: '111, 115' },
  { period: '4.º trimestre (octubre–diciembre)', deadline: '1 al 30 de enero', models: '303, 130, 349' },
  { period: 'Resúmenes anuales', deadline: '1 al 30 de enero', models: '390' },
  { period: 'Resúmenes anuales', deadline: '1 al 31 de enero', models: '190, 180' },
  { period: 'Operaciones con terceros', deadline: '1 al 28/29 de febrero', models: '347' },
  { period: 'Renta', deadline: 'Abril a finales de junio', models: '100' },
];
