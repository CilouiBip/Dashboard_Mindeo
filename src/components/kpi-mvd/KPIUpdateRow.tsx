import React, { useState } from 'react';
import { KPI } from '../../types/airtable';
import { getScoreColor } from '../../utils/calculations';
import { formatNumber } from '../../utils/format';

interface KPIUpdateRowProps {
  kpi: KPI;
  onUpdate: (id: string, value: number) => void;
  isUpdating: boolean;
}

const KPIUpdateRow: React.FC<KPIUpdateRowProps> = ({ kpi, onUpdate, isUpdating }) => {
  const [value, setValue] = useState<string>(kpi.Valeur_Actuelle.toString());
  const [isDirty, setIsDirty] = useState(false);

  const handleValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    setIsDirty(newValue !== kpi.Valeur_Actuelle.toString());
  };

  const handleUpdate = () => {
    const numericValue = parseFloat(value);
    if (!isNaN(numericValue) && isDirty) {
      onUpdate(kpi.ID_KPI, numericValue);
    }
  };

  return (
    <tr className="hover:bg-[#1E1F26]">
      <td className="px-4 py-3">
        <div>
          <span className="text-white">{kpi.Nom_KPI}</span>
        </div>
      </td>
      <td className={`px-4 py-3 ${getScoreColor(kpi.Score_KPI_Final)}`}>
        {formatNumber(kpi.Score_KPI_Final)}
      </td>
      <td className="px-4 py-3 text-gray-400">
        {formatNumber(kpi.Valeur_Actuelle)}
      </td>
      <td className="px-4 py-3">
        <input
          type="number"
          value={value}
          onChange={handleValueChange}
          className="w-32 px-3 py-2 bg-[#2D2E3A] text-white rounded-lg focus:ring-2 focus:ring-violet-500 focus:outline-none"
        />
      </td>
      <td className="px-4 py-3">
        <button
          onClick={handleUpdate}
          disabled={!isDirty || isUpdating}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            isDirty && !isUpdating
              ? 'bg-violet-500 hover:bg-violet-600 text-white'
              : 'bg-[#2D2E3A] text-gray-400 cursor-not-allowed'
          }`}
        >
          {isUpdating ? 'Updating...' : 'Update'}
        </button>
      </td>
    </tr>
  );
};

export default KPIUpdateRow;