import React from 'react';
import { X, AlertCircle, CheckCircle } from 'lucide-react';
import { FunctionScore, KPI } from '../../types/airtable';
import { formatNumber } from '../../utils/format';

interface KPIModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: FunctionScore;
}

const KPIModal: React.FC<KPIModalProps> = ({ isOpen, onClose, data }) => {
  if (!isOpen) return null;

  const getStatusColor = (kpi: KPI) => {
    if (kpi.Statut === 'OK') return 'text-green-500';
    if (kpi.Statut === 'Warning') return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-[#1a1a1a] rounded-lg w-full max-w-3xl max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b border-gray-800 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-white">{data.function}</h2>
            <p className="text-gray-400 text-sm mt-1">
              Score global: {formatNumber(data.score_global)}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-400" />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="space-y-4">
            {data.kpis.map((kpi) => (
              <div
                key={kpi.ID_KPI}
                className="bg-gray-900 border border-gray-800 rounded-lg p-4"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium text-white">{kpi.NOM_KPI}</h3>
                    {kpi.Description && (
                      <p className="text-sm text-gray-400 mt-1">{kpi.Description}</p>
                    )}
                  </div>
                  {kpi.Statut === 'OK' ? (
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                  ) : (
                    <AlertCircle className={`h-5 w-5 flex-shrink-0 ${getStatusColor(kpi)}`} />
                  )}
                </div>
                
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Valeur actuelle</span>
                    <span className="text-white font-medium">
                      {formatNumber(kpi.Valeur_Actuelle)}
                      {kpi.Unite ? ` ${kpi.Unite}` : ''}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Score</span>
                    <span className="text-white font-medium">
                      {formatNumber(kpi.Score_Final)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default KPIModal;