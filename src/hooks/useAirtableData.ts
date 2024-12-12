import { useQuery } from '@tanstack/react-query';
import { fetchKPIs, fetchAuditItems, fetchMarketingProblems, fetchSubProblems } from '../api/airtable';
import { useScoreStore } from '../store/scoreStore';

export function useAirtableData() {
  const { setProblems, setSubProblems, setAuditItems, setKPIs, calculateScores } = useScoreStore();

  return useQuery({
    queryKey: ['airtableData'],
    queryFn: async () => {
      try {
        const [problems, subProblems, auditItems, kpis] = await Promise.all([
          fetchMarketingProblems(),
          fetchSubProblems(),
          fetchAuditItems(),
          fetchKPIs(),
        ]);

        setProblems(problems);
        setSubProblems(subProblems);
        setAuditItems(auditItems);
        setKPIs(kpis);
        calculateScores();

        return { problems, subProblems, auditItems, kpis };
      } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
      }
    },
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });
}