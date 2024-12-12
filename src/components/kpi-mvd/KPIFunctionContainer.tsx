import React, { useState, useMemo } from 'react';
import { KPI } from '../../types/airtable';
import KPIFunctionGrid from './KPIFunctionGrid';

interface KPIFunctionContainerProps {
  kpis: KPI[];
  onUpdate: (id: string, value: number) => Promise<void>;
}

const KPIFunctionContainer: React.FC<KPIFunctionContainerProps> = ({
  kpis,
  onUpdate,
}) => {
  const [isUpdating, setIsUpdating] = useState(false);

  // Group KPIs by function
  const kpisByFunction = useMemo(() => {
    return kpis.reduce((acc, kpi) => {
      const fonction = kpi.Fonction || 'Other';
      if (!acc[fonction]) {
        acc[fonction] = [];
      }
      acc[fonction].push(kpi);
      return acc;
    }, {} as Record<string, KPI[]>);
  }, [kpis]);

  // Get ordered list of functions
  const functions = useMemo(() => {
    const order = ['Content', 'Marketing', 'Sales', 'Other'];
    return order.filter(f => kpisByFunction[f]?.length > 0);
  }, [kpisByFunction]);

  const handleUpdate = async (id: string, value: number) => {
    setIsUpdating(true);
    try {
      await onUpdate(id, value);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="p-6 bg-[#1E1E1E] rounded-lg">
      <KPIFunctionGrid
        functions={functions}
        kpis={kpisByFunction}
        onUpdate={handleUpdate}
        isUpdating={isUpdating}
      />
    </div>
  );
};

export default KPIFunctionContainer;
