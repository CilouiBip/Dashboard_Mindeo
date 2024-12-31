import React, { useState } from 'react';
import { AuditItem } from '../../types/airtable';
import NewAuditView from './NewAuditView';
import ScorecardView from './ScorecardView';

interface AuditTabsProps {
  auditItems: AuditItem[];
  onUpdate: () => Promise<void>;
}

type TabType = 'scorecard' | 'content' | 'marketing' | 'sales';

const AuditTabs: React.FC<AuditTabsProps> = ({ auditItems, onUpdate }) => {
  const [activeTab, setActiveTab] = useState<TabType>('scorecard');

  const tabs: { id: TabType; label: string }[] = [
    { id: 'scorecard', label: 'Scorecard' },
    { id: 'content', label: 'Content' },
    { id: 'marketing', label: 'Marketing' },
    { id: 'sales', label: 'Sales' },
  ];

  const filteredItems = (functionName?: string) => {
    if (!functionName) return auditItems;
    return auditItems.filter(item => item.Fonction_Name === functionName);
  };

  return (
    <div className="h-full flex flex-col">
      <div className="space-x-2 mb-6 px-6 pt-6">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`
              px-4 py-2 
              rounded-lg
              transition-colors
              ${activeTab === tab.id 
                ? 'bg-violet-500/10 text-violet-400' 
                : 'text-gray-400 hover:text-gray-300'
              }
            `}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="flex-1 overflow-auto">
        {activeTab === 'scorecard' && (
          <ScorecardView auditItems={auditItems} />
        )}
        {activeTab === 'content' && (
          <NewAuditView auditItems={filteredItems('Content')} onUpdate={onUpdate} />
        )}
        {activeTab === 'marketing' && (
          <NewAuditView auditItems={filteredItems('Marketing')} onUpdate={onUpdate} />
        )}
        {activeTab === 'sales' && (
          <NewAuditView auditItems={filteredItems('Sales')} onUpdate={onUpdate} />
        )}
      </div>
    </div>
  );
};

export default AuditTabs;
