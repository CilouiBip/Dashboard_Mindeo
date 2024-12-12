import React from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { KPI } from '../../types/airtable';
import KPIRow from './KPIRow';
import { getScoreColor } from '../../utils/calculations';
import { formatNumber } from '../../utils/format';

interface KPIGroupCardProps {
  fonction: string;
  functionScore?: number;
  kpis: KPI[];
  isExpanded: boolean;
  onToggle: () => void;
}

const KPIGroupCard: React.FC<KPIGroupCardProps> = ({
  fonction,
  functionScore,
  kpis,
  isExpanded,
  onToggle
}) => {
  // Sort KPIs by type then by name
  const sortedKPIs = [...kpis].sort((a, b) => {
    if (a.Type === b.Type) {
      return a.Nom_KPI.localeCompare(b.Nom_KPI);
    }
    return a.Type === 'Principal' ? -1 : 1;
  });

  const alertCount = kpis.filter(kpi => kpi.Statut !== 'OK').length;

  return (
    <div className="bg-[#1C1D24] border border-[#2D2E3A] rounded-lg overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-[#2D2E3A]/50 transition-colors"
      >
        <div className="flex items-center space-x-4">
          <h2 className="text-lg font-medium text-white">{fonction}</h2>
          {functionScore !== undefined && (
            <span className={`text-lg font-medium ${getScoreColor(functionScore)}`}>
              {formatNumber(functionScore)}
            </span>
          )}
          <span className="px-2 py-1 text-sm rounded-full bg-[#2D2E3A] text-gray-400">
            {kpis.length} KPI{kpis.length > 1 ? 's' : ''}
          </span>
          {alertCount > 0 && (
            <span className="px-2 py-1 text-sm rounded-full bg-red-500/10 text-red-400">
              {alertCount} alert{alertCount > 1 ? 's' : ''}
            </span>
          )}
        </div>
        {isExpanded ? (
          <ChevronUp className="h-5 w-5 text-gray-400" />
        ) : (
          <ChevronDown className="h-5 w-5 text-gray-400" />
        )}
      </button>

      {isExpanded && (
        <div className="px-6 pb-4 animate-slideDown">
          <div className="space-y-2 pt-2">
            {sortedKPIs.map(kpi => (
              <KPIRow key={kpi.ID_KPI} kpi={kpi} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default KPIGroupCard;