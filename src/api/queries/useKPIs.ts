import { useQuery } from '@tanstack/react-query';
import { api } from '../airtable';
import { KPI } from '../../types/airtable';

export const useKPIs = (functionName?: string) => {
  return useQuery<KPI[], Error>({
    queryKey: ['kpis', functionName],
    queryFn: () => api.fetchKPIs(functionName),
    enabled: true,
    staleTime: 30000,
    select: (data) => {
      return data.map(kpi => ({
        ID_KPI: String(kpi.ID_KPI),
        Nom_KPI: String(kpi.Nom_KPI),
        Type: String(kpi.Type) as KPI['Type'],
        Valeur_Actuelle: Number(kpi.Valeur_Actuelle),
        Score_KPI_Final: Number(kpi.Score_KPI_Final),
        Statut: String(kpi.Statut) as KPI['Statut'],
        Fonction: String(kpi.Fonction)
      }));
    }
  });
};