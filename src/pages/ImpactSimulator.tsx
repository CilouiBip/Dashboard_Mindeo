import React, { useState, useMemo } from 'react';
import { Card } from '../components/ui/Card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
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

  // Group KPIs by function
  const groupedKPIs = useMemo(() => {
    console.log('📊 Grouping KPIs:', filteredKPIs.length, 'KPIs');
    return filteredKPIs.reduce((acc, kpi) => {
      const functions = kpi.Fonctions.split(',').map(f => f.trim());
      functions.forEach(func => {
        if (!acc[func]) acc[func] = [];
        acc[func].push(kpi);
      });
      return acc;
    }, {} as Record<string, KPI[]>);
  }, [filteredKPIs]);

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

  // Chart data
  const chartData = [
    { name: 'Initial', revenue: 0, ebitda: 0 },
    { name: 'Impact', revenue: totalImpact.revenue, ebitda: totalImpact.ebitda }
  ];

  const handleValueChange = (kpiId: string, value: number) => {
    setKpiValues(prev => ({
      ...prev,
      [kpiId]: value
    }));
  };

  const toggleSection = (functionName: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [functionName]: !prev[functionName]
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
    <div className="container mx-auto p-4 space-y-6">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Rechercher un KPI..."
          className="w-full pl-10 pr-4 py-2 rounded-lg bg-[#1C1D24] border border-[#2D2E3A] text-gray-200 focus:outline-none focus:border-violet-500"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Impact Summary */}
      <Card className="p-6 bg-[#1C1D24] border-[#2D2E3A]">
        <h2 className="text-xl font-semibold text-gray-200 mb-4">Impact Total</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <p className="text-gray-400">Impact sur le Revenue</p>
            <p className="text-2xl font-bold text-violet-400">
              {formatCurrency(totalImpact.revenue)}
            </p>
          </div>
          <div>
            <p className="text-gray-400">Impact sur l'EBITDA</p>
            <p className="text-2xl font-bold text-violet-400">
              {formatCurrency(totalImpact.ebitda)}
            </p>
          </div>
        </div>
        
        {/* Impact Chart */}
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2D2E3A" />
              <XAxis dataKey="name" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1C1D24',
                  border: '1px solid #2D2E3A',
                  borderRadius: '0.5rem'
                }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="revenue" 
                stroke="#8B5CF6" 
                name="Revenue" 
                strokeWidth={2}
              />
              <Line 
                type="monotone" 
                dataKey="ebitda" 
                stroke="#EC4899" 
                name="EBITDA" 
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* KPI Sections */}
      <div className="space-y-6">
        {Object.entries(groupedKPIs).map(([functionName, functionKPIs]) => (
          <div key={functionName} className="space-y-4">
            <FunctionHeader
              title={functionName}
              kpiCount={functionKPIs.length}
              isExpanded={expandedSections[functionName]}
              onToggle={() => toggleSection(functionName)}
            />
            
            {expandedSections[functionName] && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {functionKPIs.map((kpi) => (
                  <KPISimulatorCard
                    key={kpi.ID_KPI}
                    kpi={kpi}
                    currentValue={kpiValues[kpi.ID_KPI] ?? kpi.Valeur_Actuelle}
                    onValueChange={(value) => handleValueChange(kpi.ID_KPI, value)}
                    impact={calculateKPIImpact(kpi, kpiValues[kpi.ID_KPI] ?? kpi.Valeur_Actuelle)}
                  />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImpactSimulator;
