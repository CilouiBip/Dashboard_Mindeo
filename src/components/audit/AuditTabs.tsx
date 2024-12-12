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
      <div className="border-b border-gray-700">
        <nav className="flex space-x-1 px-4" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                px-4 py-2 text-sm font-medium rounded-t-lg
                ${activeTab === tab.id
                  ? 'bg-violet-500 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }
              `}
            >
              {tab.label}
            </button>
          ))}
        </nav>
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
