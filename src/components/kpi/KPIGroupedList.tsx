import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Search, ChevronDown, ChevronUp } from 'lucide-react';
import { api } from '../../api/airtable';
import { KPI } from '../../types/airtable';
import { useDebounce } from '../../hooks/useDebounce';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';
import KPIGroupCard from './KPIGroupCard';

interface KPIGroupedListProps {
  initialFunction?: string | null;
  kpis: KPI[];
}

const KPIGroupedList: React.FC<KPIGroupedListProps> = ({ initialFunction, kpis }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedGroups, setExpandedGroups] = useState<string[]>([]);
  const debouncedSearch = useDebounce(searchTerm, 300);

  const { data: functionScores, isLoading, error } = useQuery({
    queryKey: ['functionScores'],
    queryFn: api.fetchFunctionScores
  });

  useEffect(() => {
    if (initialFunction) {
      setExpandedGroups([initialFunction]);
    }
  }, [initialFunction]);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;

  // Group KPIs by function
  const groupedKPIs = kpis.reduce((acc, kpi) => {
    const fonction = kpi.Fonctions;
    if (!acc[fonction]) {
      acc[fonction] = [];
    }
    acc[fonction].push(kpi);
    return acc;
  }, {} as Record<string, KPI[]>);

  // Filter KPIs based on search term
  const filteredGroups = Object.entries(groupedKPIs).reduce((acc, [fonction, kpis]) => {
    const filteredKPIs = kpis.filter(kpi => 
      kpi.Nom_KPI.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
      fonction.toLowerCase().includes(debouncedSearch.toLowerCase())
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="relative flex-1 max-w-xl">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search KPIs or functions..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#1C1D24] border border-[#2D2E3A] rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-violet-500"
          />
        </div>
        <button
          onClick={toggleAllGroups}
          className="ml-4 px-4 py-2 text-sm bg-violet-500/10 text-violet-400 rounded-lg hover:bg-violet-500/20 transition-colors"
        >
          {expandedGroups.length === Object.keys(filteredGroups).length
            ? 'Collapse All'
            : 'Expand All'}
        </button>
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
            />
          );
        })}
      </div>
    </div>
  );
};

export default KPIGroupedList;