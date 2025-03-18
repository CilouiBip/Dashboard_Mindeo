import React from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { KPI } from '../../types/airtable';
import KPICard from './KPICard';
import { getScoreColor } from '../../utils/calculations';
import { formatNumber } from '../../utils/format';
import { FunctionIcon } from '../audit/FunctionIcon';

interface KPIGroupCardProps {
  fonction: string;
  functionScore?: number;
  kpis: KPI[];
  isExpanded: boolean;
  onToggle: () => void;
  onUpdate: (id: string, value: number) => Promise<void>;
  isUpdating: boolean;
}

const KPIGroupCard: React.FC<KPIGroupCardProps> = ({
  fonction,
  functionScore,
  kpis,
  isExpanded,
  onToggle,
  onUpdate,
  isUpdating
}) => {
  // DIAGNOSTIC: Vérifier les KPIs reçus dans le composant
  console.log(`[KPIGroupCard] Fonction ${fonction}: ${kpis.length} KPIs reçus`);
  
  // Déboguer spécifiquement le CPL et le CAC
  const cplKpis = kpis.filter(k => k.Nom_KPI.includes('CPL'));
  const cacKpis = kpis.filter(k => k.Nom_KPI.includes('CAC'));
  
  if (cplKpis.length > 0) {
    console.log(`[KPIGroupCard] 🔎 ${fonction} - Détails des KPIs CPL:`, cplKpis.map(k => ({
      id: k.ID_KPI,
      nom: k.Nom_KPI,
      type: k.Type,
      typeClass: typeof k.Type,
      typeEquals: k.Type === 'Principal', // Vérifier si la comparaison fonctionne
      valeur: k.Valeur_Actuelle,
      score: k.Score_KPI_Final
    })));
  }
  
  if (cacKpis.length > 0) {
    console.log(`[KPIGroupCard] 🔎 ${fonction} - Détails des KPIs CAC:`, cacKpis.map(k => ({
      id: k.ID_KPI,
      nom: k.Nom_KPI,
      type: k.Type,
      typeClass: typeof k.Type,
      typeEquals: k.Type === 'Principal', // Vérifier si la comparaison fonctionne
      valeur: k.Valeur_Actuelle,
      score: k.Score_KPI_Final
    })));
  }
  
  if (kpis.length > 0) {
    console.log(`[KPIGroupCard] ${fonction} - Premier KPI:`, {
      id: kpis[0].ID_KPI,
      nom: kpis[0].Nom_KPI,
      type: kpis[0].Type,
      score: kpis[0].Score_KPI_Final
    });
  }
  
  // Déboguer le filtrage par type
  console.log(`[KPIGroupCard] ${fonction} - Types de KPIs distincts:`, [...new Set(kpis.map(k => k.Type))]);
  console.log(`[KPIGroupCard] ${fonction} - Types de KPIs par ID:`, kpis.map(k => ({ id: k.ID_KPI, nom: k.Nom_KPI, type: k.Type })));
  
  const principalKPIs = kpis.filter(kpi => kpi.Type === 'Principal');
  const secondaryKPIs = kpis.filter(kpi => kpi.Type === 'Secondaire');
  
  console.log(`[KPIGroupCard] ${fonction} - KPIs principaux: ${principalKPIs.length}, KPIs secondaires: ${secondaryKPIs.length}`);

  return (
    <div className="bg-[#1A1B21] border border-[#2D2E3A] rounded-lg overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full px-6 py-4 flex items-center justify-between hover:bg-[#2D2E3A]/50 transition-colors"
      >
        <div className="flex items-center space-x-4">
          <FunctionIcon name={fonction} className="h-5 w-5 text-violet-400" />
          <h2 className="text-lg font-medium text-white">{fonction}</h2>
          {functionScore !== undefined && (
            <span className={`text-lg font-medium ${getScoreColor(functionScore)}`}>
              {formatNumber(functionScore)}
            </span>
          )}
          <span className="px-2 py-1 text-sm rounded-full bg-violet-500/10 text-violet-400">
            {kpis.length} KPI{kpis.length > 1 ? 's' : ''}
          </span>
        </div>
        {isExpanded ? (
          <ChevronUp className="h-5 w-5 text-gray-400" />
        ) : (
          <ChevronDown className="h-5 w-5 text-gray-400" />
        )}
      </button>

      {isExpanded && (
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[...principalKPIs, ...secondaryKPIs].map(kpi => (
              <KPICard
                key={kpi.ID_KPI}
                kpi={kpi}
                onUpdate={onUpdate}
                isUpdating={isUpdating}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default KPIGroupCard;