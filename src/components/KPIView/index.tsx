import React from 'react';
import { useAirtableData } from '../../hooks/useAirtableData';
import { useScoreStore } from '../../store/scoreStore';
import KPIAlertCard from './KPIAlertCard';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';
import { AlertCircle, CheckCircle } from 'lucide-react';

const KPIView = () => {
  const { isLoading, error } = useAirtableData();
  const { kpis, auditItems } = useScoreStore();
  
  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error as Error} />;

  const alertKPIs = kpis.filter(kpi => kpi.Statut_Global === 'Alerte');

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center space-x-3 mb-8">
        <AlertCircle className="h-8 w-8 text-red-500" />
        <h1 className="text-3xl font-bold text-gray-900">KPIs en alerte</h1>
      </div>

      <div className="max-w-4xl">
        {alertKPIs.length > 0 ? (
          alertKPIs.map(kpi => (
            <KPIAlertCard
              key={kpi.ID_KPI}
              kpi={kpi}
              auditItems={auditItems}
            />
          ))
        ) : (
          <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-green-800">Aucun KPI en alerte</h3>
            <p className="text-green-600 mt-1">Tous les KPIs sont dans les objectifs</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default KPIView;