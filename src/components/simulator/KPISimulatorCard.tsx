import React from 'react';
import { Card } from '../ui/Card';
import { Slider } from '../ui/Slider';
import { KPI } from '../../types/airtable';
import { formatCurrency } from '../../utils/impactCalculations';

interface KPISimulatorCardProps {
  kpi: KPI;
  currentValue: number;
  onValueChange: (value: number) => void;
  impact: {
    revenue: number;
    ebitda: number;
  };
}

const KPISimulatorCard: React.FC<KPISimulatorCardProps> = ({
  kpi,
  currentValue,
  onValueChange,
  impact
}) => {
  // Calculer la variation en pourcentage
  const variation = ((currentValue - kpi.Valeur_Actuelle) / kpi.Valeur_Actuelle) * 100;

  return (
    <Card className="p-4 bg-[#1C1D24] border-[#2D2E3A]">
      <div className="space-y-4">
        <div className="flex justify-between items-start">
          <h3 className="text-lg font-semibold text-gray-200">{kpi.Nom_KPI}</h3>
          <div className="text-right">
            <div className="text-violet-400 text-xl font-semibold">{currentValue.toFixed(1)}</div>
            {variation !== 0 && (
              <div className={`text-sm ${variation >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {variation > 0 ? '+' : ''}{variation.toFixed(1)}%
              </div>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Slider
            value={[currentValue]}
            onValueChange={([value]) => onValueChange(value)}
            min={0}
            max={100}
            step={1}
            className="w-full"
          />
          
          <div className="grid grid-cols-2 gap-2 mt-2">
            <div>
              <p className="text-sm text-gray-400">Revenue Impact</p>
              <p className={`text-sm font-medium ${impact.revenue >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {impact.revenue >= 0 ? '+' : ''}{formatCurrency(impact.revenue)}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-400">EBITDA Impact</p>
              <p className={`text-sm font-medium ${impact.ebitda >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {impact.ebitda >= 0 ? '+' : ''}{formatCurrency(impact.ebitda)}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default KPISimulatorCard;
