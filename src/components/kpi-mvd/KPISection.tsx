import React, { useState } from 'react';
import { KPI } from '../../types/airtable';
import KPICard from './KPICard';
import { ChevronDown } from 'lucide-react';

interface KPISectionProps {
  kpis: KPI[];
  onUpdate: (id: string, value: number) => Promise<void>;
}

const KPISection: React.FC<KPISectionProps> = ({ kpis, onUpdate }) => {
  const [expandedFunction, setExpandedFunction] = useState<string | null>(null);
  const [expandSecondary, setExpandSecondary] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // Group KPIs by function and calculate scores
  const functionSections = [
    { name: 'Product', score: 7.3, count: '12 KPIs', icon: '💻', isPrimary: true },
    { name: 'Content', score: 4.7, count: '6 KPIs', icon: '📸', isPrimary: true },
    { name: 'Executive', score: 7.4, count: '3 KPIs', icon: '👥', isPrimary: true },
    { name: 'Finance', score: 5.3, count: '7 KPIs', icon: '📊', isPrimary: true },
    { name: 'Marketing', score: 4.7, count: '12 KPIs', icon: '⏱️', isPrimary: false },
    { name: 'Sales', score: 8.6, count: '7 KPIs', icon: '🛒', isPrimary: false }
  ];

  const handleFunctionClick = (functionName: string) => {
    setExpandedFunction(expandedFunction === functionName ? null : functionName);
  };

  const getScoreColor = (score: number) => {
    if (score >= 7) return 'text-green-400';
    if (score >= 5) return 'text-yellow-400';
    return 'text-red-400';
  };

  const renderFunctionSection = (section: typeof functionSections[0]) => (
    <div key={section.name} className="rounded-lg overflow-hidden">
      <button
        onClick={() => handleFunctionClick(section.name)}
        className="w-full p-4 bg-[#1C1C1C] hover:bg-[#2D2D2D] transition-colors flex items-center justify-between"
      >
        <div className="flex items-center space-x-3">
          <span className="text-xl">{section.icon}</span>
          <span className="text-white font-medium">{section.name}</span>
          <span className={`text-lg font-medium ${getScoreColor(section.score)}`}>
            {section.score}
          </span>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-400">{section.count}</span>
          <ChevronDown 
            className={`h-5 w-5 text-gray-400 transition-transform ${
              expandedFunction === section.name ? 'transform rotate-180' : ''
            }`}
          />
        </div>
      </button>

      {expandedFunction === section.name && (
        <div className="p-4 bg-[#1C1C1C] border-t border-[#2D2D2D]">
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {kpis
              .filter(kpi => kpi.Fonction === section.name)
              .map(kpi => (
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

  const primarySections = functionSections.filter(section => section.isPrimary);
  const secondarySections = functionSections.filter(section => !section.isPrimary);

  return (
    <div className="space-y-4 p-6">
      {/* Search Bar */}
      <div className="relative mb-6">
        <input
          type="text"
          placeholder="Search KPIs or functions..."
          className="w-full px-4 py-2 bg-[#1C1C1C] border border-[#2D2D2D] rounded-lg text-gray-300 focus:outline-none focus:border-violet-500"
        />
      </div>

      {/* Primary Function Sections */}
      <div className="space-y-2">
        {primarySections.map(renderFunctionSection)}
      </div>

      {/* Secondary Function Sections */}
      <div className="mt-8">
        <button
          onClick={() => setExpandSecondary(!expandSecondary)}
          className="w-full flex items-center justify-between p-4 bg-[#1C1C1C] rounded-lg hover:bg-[#2D2D2D] transition-colors"
        >
          <span className="text-white font-medium">Secondary Functions</span>
          <ChevronDown 
            className={`h-5 w-5 text-gray-400 transition-transform ${
              expandSecondary ? 'transform rotate-180' : ''
            }`}
          />
        </button>
        
        {expandSecondary && (
          <div className="mt-2 space-y-2">
            {secondarySections.map(renderFunctionSection)}
          </div>
        )}
      </div>
    </div>
  );
};

export default KPISection;
