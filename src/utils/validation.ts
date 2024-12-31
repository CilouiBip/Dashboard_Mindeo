import { z } from 'zod';
import { BusinessFunction } from '../types/airtable';

export const scoreSchema = z.object({
  function: BusinessFunction,
  score_global: z.number().min(0).max(10),
  nbr_kpis: z.number().min(0),
  nbr_kpis_alert: z.number().min(0)
});

export const kpiSchema = z.object({
  ID_KPI: z.string(),
  NOM_KPI: z.string(),
  Description: z.string().optional(),
  Type: BusinessFunction,
  Valeur_Actuelle: z.number(),
  Score_Final: z.number(),
  Statut: z.enum(['OK', 'Warning', 'Alerte']),
  Unite: z.string().optional(),
  Min: z.number().optional(),
  Max: z.number().optional(),
  Ponderation: z.number()
});

export const validateScore = (data: unknown) => {
  return scoreSchema.parse(data);
};

export const validateKPI = (data: unknown) => {
  return kpiSchema.parse(data);
};