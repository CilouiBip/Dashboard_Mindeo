import React from 'react';
import { KPI } from '../../types/airtable';
import KPIRow from './KPIRow';

interface KPIListProps {
  kpis: KPI[];
}

const KPIList: React.FC<KPIListProps> = ({ kpis }) => {
  // Separate KPIs by type
  const principalKPIs = kpis.filter(kpi => kpi.Type === 'Principal');
  const secondaryKPIs = kpis.filter(kpi => kpi.Type === 'Secondaire');

  return (
    <div className="mt-4 border-t border-[#2D2E3A] pt-4 animate-slideDown">
      {/* Principal KPIs */}
      {principalKPIs.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-gray-400 mb-2">KPIs Principaux</h4>
          <div className="space-y-2">
            {principalKPIs.map(kpi => (
              <KPIRow key={kpi.ID_KPI} kpi={kpi} />
            ))}
          </div>
        </div>
      )}

      {/* Secondary KPIs */}
      {secondaryKPIs.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-400 mb-2">KPIs Secondaires</h4>
          <div className="space-y-2">
            {secondaryKPIs.map(kpi => (
              <KPIRow key={kpi.ID_KPI} kpi={kpi} />
            ))}
          </div>
        </div>
      )}

      {/* Show message if no KPIs */}
      {kpis.length === 0 && (
        <p className="text-gray-400 text-center py-4">Aucun KPI trouvé</p>
      )}
    </div>
  );
};

export default KPIList;