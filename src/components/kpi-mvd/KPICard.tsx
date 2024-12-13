import React, { useState } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { KPI } from '../../types/airtable';
import { formatNumber } from '../../utils/format';
import { getTrendColor } from '../../utils/kpiTrends';

interface KPICardProps {
  kpi: KPI;
  onUpdate: (id: string, value: number) => Promise<void>;
  isUpdating: boolean;
}

const KPICard: React.FC<KPICardProps> = ({ kpi, onUpdate, isUpdating }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [newValue, setNewValue] = useState('');

  const getScoreColor = (score: number) => {
    if (score >= 8) return 'text-green-400';
    if (score >= 5) return 'text-yellow-400';
    return 'text-red-400';
  };

  const handleUpdate = async () => {
    const value = parseFloat(newValue);
    if (isNaN(value)) return;

    try {
      await onUpdate(kpi.ID_KPI, value);
      setIsEditing(false);
      setNewValue('');
    } catch (error) {
      console.error('Failed to update KPI:', error);
    }
  };

  const getProgressWidth = () => {
    const target = 10; // Maximum score
    return `${(kpi.Score_KPI_Final / target) * 100}%`;
  };

  const getProgressColor = () => {
    const score = kpi.Score_KPI_Final;
    if (score >= 8) return 'from-violet-500/20 to-violet-500';
    if (score >= 5) return 'from-yellow-500/20 to-yellow-500';
    return 'from-red-500/20 to-red-500';
  };

  const getValueTrend = () => {
    if (!kpi.Valeur_Precedente) return null;
    const diff = kpi.Valeur_Actuelle - kpi.Valeur_Precedente;
    const percentage = ((kpi.Valeur_Actuelle - kpi.Valeur_Precedente) / kpi.Valeur_Precedente) * 100;
    const isIncrease = diff > 0;
    const trendColor = getTrendColor(kpi.Nom_KPI, isIncrease);
    
    return (
      <div className="flex items-center space-x-1">
        {isIncrease ? (
          <ChevronUp className={`h-4 w-4 ${trendColor}`} />
        ) : diff < 0 ? (
          <ChevronDown className={`h-4 w-4 ${trendColor}`} />
        ) : null}
        <span className={trendColor}>
          {percentage.toFixed(1)}%
        </span>
      </div>
    );
  };

  return (
    <div className={`rounded-lg p-6 bg-[#1C1D24] border border-[#2D2E3A] hover:border-${kpi.Type === 'Principal' ? 'violet' : 'gray'}-500/50 transition-all`}>
      <div className="flex items-start justify-between mb-4">
        <div className="space-y-1">
          <h3 className="text-sm font-normal text-white">{kpi.Nom_KPI}</h3>
          <span className={`inline-block text-xs px-2 py-0.5 rounded-full ${
            kpi.Type === 'Principal' 
              ? 'bg-violet-500/10 text-violet-400'
              : 'bg-gray-500/10 text-gray-400'
          }`}>
            {kpi.Type}
          </span>
        </div>
        <div className="text-right">
          <div className={`text-2xl font-medium ${getScoreColor(kpi.Score_KPI_Final)}`}>
            {formatNumber(kpi.Score_KPI_Final)}
          </div>
          {getValueTrend()}
        </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <div className="h-1.5 bg-[#2D2E3A] rounded-full overflow-hidden">
            <div
              className={`h-full ${
                kpi.Type === 'Principal'
                  ? 'bg-gradient-to-r from-violet-500/20 to-violet-500'
                  : 'bg-gradient-to-r from-gray-500/20 to-gray-400'
              } rounded-full transition-all duration-500`}
              style={{ width: getProgressWidth() }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <span className={`text-xs ${kpi.Type === 'Principal' ? 'text-gray-400' : 'text-gray-500'}`}>
              Valeur Précédente
            </span>
            <p className={`text-sm ${kpi.Type === 'Principal' ? 'text-gray-300' : 'text-gray-400'}`}>
              {kpi.Valeur_Precedente ? formatNumber(kpi.Valeur_Precedente) : '-'}
            </p>
          </div>
          <div>
            <span className={`text-xs ${kpi.Type === 'Principal' ? 'text-gray-400' : 'text-gray-500'}`}>
              Valeur Actuelle
            </span>
            {isEditing ? (
              <input
                type="number"
                value={newValue}
                onChange={(e) => setNewValue(e.target.value)}
                className={`w-full px-3 py-2 rounded-lg transition-all ${
                  kpi.Type === 'Principal'
                    ? 'bg-[#2D2E3A] border-[#3E3F4A] text-white focus:ring-violet-500'
                    : 'bg-[#1E1F26] border-[#2D2E3A] text-gray-400 focus:ring-gray-500'
                } border focus:outline-none focus:ring-2`}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleUpdate();
                  }
                }}
                autoFocus
              />
            ) : (
              <p className={`text-sm ${kpi.Type === 'Principal' ? 'text-gray-300' : 'text-gray-400'}`}>
                {formatNumber(kpi.Valeur_Actuelle)}
              </p>
            )}
          </div>
        </div>

        <button
          onClick={() => {
            if (isEditing) {
              handleUpdate();
            } else {
              setIsEditing(true);
              setNewValue(kpi.Valeur_Actuelle.toString());
            }
          }}
          disabled={isUpdating}
          className={`w-full px-4 py-2 rounded-lg transition-all ${
            kpi.Type === 'Principal'
              ? 'bg-violet-500/10 text-violet-400 hover:bg-violet-500/20'
              : 'bg-gray-500/10 text-gray-400 hover:bg-gray-500/20'
          }`}
        >
          {isUpdating ? 'Updating...' : isEditing ? 'Update' : 'Modifier'}
        </button>
      </div>
    </div>
  );
};

export default KPICard;
