import { KPI } from '../types/airtable';

export interface ImpactResult {
  revenue: number;
  ebitda: number;
}

export const calculateKPIImpact = (
  kpi: KPI,
  newValue: number,
): ImpactResult => {
  const currentValue = kpi.Valeur_Actuelle;
  if (currentValue === 0) return { revenue: 0, ebitda: 0 };

  let impact: number;

  if (kpi.Impact_Type === 'Linear') {
    impact = ((newValue - currentValue) / currentValue) * 
             kpi.Impact_Weight * 
             kpi.Category_Weight * 
             kpi.Scaling_Factor;
  } else {
    // Exponential impact
    impact = (Math.pow(newValue / currentValue, 2) - 1) * 
             kpi.Impact_Weight * 
             kpi.Category_Weight * 
             kpi.Scaling_Factor;
  }

  // Apply inverse direction if needed
  if (kpi.Impact_Direction === 'Inverse') {
    impact *= -1;
  }

  const revenueImpact = kpi.Baseline_Revenue * impact;
  const ebitdaImpact = revenueImpact * kpi.EBITDA_Factor;

  return {
    revenue: Math.round(revenueImpact),
    ebitda: Math.round(ebitdaImpact)
  };
};

export const calculateTotalImpact = (impacts: ImpactResult[]): ImpactResult => {
  return impacts.reduce(
    (acc, curr) => ({
      revenue: acc.revenue + curr.revenue,
      ebitda: acc.ebitda + curr.ebitda
    }),
    { revenue: 0, ebitda: 0 }
  );
};

export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(value);
};
