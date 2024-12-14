import React, { useState, useMemo } from 'react';
import { Card } from '../components/ui/Card';
import { Search } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../api/airtable';
import { KPI } from '../types/airtable';
import KPISimulatorCard from '../components/simulator/KPISimulatorCard';
import FunctionHeader from '../components/simulator/FunctionHeader';
import { calculateKPIImpact, calculateTotalImpact, formatCurrency } from '../utils/impactCalculations';

const ImpactSimulator = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [kpiValues, setKpiValues] = useState<Record<string, number>>({});
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});

  const { data: kpis = [], isLoading, error } = useQuery<KPI[]>({
    queryKey: ['kpisBenchmark'],
    queryFn: api.fetchKPIsBenchmark,
    onSuccess: (data) => {
      console.log('✅ KPIs loaded:', data.length);
      console.log('📊 KPIs data:', data);
    },
    onError: (error) => {
      console.error('❌ Error loading KPIs:', error);
    }
  });

  // Filter out Output KPIs and apply search
  const filteredKPIs = useMemo(() => {
    console.log('🔍 Filtering KPIs from:', kpis.length, 'KPIs');
    // Liste des KPIs pertinents
    const relevantKPIIds = [
      '6',   // CAC
      '10',  // Close Rate/Conversion
      '7',   // ROAS
      '20',  // Call booked
      '17',  // % Remboursement
      '4',   // CAC trend
      '3',   // Croissance des Leads
      '5',   // Views Growth Rate
      '18',  // Fréquence post contenu/semaine
      '21',  // Watch time
      '120',  // Content CTR
    ];

    return kpis
      .filter(kpi => {
        // Exclure les KPIs de type Output
        if (kpi.Type === 'Output') {
          console.log('❌ Excluding Output KPI:', kpi.Nom_KPI);
          return false;
        }
        
        // Inclure uniquement les KPIs pertinents
        if (!relevantKPIIds.includes(kpi.ID_KPI)) {
          console.log('❌ Excluding non-relevant KPI:', kpi.Nom_KPI, kpi.ID_KPI);
          return false;
        }
        
        console.log('✅ Including KPI:', kpi.Nom_KPI, kpi.ID_KPI);
        
        // Appliquer la recherche
        if (searchQuery) {
          return kpi.Nom_KPI.toLowerCase().includes(searchQuery.toLowerCase()) ||
                 kpi.Fonctions.toLowerCase().includes(searchQuery.toLowerCase());
        }
        
        return true;
      });
  }, [kpis, searchQuery]);

  // Calculate impacts
  const impacts = useMemo(() => {
    return filteredKPIs.map(kpi => ({
      kpiId: kpi.ID_KPI,
      impact: calculateKPIImpact(kpi, kpiValues[kpi.ID_KPI] ?? kpi.Valeur_Actuelle)
    }));
  }, [filteredKPIs, kpiValues]);

  const totalImpact = useMemo(() => 
    calculateTotalImpact(impacts.map(i => i.impact)),
    [impacts]
  );

  const handleValueChange = (kpiId: string, value: number) => {
    setKpiValues(prev => ({
      ...prev,
      [kpiId]: value
    }));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-violet-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 p-4">
        Error loading KPIs: {error instanceof Error ? error.message : 'Unknown error'}
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <FunctionHeader />
      
      <div className="grid gap-4 mt-4">
        {/* Search and Filter */}
        <div className="flex gap-4 items-center">
          <input
            type="text"
            placeholder="Search KPIs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-sm"
          />
        </div>

        {/* KPI Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredKPIs.map((kpi) => (
            <KPISimulatorCard
              key={kpi.ID_KPI}
              kpi={kpi}
              value={kpiValues[kpi.ID_KPI] || 0}
              onValueChange={(value) => handleValueChange(kpi.ID_KPI, value)}
            />
          ))}
        </div>

        {/* Impact Evolution Chart */}
        <Card className="p-4 bg-[#1C1D24] border-[#2D2E3A]">
          <h3 className="text-lg font-semibold text-gray-200 mb-2">Impact Evolution</h3>
          <div className="h-[200px] flex items-center justify-center">
            <span className="text-gray-400">Graph coming soon</span>
          </div>
        </Card>

        {/* Total Impact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="p-4 bg-[#1C1D24] border-[#2D2E3A]">
            <h3 className="text-lg font-semibold text-gray-200">Total Revenue Impact</h3>
            <p className="text-2xl font-bold text-violet-400 mt-2">
              {formatCurrency(totalImpact.revenue)}
            </p>
          </Card>
          <Card className="p-4 bg-[#1C1D24] border-[#2D2E3A]">
            <h3 className="text-lg font-semibold text-gray-200">Total EBITDA Impact</h3>
            <p className="text-2xl font-bold text-violet-400 mt-2">
              {formatCurrency(totalImpact.ebitda)}
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ImpactSimulator;
