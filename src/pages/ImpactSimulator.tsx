import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Search, Info } from 'lucide-react';
import KPISimulatorCard from '../components/simulator/KPISimulatorCard';
import FunctionHeader from '../components/simulator/FunctionHeader';
import { formatCurrency } from '../utils/impactCalculations';
import { useImpactSimulator } from '../hooks/useImpactSimulator';
import { Select } from '../components/ui/Select';
import { Tooltip as UITooltip } from '../components/ui/Tooltip';

const ImpactSimulator = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFunction, setSelectedFunction] = useState<string>();
  const [kpiValues, setKpiValues] = useState<Record<string, number>>({});
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});

  const {
    kpis,
    groupedKPIs,
    totalImpact,
    availableFunctions,
    isLoading,
    error,
    updateKPI,
    isUpdating
  } = useImpactSimulator(
    {
      searchQuery,
      function: selectedFunction,
      includeOutputKPIs: false
    },
    kpiValues
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-violet-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 p-4">
        Error: {error instanceof Error ? error.message : 'Failed to load KPIs'}
      </div>
    );
  }

  const handleKPIValueChange = async (kpiId: string, newValue: number) => {
    setKpiValues(prev => ({ ...prev, [kpiId]: newValue }));
  };

  const handleUpdateKPI = async (kpiId: string, newValue: number) => {
    const kpi = kpis.find(k => k.ID_KPI === kpiId);
    if (kpi) {
      updateKPI({ ...kpi, Valeur_Actuelle: newValue });
    }
  };

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-white">Impact Simulator</h1>
        <UITooltip content="The Impact Simulator helps you understand how changes in KPIs affect revenue and EBITDA. Values are calculated using linear or exponential models based on each KPI's configuration.">
          <Info className="w-5 h-5 text-gray-400 hover:text-violet-400 cursor-help" />
        </UITooltip>
      </div>

      <div className="flex gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search KPIs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#1C1D24] border border-[#2D2E3A] rounded-lg text-white focus:outline-none focus:border-violet-500"
          />
        </div>
        <Select
          value={selectedFunction}
          onValueChange={setSelectedFunction}
          placeholder="Filter by function"
          options={availableFunctions.map(f => ({ label: f, value: f }))}
          className="w-64"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6 bg-[#1C1D24]">
          <h2 className="text-xl font-semibold text-white mb-4">Total Impact</h2>
          <div className="space-y-4">
            <div>
              <p className="text-gray-400">Revenue Impact</p>
              <p className="text-2xl font-bold text-white">
                {formatCurrency(totalImpact.revenue)}
              </p>
            </div>
            <div>
              <p className="text-gray-400">EBITDA Impact</p>
              <p className="text-2xl font-bold text-white">
                {formatCurrency(totalImpact.ebitda)}
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-[#1C1D24]">
          <h2 className="text-xl font-semibold text-white mb-4">Impact Over Time</h2>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart
              data={[
                { name: 'Current', revenue: 0, ebitda: 0 },
                { name: 'Projected', revenue: totalImpact.revenue, ebitda: totalImpact.ebitda }
              ]}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#2D2E3A" />
              <XAxis dataKey="name" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip
                contentStyle={{ backgroundColor: '#1C1D24', border: '1px solid #2D2E3A' }}
                labelStyle={{ color: '#9CA3AF' }}
              />
              <Legend />
              <Line type="monotone" dataKey="revenue" stroke="#8B5CF6" name="Revenue Impact" />
              <Line type="monotone" dataKey="ebitda" stroke="#EC4899" name="EBITDA Impact" />
            </LineChart>
          </ResponsiveContainer>
        </Card>
      </div>

      <div className="space-y-6">
        {Object.entries(groupedKPIs).map(([func, kpis]) => (
          <div key={func}>
            <FunctionHeader
              title={func}
              expanded={expandedSections[func]}
              onToggle={() => toggleSection(func)}
            />
            {expandedSections[func] && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                {kpis.map((kpi) => (
                  <KPISimulatorCard
                    key={kpi.ID_KPI}
                    kpi={kpi}
                    currentValue={kpiValues[kpi.ID_KPI] ?? kpi.Valeur_Actuelle}
                    impact={kpi.currentImpact}
                    onValueChange={(value) => handleKPIValueChange(kpi.ID_KPI, value)}
                    onUpdate={(value) => handleUpdateKPI(kpi.ID_KPI, value)}
                    isUpdating={isUpdating}
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
