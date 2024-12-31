import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { KPI } from '../../types/airtable';

interface KPICardProps {
  kpi: KPI;
}

const KPICard: React.FC<KPICardProps> = ({ kpi }) => {
  const isPositive = kpi.Statut_Global === 'OK';
  const progress = ((kpi.Score || 0) / (kpi.Max || 100)) * 100;

  return (
    <div className="bg-[#1C1D24] border border-[#2D2E3A] rounded-lg p-4 hover:border-violet-500/50 transition-colors">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-medium text-white">{kpi.NOM_KPI}</h3>
          <p className="text-sm text-gray-400 mt-1">{kpi.Description}</p>
        </div>
        {isPositive ? (
          <TrendingUp className="h-5 w-5 text-green-500" />
        ) : (
          <TrendingDown className="h-5 w-5 text-red-500" />
        )}
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Progress</span>
          <span className="text-white">{progress.toFixed(1)}%</span>
        </div>
        <div className="h-2 bg-[#2D2E3A] rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${
              isPositive ? 'bg-green-500' : 'bg-red-500'
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default KPICard;