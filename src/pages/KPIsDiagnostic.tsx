import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { BarChart2, Bug } from 'lucide-react';
import { KPI } from '../types/airtable';
import KPIGroupCard from '../components/kpi-mvd/KPIGroupCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import { updateKPIValue } from '../api/kpiApi';
import { useDetailedKPIData } from '../hooks/useDetailedKPIData';

const KPIsDiagnostic = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedGroups, setExpandedGroups] = useState<string[]>([]);
  const queryClient = useQueryClient();

  // Utiliser le hook useDetailedKPIData qui ru00e9cupu00e8re les KPIs avec une requu00eate SQL explicite
  const { data: kpis = [], isLoading: kpisLoading, error: kpisError } = useDetailedKPIData({
    refetchInterval: 60 * 1000 // Refetch every minute
  });

  // Pas besoin de requu00eate su00e9paru00e9e pour les scores de fonction
  // Les scores sont calculu00e9s u00e0 partir des KPIs du00e9taillu00e9s
  const isLoading = kpisLoading;
  
  // DIAGNOSTIC: Vu00e9rifier les KPIs reu00e7us du hook
  console.log('[KPIsDiagnostic] KPIs reu00e7us du hook du00e9taillu00e9:', kpis.length);
  if (kpis.length > 0) {
    console.log('[KPIsDiagnostic] Premier KPI du00e9taillu00e9:', {
      id: kpis[0].ID_KPI,
      nom: kpis[0].Nom_KPI,
      functions: kpis[0].Fonctions,
      score: kpis[0].Score_KPI_Final
    });
  }

  // Extraire les scores de fonction u00e0 partir des KPIs en utilisant la moyenne
  console.log('[KPIsDiagnostic] Calculating function scores from detailed KPIs...');
  
  // Regrouper les KPIs par fonction
  const functionGroups: { [key: string]: KPI[] } = {};
  kpis.forEach(kpi => {
    if (!kpi.Fonctions) {
      console.log('[KPIsDiagnostic] KPI sans fonction:', kpi.Nom_KPI);
      return;
    }
    
    const functions = kpi.Fonctions.split(',').map(f => f.trim()).filter(Boolean);
    
    // Log pour chaque fonction associu00e9e u00e0 ce KPI
    functions.forEach(func => {
      console.log(`[KPIsDiagnostic] KPI ${kpi.Nom_KPI} associu00e9 u00e0 la fonction ${func}`);
      if (!functionGroups[func]) {
        functionGroups[func] = [];
      }
      functionGroups[func].push(kpi);
    });
  });
  
  // Log du nombre de KPIs par fonction
  Object.keys(functionGroups).forEach(func => {
    console.log(`[KPIsDiagnostic] Fonction ${func}: ${functionGroups[func].length} KPIs`);
  });
  
  // Calculer la moyenne des scores pour chaque fonction
  const functionScoresMap: Record<string, number> = {};
  Object.keys(functionGroups).forEach(func => {
    const funcKpis = functionGroups[func];
    let totalScore = 0;
    let validCount = 0;
    
    funcKpis.forEach(kpi => {
      if (typeof kpi.Score_KPI_Final === 'number' && !isNaN(kpi.Score_KPI_Final)) {
        totalScore += kpi.Score_KPI_Final;
        validCount++;
        console.log(`[KPIsDiagnostic] KPI ${kpi.Nom_KPI} for function ${func}: ${kpi.Score_KPI_Final}`);
      } else {
        console.log(`[KPIsDiagnostic] KPI ${kpi.Nom_KPI} has invalid score: ${kpi.Score_KPI_Final}`);
      }
    });
    
    // Calculer la moyenne pour cette fonction
    const avgScore = validCount > 0 ? totalScore / validCount : 0;
    functionScoresMap[func] = Number(avgScore.toFixed(1)); // Arrondir u00e0 1 du00e9cimale
    
    console.log(`[KPIsDiagnostic] Function ${func}: Average score ${functionScoresMap[func]} (based on ${validCount} KPIs)`);
  });

  const updateKPIMutation = useMutation({
    mutationFn: async ({ kpiId, newValue }: { kpiId: string; newValue: number }) => {
      return updateKPIValue({ ID_KPI: kpiId, Valeur_Actuelle: newValue });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['detailed-kpis'] });
    }
  });

  const handleKPIUpdate = async (kpiId: string, newValue: number) => {
    try {
      await updateKPIMutation.mutateAsync({ kpiId, newValue });
    } catch (error) {
      console.error('Failed to update KPI:', error);
    }
  };

  if (isLoading) return <LoadingSpinner />;
  if (kpisError) return <ErrorMessage error={kpisError as Error} />;

  // Filter groups based on search term
  const filteredGroups = Object.entries(functionGroups).reduce((acc, [fonction, kpis]) => {
    const filteredKPIs = kpis.filter(kpi => 
      kpi.Nom_KPI.toLowerCase().includes(searchTerm.toLowerCase()) ||
      fonction.toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (filteredKPIs.length > 0) {
      acc[fonction] = filteredKPIs;
    }
    return acc;
  }, {} as Record<string, KPI[]>);

  const toggleGroup = (fonction: string) => {
    setExpandedGroups(prev => 
      prev.includes(fonction)
        ? prev.filter(f => f !== fonction)
        : [...prev, fonction]
    );
  };

  const toggleAllGroups = () => {
    setExpandedGroups(prev => 
      prev.length === Object.keys(filteredGroups).length
        ? []
        : Object.keys(filteredGroups)
    );
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Bug className="h-8 w-8 text-red-500" />
            <h1 className="text-2xl font-bold text-white">KPIs Diagnostic Mode</h1>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleAllGroups}
              className="px-4 py-2 text-sm bg-violet-500/10 text-violet-400 rounded-lg hover:bg-violet-500/20 transition-colors"
            >
              {expandedGroups.length === Object.keys(filteredGroups).length
                ? 'Collapse All'
                : 'Expand All'}
            </button>
            <BarChart2 className="h-8 w-8 text-violet-500" />
          </div>
        </div>
        <div className="mt-2 text-sm text-gray-400">
          Utilise la requu00eate SQL directe pour retrouver les KPIs avec leurs fonctions. 
          {kpis.length} KPIs ru00e9cupu00e9ru00e9s.
        </div>
        <input
          type="text"
          placeholder="Search KPIs or functions..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full mt-4 px-4 py-2 bg-[#1C1D24] border border-[#2D2E3A] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-violet-500"
        />
      </div>

      <div className="space-y-4">
        {Object.entries(filteredGroups).map(([fonction, kpis]) => {
          return (
            <KPIGroupCard
              key={fonction}
              fonction={fonction}
              functionScore={functionScoresMap[fonction]}
              kpis={kpis}
              isExpanded={expandedGroups.includes(fonction)}
              onToggle={() => toggleGroup(fonction)}
              onUpdate={handleKPIUpdate}
              isUpdating={updateKPIMutation.isPending}
            />
          );
        })}
      </div>
    </div>
  );
};

export default KPIsDiagnostic;
