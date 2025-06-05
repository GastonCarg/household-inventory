export const formatDate = (date: string | Date): string => {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: '2-digit',
  };
  return new Date(date).toLocaleDateString('es-AR', options);
}
