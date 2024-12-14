import React from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { KPI } from '../../types/airtable';
import KPICard from './KPICard';
import { getScoreColor } from '../../utils/calculations';
import { formatNumber } from '../../utils/format';
import { FunctionIcon } from '../audit/FunctionIcon';

interface KPIGroupCardProps {
  fonction: string;
  functionScore?: number;
  kpis: KPI[];
  isExpanded: boolean;
  onToggle: () => void;
  onUpdate: (id: string, value: number) => void;
  isUpdating: boolean;
}

const KPIGroupCard: React.FC<KPIGroupCardProps> = ({
  fonction,
  functionScore,
  kpis,
  isExpanded,
  onToggle,
  onUpdate,
  isUpdating
}) => {
  const principalKPIs = kpis.filter(kpi => kpi.Type === 'Principal');
  const secondaryKPIs = kpis.filter(kpi => kpi.Type === 'Secondaire');

  return (
    <div className="bg-[#1A1B21] border border-[#2D2E3A] rounded-lg overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-[#2D2E3A]/50 transition-colors"
      >
        <div className="flex items-center space-x-4">
          <FunctionIcon name={fonction} className="h-5 w-5 text-violet-400" />
          <h2 className="text-lg font-medium text-white">{fonction}</h2>
          {functionScore !== undefined && (
            <span className={`text-lg font-medium ${getScoreColor(functionScore)}`}>
              {formatNumber(functionScore)}
            </span>
          )}
          <span className="px-2 py-1 text-sm rounded-full bg-violet-500/10 text-violet-400">
            {kpis.length} KPI{kpis.length > 1 ? 's' : ''}
          </span>
        </div>
        {isExpanded ? (
          <ChevronUp className="h-5 w-5 text-gray-400" />
        ) : (
          <ChevronDown className="h-5 w-5 text-gray-400" />
        )}
      </button>

      {isExpanded && (
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...principalKPIs, ...secondaryKPIs].map(kpi => (
              <KPICard
                key={kpi.ID_KPI}
                kpi={kpi}
                onUpdate={onUpdate}
                isUpdating={isUpdating}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default KPIGroupCard;