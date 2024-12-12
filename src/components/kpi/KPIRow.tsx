import React from 'react';
import { AlertCircle, CheckCircle } from 'lucide-react';
import { KPI } from '../../types/airtable';
import { getScoreColor } from '../../utils/calculations';
import { formatNumber } from '../../utils/format';

interface KPIRowProps {
  kpi: KPI;
  showPreviousValue?: boolean;
  onUpdate?: (kpiId: string, newValue: number) => void;
}

const KPIRow: React.FC<KPIRowProps> = ({ kpi, showPreviousValue = false, onUpdate }) => {
  return (
    <div className="flex items-center px-4 py-3 hover:bg-[#1E1F26] transition-colors text-sm">
      <div className="flex-1">
        <span className="text-white">{kpi.Nom_KPI}</span>
      </div>
      
      <div className="flex-none w-32 text-right">
        <span className={`font-medium ${getScoreColor(kpi.Score_KPI_Final)}`}>
          {formatNumber(kpi.Score_KPI_Final)}
        </span>
      </div>

      <div className="flex-none w-40 text-right text-gray-400">
        {formatNumber(kpi.Valeur_Actuelle)}
      </div>

      <div className="flex-none w-40">
        <input
          type="text"
          className="w-full px-3 py-1 bg-[#2D2E3A] border border-[#3E3F4A] rounded text-white text-right"
          placeholder="Nouvelle valeur"
          defaultValue={kpi.Valeur_Actuelle}
        />
      </div>

      <div className="flex-none w-24 text-right">
        {onUpdate && (
          <button
            onClick={() => {
              const input = (document.activeElement as HTMLInputElement);
              const newValue = input?.value;
              if (newValue) {
                const numValue = parseFloat(newValue);
                if (!isNaN(numValue)) {
                  onUpdate(kpi.ID_KPI, numValue);
                }
              }
            }}
            className="px-4 py-1 bg-[#2D2E3A] hover:bg-[#3E3F4A] text-blue-400 rounded transition-colors"
          >
            Update
          </button>
        )}
      </div>
    </div>
  );
};

export default KPIRow;