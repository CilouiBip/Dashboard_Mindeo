// KPIs where an increase is negative (red) and a decrease is positive (green)
const INVERSE_TREND_KPIS = new Set([
  'CAC',
  'CAC trend',
  'Taux d\'absentéisme',
  'Temps moyen recrutement',
  'Taux de rebond LP',
  'Coût par embauche',
  'Taux d\'abandon Closer',
  'Taux d\'abandon Setter',
  'CPL',
  'Délai Moyen recouvrement',
  'Salaire moyen',
  'Debt to Equity'
]);

export const shouldInvertTrend = (kpiName: string): boolean => {
  return INVERSE_TREND_KPIS.has(kpiName);
};

export const getTrendColor = (kpiName: string, isIncrease: boolean): string => {
  const shouldInvert = shouldInvertTrend(kpiName);
  const isPositive = shouldInvert ? !isIncrease : isIncrease;
  return isPositive ? 'text-green-400' : 'text-red-400';
};
