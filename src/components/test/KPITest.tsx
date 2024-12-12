import React, { useState, useEffect } from 'react';
import { api } from '../../api/airtable';
import { KPI } from '../../types/airtable';

const KPITest: React.FC = () => {
  const [kpis, setKpis] = useState<KPI[]>([]);
  const [selectedKPI, setSelectedKPI] = useState<string>('');
  const [newValue, setNewValue] = useState<string>('');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    loadKPIs();
  }, []);

  const loadKPIs = async () => {
    try {
      const data = await api.fetchKPIs();
      console.log('Loaded KPIs:', data);
      setKpis(data);
    } catch (err) {
      setError('Error loading KPIs');
      console.error(err);
    }
  };

  const handleUpdate = async () => {
    if (!selectedKPI || !newValue) {
      setError('Please select a KPI and enter a value');
      return;
    }

    try {
      setError('');
      console.log('Updating KPI:', { selectedKPI, newValue });
      await api.updateKPIValue(selectedKPI, Number(newValue));
      await loadKPIs();
      setNewValue('');
    } catch (err) {
      console.error('Update error:', err);
      setError(err instanceof Error ? err.message : 'Error updating KPI');
    }
  };

  return (
    <div style={{ padding: '20px', color: 'white' }}>
      <h2 style={{ marginBottom: '20px' }}>KPI Update Test</h2>
      
      {error && (
        <div style={{ color: 'red', marginBottom: '10px', padding: '10px', background: 'rgba(255,0,0,0.1)', borderRadius: '4px' }}>
          {error}
        </div>
      )}
      
      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', alignItems: 'center' }}>
        <select 
          value={selectedKPI} 
          onChange={(e) => setSelectedKPI(e.target.value)}
          style={{ 
            padding: '8px',
            borderRadius: '4px',
            background: '#2D2E3A',
            color: 'white',
            border: '1px solid #404152',
            minWidth: '300px'
          }}
        >
          <option value="">Select KPI</option>
          {kpis.map((kpi) => (
            <option key={kpi.ID_KPI} value={kpi.ID_KPI}>
              {kpi.Nom_KPI}
            </option>
          ))}
        </select>

        <input
          type="number"
          value={newValue}
          onChange={(e) => setNewValue(e.target.value)}
          placeholder="New Value"
          style={{ 
            padding: '8px',
            borderRadius: '4px',
            background: '#2D2E3A',
            color: 'white',
            border: '1px solid #404152'
          }}
        />

        <button 
          onClick={handleUpdate}
          style={{ 
            padding: '8px 16px',
            borderRadius: '4px',
            background: '#7C3AED',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
            transition: 'background 0.2s',
            ':hover': {
              background: '#6D28D9'
            }
          }}
        >
          Update KPI
        </button>
      </div>

      <div>
        <h3 style={{ marginBottom: '10px' }}>Current KPIs:</h3>
        <div style={{ 
          display: 'grid', 
          gap: '10px',
          maxHeight: '400px',
          overflowY: 'auto',
          padding: '10px',
          background: '#2D2E3A',
          borderRadius: '4px'
        }}>
          {kpis.map((kpi) => (
            <div 
              key={kpi.ID_KPI}
              style={{
                padding: '10px',
                borderRadius: '4px',
                background: '#1F2937',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <span>{kpi.Nom_KPI}</span>
              <div>
                <span style={{ color: '#9CA3AF' }}>Current: </span>
                <span style={{ color: '#10B981' }}>{kpi.Valeur_Actuelle}</span>
                <span style={{ color: '#9CA3AF', marginLeft: '10px' }}>Previous: </span>
                <span style={{ color: '#6B7280' }}>{kpi.Valeur_Precedente}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default KPITest;
