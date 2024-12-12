import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PencilLine, BarChart2 } from 'lucide-react';
import { api } from '../api/airtable';
import { KPI } from '../types/airtable';
import KPIGroupCard from '../components/kpi-mvd/KPIGroupCard';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';

const KPIsMVD = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedGroups, setExpandedGroups] = useState<string[]>([]);
  const queryClient = useQueryClient();

  const { data: kpis, isLoading: kpisLoading, error: kpisError } = useQuery({
    queryKey: ['kpis'],
    queryFn: api.fetchKPIs
  });

  const { data: functionScores, isLoading: scoresLoading, error: scoresError } = useQuery({
    queryKey: ['functionScores'],
    queryFn: api.fetchFunctionScores
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, value }: { id: string; value: number }) =>
      api.updateKPIValue(id, value),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['kpis'] });
    }
  });

  if (kpisLoading || scoresLoading) return <LoadingSpinner />;
  if (kpisError || scoresError) return <ErrorMessage error={(kpisError || scoresError) as Error} />;
  if (!kpis?.length) return (
    <div className="p-6 text-center">
      <p className="text-gray-400">No KPIs found</p>
    </div>
  );

  // Group KPIs by function
  const groupedKPIs = kpis.reduce((acc, kpi) => {
    const fonction = kpi.Fonctions;
    if (!acc[fonction]) {
      acc[fonction] = [];
    }
    acc[fonction].push(kpi);
    return acc;
  }, {} as Record<string, KPI[]>);

  // Filter groups based on search term
  const filteredGroups = Object.entries(groupedKPIs).reduce((acc, [fonction, kpis]) => {
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
            <PencilLine className="h-8 w-8 text-violet-500" />
            <h1 className="text-2xl font-bold text-white">Update KPIs</h1>
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
          const functionScore = functionScores?.find(score => score.Name === fonction);
          return (
            <KPIGroupCard
              key={fonction}
              fonction={fonction}
              functionScore={functionScore?.Score_Final_Fonction}
              kpis={kpis}
              isExpanded={expandedGroups.includes(fonction)}
              onToggle={() => toggleGroup(fonction)}
              onUpdate={(id, value) => updateMutation.mutate({ id, value })}
              isUpdating={updateMutation.isLoading}
            />
          );
        })}
      </div>
    </div>
  );
};

export default KPIsMVD;