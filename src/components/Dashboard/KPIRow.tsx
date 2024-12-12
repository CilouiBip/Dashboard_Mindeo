import React from 'react';
import { KPI } from '../../types/airtable';
import { getScoreColor } from '../../utils/calculations';
import { formatNumber } from '../../utils/format';
import { AlertCircle, CheckCircle } from 'lucide-react';

interface KPIRowProps {
  kpi: KPI;
}

const KPIRow: React.FC<KPIRowProps> = ({ kpi }) => {
  return (
    <div className="bg-[#1A1B21] rounded-lg p-3 hover:bg-[#1E1F26] transition-colors">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-2">
          {kpi.Statut === 'OK' ? (
            <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
          ) : (
            <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
          )}
          <div>
            <span className="text-white">{kpi.Nom_KPI}</span>
            <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-400">
              {kpi.Type}
            </span>
          </div>
        </div>
        <span className={`font-medium ${getScoreColor(kpi.Score_KPI_Final)}`}>
          {formatNumber(kpi.Score_KPI_Final)}
        </span>
      </div>
      <div className="mt-2 flex justify-between text-sm text-gray-400">
        <span>Valeur actuelle</span>
        <span>{formatNumber(kpi.Valeur_Actuelle)}</span>
      </div>
    </div>
  );
};

export default KPIRow;