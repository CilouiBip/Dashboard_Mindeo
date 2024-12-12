import { useQuery } from '@tanstack/react-query';
import { api } from '../airtable';
import { FunctionScore } from '../../types/airtable';

export const useFunctionScores = () => {
  return useQuery<FunctionScore[], Error>({
    queryKey: ['functionScores'],
    queryFn: api.fetchFunctionScores,
    select: (data) => {
      // Transform data to ensure it's serializable
      return data.map(score => ({
        Name: String(score.Name),
        Score_Final_Fonction: Number(score.Score_Final_Fonction),
        Nbr_KPIs: Number(score.Nbr_KPIs),
        Nbr_KPIs_Alert: Number(score.Nbr_KPIs_Alert)
      }));
    }
  });
};