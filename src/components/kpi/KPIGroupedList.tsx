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
  showPreviousValue?: boolean;
  onKPIUpdate?: (kpiId: string, newValue: number) => void;
}

const KPIGroupedList: React.FC<KPIGroupedListProps> = ({ 
  initialFunction, 
  kpis,
  showPreviousValue = false,
  onKPIUpdate
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedGroups, setExpandedGroups] = useState<string[]>([]);
  const debouncedSearch = useDebounce(searchTerm, 300);

  const { data: functionScores, isLoading, error } = useQuery({
    queryKey: ['functionScores'],
    queryFn: api.fetchFunctionScores
  });

  // Add console log to debug function scores
  console.log('Function Scores:', functionScores);

  // Convert function scores array to a map for easier lookup
  const functionScoresMap = functionScores?.reduce((acc, score) => {
    console.log('Processing score:', score); // Debug log
    acc[score.Name] = score.Score_Final_Fonction;
    return acc;
  }, {} as Record<string, number>) || {};

  console.log('Function Scores Map:', functionScoresMap); // Debug log

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

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher un KPI..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#1A1B21] border border-[#2D2E3A] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      <div className="space-y-4">
        {Object.entries(filteredGroups).map(([fonction, kpis]) => (
          <KPIGroupCard
            key={fonction}
            fonction={fonction}
            functionScore={functionScoresMap[fonction]}
            kpis={kpis}
            isExpanded={expandedGroups.includes(fonction)}
            onToggle={() => toggleGroup(fonction)}
            showPreviousValue={showPreviousValue}
            onKPIUpdate={onKPIUpdate}
          />
        ))}
      </div>
    </div>
  );
};

export default KPIGroupedList;