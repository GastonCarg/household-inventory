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
