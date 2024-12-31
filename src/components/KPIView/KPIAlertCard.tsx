import React from 'react';
import { AlertCircle, CheckCircle, AlertTriangle } from 'lucide-react';
import { KPI, AuditItem } from '../../types/airtable';

interface KPIAlertCardProps {
  kpi: KPI;
  auditItems: AuditItem[];
}

const KPIAlertCard: React.FC<KPIAlertCardProps> = ({ kpi, auditItems }) => {
  const relatedAuditItems = auditItems.filter(item => 
    kpi.Audit_Items?.includes(item.Item_ID)
  );

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-4">
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center space-x-2">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <h3 className="text-lg font-semibold text-gray-900">{kpi.NOM_KPI}</h3>
          </div>
          <p className="text-sm text-gray-600 mt-1">{kpi.Description}</p>
        </div>
        <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
          {kpi.Statut_Global}
        </span>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>Score actuel: {kpi.Score || 'N/A'}</span>
          <span>Objectif: {kpi.Max}</span>
        </div>

        {relatedAuditItems.length > 0 && (
          <div className="mt-4">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Actions requises:</h4>
            <div className="space-y-2">
              {relatedAuditItems.map((item) => (
                <div 
                  key={item.Item_ID} 
                  className="flex items-start space-x-2 bg-gray-50 p-3 rounded-md"
                >
                  {item.Status === 'Completed' ? (
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                  ) : (
                    <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />
                  )}
                  <div>
                    <p className="text-sm font-medium text-gray-700">{item.Item_Name}</p>
                    <p className="text-sm text-gray-600">{item.Action_Required}</p>
                    {item.Playbook_Link && (
                      <a 
                        href={item.Playbook_Link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-600 hover:text-indigo-800 text-sm mt-1 inline-block"
                      >
                        Voir le playbook →
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default KPIAlertCard;