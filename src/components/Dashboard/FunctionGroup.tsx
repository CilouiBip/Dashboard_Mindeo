import React from 'react';
import { KPI, BusinessFunction } from '../../types/airtable';
import KPICard from './KPICard';

interface FunctionGroupProps {
  title: BusinessFunction;
  kpis: KPI[];
}

const FunctionGroup: React.FC<FunctionGroupProps> = ({ title, kpis }) => {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-white">{title}</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {kpis.map((kpi) => (
          <KPICard key={kpi.ID_KPI} kpi={kpi} />
        ))}
      </div>
    </div>
  );
};

export default FunctionGroup;