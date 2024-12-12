import React, { useState } from 'react';
import { Edit3 } from 'lucide-react';
import { api } from '../../api/airtable';
import { getProgressBarColor, getScoreColor } from '../../utils/colors';
import KPIEditModal from './KPIEditModal';
import Card from '../common/Card';

interface KPICardProps {
  id: string;
  name: string;
  currentValue: number;
  previousValue: number | string;
  score: number;
  type: string;
  onUpdate?: () => void;
}

const KPICard: React.FC<KPICardProps> = ({
  id,
  name,
  currentValue,
  previousValue,
  score,
  type,
  onUpdate
}) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleUpdate = async (newValue: number) => {
    await api.updateKPIValue(id, newValue);
    if (onUpdate) onUpdate();
  };

  return (
    <>
      <Card className="p-6 hover:border-violet-500/50 transition-all group">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium text-white">{name}</h3>
              <span className="text-sm text-gray-400">{type}</span>
            </div>
            <button
              onClick={() => setIsEditing(true)}
              className="p-2 text-gray-400 hover:text-violet-400 hover:bg-violet-500/10 rounded-full transition-colors"
            >
              <Edit3 className="h-4 w-4" />
            </button>
          </div>

          <div className="space-y-4">
            <div className="flex items-end justify-between">
              <span className="text-sm text-gray-400">Score KPI</span>
              <span className={`text-2xl font-bold ${getScoreColor(score)}`}>
                {score.toFixed(1)}
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Progression</span>
                <div className="flex items-center space-x-2">
                  <span className="text-gray-400">{previousValue}</span>
                  <span className="text-white">→</span>
                  <span className="text-white font-medium">{currentValue}</span>
                  <span className={`text-sm ${currentValue > previousValue ? 'text-green-400' : 'text-red-400'}`}>
                    ({((currentValue - Number(previousValue)) / Number(previousValue) * 100).toFixed(1)}%)
                  </span>
                </div>
              </div>
              <div className="h-1.5 bg-[#2D2E3A] rounded-full overflow-hidden">
                <div
                  className={`h-full bg-gradient-to-r ${getProgressBarColor(score)} rounded-full transition-all`}
                  style={{ width: `${Math.min(100, score)}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </Card>

      <KPIEditModal
        isOpen={isEditing}
        onClose={() => setIsEditing(false)}
        currentValue={currentValue}
        previousValue={previousValue}
        onValidate={handleUpdate}
      />
    </>
  );
};

export default KPICard;
