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
  showPreviousValue?: boolean;
  onKPIUpdate?: (kpiId: string, newValue: number) => void;
}

const KPIGroupCard: React.FC<KPIGroupCardProps> = ({
  fonction,
  functionScore,
  kpis,
  isExpanded,
  onToggle,
  showPreviousValue = false,
  onKPIUpdate
}) => {
  // Group KPIs by type
  const principalKPIs = kpis.filter(kpi => kpi.Type === 'Principal');
  const secondaryKPIs = kpis.filter(kpi => kpi.Type === 'Secondaire');

  const TableHeaders = () => (
    <div className="flex items-center px-4 py-2 border-b border-[#2D2E3A] text-sm text-gray-400">
      <div className="flex-1">Nom KPI</div>
      <div className="flex-none w-32 text-right">Score</div>
      <div className="flex-none w-40 text-right">Valeur Actuelle</div>
      <div className="flex-none w-40 text-right">Nouvelle Valeur</div>
      <div className="flex-none w-24 text-right">Action</div>
    </div>
  );

  const KPISection = ({ title, kpis }: { title: string; kpis: KPI[] }) => (
    <div>
      <div className="px-4 py-2 bg-[#1C1D24] text-sm font-medium text-gray-400">
        {title}
      </div>
      {kpis.map(kpi => (
        <KPIRow 
          key={kpi.ID_KPI} 
          kpi={kpi} 
          showPreviousValue={showPreviousValue}
          onUpdate={onKPIUpdate}
        />
      ))}
    </div>
  );

  return (
    <div className="bg-[#1A1B21] border border-[#2D2E3A] rounded-lg overflow-hidden">
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
        <div>
          <TableHeaders />
          {principalKPIs.length > 0 && (
            <KPISection title="KPIs Principaux" kpis={principalKPIs} />
          )}
          {secondaryKPIs.length > 0 && (
            <KPISection title="KPIs Secondaires" kpis={secondaryKPIs} />
          )}
        </div>
      )}
    </div>
  );
};

export default KPIGroupCard;