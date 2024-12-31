export const formatNumber = (value: number, decimals = 1): string => {
  return Number(value).toFixed(decimals);
};

export const formatPercentage = (value: number): string => {
  return `${formatNumber(value)}%`;
};

export const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};