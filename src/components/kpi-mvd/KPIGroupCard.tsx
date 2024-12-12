import React from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { KPI } from '../../types/airtable';
import KPIUpdateRow from './KPIUpdateRow';
import { getScoreColor } from '../../utils/calculations';
import { formatNumber } from '../../utils/format';

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
  const sortedKPIs = [...kpis].sort((a, b) => {
    if (a.Type === b.Type) {
      return a.Nom_KPI.localeCompare(b.Nom_KPI);
    }
    return a.Type === 'Principal' ? -1 : 1;
  });

  const principalKPIs = sortedKPIs.filter(kpi => kpi.Type === 'Principal');
  const secondaryKPIs = sortedKPIs.filter(kpi => kpi.Type === 'Secondaire');

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
        </div>
        {isExpanded ? (
          <ChevronUp className="h-5 w-5 text-gray-400" />
        ) : (
          <ChevronDown className="h-5 w-5 text-gray-400" />
        )}
      </button>

      {isExpanded && (
        <div className="px-6 pb-4 animate-slideDown">
          {principalKPIs.length > 0 && (
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-400 mb-2">KPIs Principaux</h3>
              <div className="bg-[#1A1B21] rounded-lg overflow-hidden">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-[#2D2E3A]">
                      <th className="px-4 py-2 text-xs font-medium text-gray-400">Nom KPI</th>
                      <th className="px-4 py-2 text-xs font-medium text-gray-400">Score</th>
                      <th className="px-4 py-2 text-xs font-medium text-gray-400">Valeur Actuelle</th>
                      <th className="px-4 py-2 text-xs font-medium text-gray-400">Nouvelle Valeur</th>
                      <th className="px-4 py-2 text-xs font-medium text-gray-400">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#2D2E3A]">
                    {principalKPIs.map((kpi) => (
                      <KPIUpdateRow
                        key={kpi.ID_KPI}
                        kpi={kpi}
                        onUpdate={onUpdate}
                        isUpdating={isUpdating}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {secondaryKPIs.length > 0 && (
            <div>
              <h3 className="text-sm font-medium text-gray-400 mb-2">KPIs Secondaires</h3>
              <div className="bg-[#1A1B21] rounded-lg overflow-hidden">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-[#2D2E3A]">
                      <th className="px-4 py-2 text-xs font-medium text-gray-400">Nom KPI</th>
                      <th className="px-4 py-2 text-xs font-medium text-gray-400">Score</th>
                      <th className="px-4 py-2 text-xs font-medium text-gray-400">Valeur Actuelle</th>
                      <th className="px-4 py-2 text-xs font-medium text-gray-400">Nouvelle Valeur</th>
                      <th className="px-4 py-2 text-xs font-medium text-gray-400">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#2D2E3A]">
                    {secondaryKPIs.map((kpi) => (
                      <KPIUpdateRow
                        key={kpi.ID_KPI}
                        kpi={kpi}
                        onUpdate={onUpdate}
                        isUpdating={isUpdating}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default KPIGroupCard;