export const formatDate = (date: string | Date, lang?: string): string => {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  };
  return new Date(date).toLocaleDateString(lang || 'es-AR', options);
};

export const getExpirationDaysLeft = (expireDate: string | Date): number => {
  const today = new Date();
  const expirationDate = new Date(expireDate);
  const timeDiff = expirationDate.getTime() - today.getTime();
  return Math.ceil(timeDiff / (1000 * 3600 * 24));
};

const pad = (value: number) => String(value).padStart(2, '0');

/** Local date as `YYYY-MM-DD`, the format used by `<input type="date">`. */
export const toDateInputValue = (date: Date): string =>
  `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

export const addDaysToToday = (days: number): string => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return toDateInputValue(date);
};

export const isoToDateInputValue = (iso?: string): string =>
  iso ? toDateInputValue(new Date(iso)) : '';

/** Noon local time keeps the same calendar day across time zones. */
export const dateInputValueToISO = (value: string): string => {
  const [year, month, day] = value.split('-').map(Number);
  return new Date(year, month - 1, day, 12).toISOString();
};

const LAST_LOCATION_KEY = 'household-inventory:lastLocationId';

export const getLastLocationId = (): string => {
  try {
    return localStorage.getItem(LAST_LOCATION_KEY) ?? '';
  } catch {
    return '';
  }
};

export const setLastLocationId = (id: string | number): void => {
  try {
    localStorage.setItem(LAST_LOCATION_KEY, String(id));
  } catch {
    // Storage can be unavailable (private mode); remembering is just a convenience
  }
};
