// Same list as the API; amounts are stored as entered (no g↔kg conversions)
export const UNITS = ['unit', 'g', 'kg', 'ml', 'l'] as const;

export type Unit = (typeof UNITS)[number];

export const DEFAULT_UNIT: Unit = 'unit';

/** Increment used by the +/- steppers for each unit. */
export const UNIT_STEP: Record<Unit, number> = {
  unit: 1,
  g: 100,
  kg: 0.5,
  ml: 100,
  l: 0.5,
};

export const isUnit = (value: unknown): value is Unit =>
  typeof value === 'string' && (UNITS as readonly string[]).includes(value);

/** Items counted in units must be whole; weights and volumes can be fractional. */
export const isValidQuantity = (quantity: number, unit: Unit): boolean =>
  Number.isFinite(quantity) &&
  quantity > 0 &&
  (unit !== 'unit' || Number.isInteger(quantity));

/** Parses user input, accepting a decimal comma ("1,5"). */
export const parseQuantity = (value: string): number =>
  value.trim() ? Number(value.trim().replace(',', '.')) : NaN;

// The API stores 3 decimals; also hides float noise from steppers (0.1 + 0.2)
export const roundQuantity = (quantity: number): number =>
  Math.round(quantity * 1000) / 1000;
