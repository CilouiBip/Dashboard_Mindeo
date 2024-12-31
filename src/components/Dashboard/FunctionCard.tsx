import React, { useState } from 'react';
import { TrendingUp, TrendingDown, ChevronDown, ChevronUp } from 'lucide-react';
import { FunctionScore } from '../../types/airtable';
import { getScoreColor } from '../../utils/calculations';
import { formatNumber } from '../../utils/format';
import { useKPIs } from '../../api/queries/useKPIs';
import KPIList from './KPIList';
import LoadingSpinner from '../common/LoadingSpinner';

interface FunctionCardProps {
  data: FunctionScore;
}

const FunctionCard: React.FC<FunctionCardProps> = ({ data }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const score = data.Score_Final_Fonction;

  const { data: kpis, isLoading } = useKPIs(isExpanded ? data.Name : undefined);

  return (
    <div className="bg-[#1C1D24] border border-[#2D2E3A] rounded-lg p-6 hover:border-violet-500/50 transition-all">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full text-left"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <h3 className="text-lg font-medium text-white">{data.Name}</h3>
            {isExpanded ? (
              <ChevronUp className="h-4 w-4 text-gray-400" />
            ) : (
              <ChevronDown className="h-4 w-4 text-gray-400" />
            )}
          </div>
          {score >= 4 ? (
            <TrendingUp className="h-5 w-5 text-green-500" />
          ) : (
            <TrendingDown className="h-5 w-5 text-red-500" />
          )}
        </div>
        
        <div className="space-y-4">
          <div className="flex items-end justify-between">
            <span className="text-sm text-gray-400">Score Global</span>
            <span className={`text-2xl font-bold ${getScoreColor(score)}`}>
              {formatNumber(score)}
            </span>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-400">
              <span>KPIs en alerte</span>
              <span className="text-red-500 font-medium">{data.Nbr_KPIs_Alert}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-400">
              <span>Total KPIs</span>
              <span>{data.Nbr_KPIs}</span>
            </div>
          </div>
        </div>
      </button>

      {isExpanded && (
        <div className="mt-4">
          {isLoading ? (
            <LoadingSpinner />
          ) : kpis && kpis.length > 0 ? (
            <KPIList kpis={kpis} />
          ) : (
            <p className="text-gray-400 text-center py-4">Aucun KPI trouvé</p>
          )}
        </div>
      )}
    </div>
  );
};

export default FunctionCard;