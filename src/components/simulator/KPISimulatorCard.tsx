import React from 'react';
import { Card } from '../ui/card';
import { Slider } from '../ui/Slider';
import { Button } from '../ui/Button';
import { KPI } from '../../schemas/airtable';
import { formatCurrency } from '../../utils/impactCalculations';

interface KPISimulatorCardProps {
  kpi: KPI & { currentImpact: { revenue: number; ebitda: number } };
  currentValue: number;
  onValueChange: (value: number) => void;
  onUpdate: (value: number) => void;
  isUpdating?: boolean;
}

const KPISimulatorCard: React.FC<KPISimulatorCardProps> = ({
  kpi,
  currentValue,
  onValueChange,
  onUpdate,
  isUpdating = false
}) => {
  // Calculate percentage change
  const variation = ((currentValue - kpi.Valeur_Actuelle) / kpi.Valeur_Actuelle) * 100;
  const hasChanges = currentValue !== kpi.Valeur_Actuelle;

  // Get functions as a formatted string
  const functionsDisplay = kpi.Fonctions?.split(',')
    .map(f => f.trim())
    .filter(Boolean)
    .join(', ') || 'N/A';

  return (
    <Card className="p-4 bg-[#1C1D24]">
      <div className="space-y-4">
        {/* KPI Title and Current Value */}
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold text-white">{kpi.Nom_KPI}</h3>
            <p className="text-sm text-gray-400">{functionsDisplay}</p>
          </div>
          <div className="text-right">
            <div className="text-violet-400 text-xl font-semibold">
              {currentValue.toFixed(1)}
              {kpi.Unite ? ` ${kpi.Unite}` : ''}
            </div>
            {variation !== 0 && (
              <div className={`text-sm ${variation >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {variation > 0 ? '+' : ''}{variation.toFixed(1)}%
              </div>
            )}
          </div>
        </div>

        {/* Description if available */}
        {kpi.Description && (
          <p className="text-sm text-gray-400">{kpi.Description}</p>
        )}

        {/* Slider */}
        <Slider
          value={[currentValue]}
          onValueChange={([value]) => onValueChange(value)}
          min={0}
          max={Math.max(kpi.Valeur_Actuelle * 2, currentValue)}
          step={1}
          className="w-full"
        />

        {/* Impact Values */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-400">Revenue Impact</p>
            <p className={`font-semibold ${kpi.currentImpact.revenue >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {formatCurrency(kpi.currentImpact.revenue)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-400">EBITDA Impact</p>
            <p className={`font-semibold ${kpi.currentImpact.ebitda >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {formatCurrency(kpi.currentImpact.ebitda)}
            </p>
          </div>
        </div>

        {/* Update Button */}
        {hasChanges && (
          <Button
            onClick={() => onUpdate(currentValue)}
            disabled={isUpdating}
            className="w-full"
            variant={isUpdating ? 'outline' : 'default'}
          >
            {isUpdating ? 'Updating...' : 'Update Value'}
          </Button>
        )}
      </div>
    </Card>
  );
};

export default KPISimulatorCard;
