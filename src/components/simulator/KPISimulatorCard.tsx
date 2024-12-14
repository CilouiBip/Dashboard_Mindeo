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
  // Calculate percentage change
  const variation = ((currentValue - kpi.Valeur_Actuelle) / kpi.Valeur_Actuelle) * 100;

  return (
    <Card className="p-4 bg-[#1C1D24] border-[#2D2E3A]">
      <div className="space-y-4">
        {/* KPI Title and Current Value */}
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

        {/* Slider */}
        <Slider
          value={[currentValue]}
          onValueChange={([value]) => onValueChange(value)}
          min={0}
          max={Math.max(100, currentValue)}
          step={1}
          className="w-full"
        />

        {/* Impact Values */}
        <div className="space-y-3">
          {/* Revenue Impact */}
          <div className="relative">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-400">Revenue Impact</span>
              <span className={`${impact.revenue >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {formatCurrency(impact.revenue)}
              </span>
            </div>
            <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full ${impact.revenue >= 0 ? 'bg-green-400' : 'bg-red-400'}`}
                style={{ 
                  width: `${Math.min(Math.abs(impact.revenue) / 1000000 * 100, 100)}%`,
                  transition: 'width 0.3s ease-in-out'
                }}
              />
            </div>
          </div>

          {/* EBITDA Impact */}
          <div className="relative">
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-400">EBITDA Impact</span>
              <span className={`${impact.ebitda >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {formatCurrency(impact.ebitda)}
              </span>
            </div>
            <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full ${impact.ebitda >= 0 ? 'bg-green-400' : 'bg-red-400'}`}
                style={{ 
                  width: `${Math.min(Math.abs(impact.ebitda) / 1000000 * 100, 100)}%`,
                  transition: 'width 0.3s ease-in-out'
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default KPISimulatorCard;
