import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { AuditItem } from '../../types/audit';

interface AuditDisplayProps {
  items: Record<string, AuditItem[]>;
}

const AuditDisplay: React.FC<AuditDisplayProps> = ({ items }) => {
  const [expandedSections, setExpandedSections] = useState<string[]>([]);

  const toggleSection = (section: string) => {
    setExpandedSections(prev => 
      prev.includes(section)
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  return (
    <div className="space-y-4">
      {Object.entries(items).map(([functionName, functionItems]) => (
        <div key={functionName} className="bg-[#1C1D24] border border-[#2D2E3A] rounded-lg overflow-hidden">
          <button
            onClick={() => toggleSection(functionName)}
            className="w-full px-6 py-4 flex items-center justify-between hover:bg-[#2D2E3A]/50 transition-colors"
          >
            <h2 className="text-lg font-medium text-white">{functionName}</h2>
            {expandedSections.includes(functionName) ? (
              <ChevronUp className="h-5 w-5 text-gray-400" />
            ) : (
              <ChevronDown className="h-5 w-5 text-gray-400" />
            )}
          </button>

          {expandedSections.includes(functionName) && (
            <div className="px-6 pb-4 space-y-2">
              {functionItems.map((item) => (
                <div
                  key={item.Item_ID}
                  className="bg-[#1A1B21] rounded-lg p-4"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-white font-medium">{item.Item_Name}</h3>
                      <p className="text-gray-400 text-sm mt-1">{item.Action_Required}</p>
                      <div className="flex items-center space-x-2 mt-2">
                        <span className="text-sm text-gray-400">{item.Problems_Name}</span>
                        <span className="text-gray-500">•</span>
                        <span className="text-sm text-gray-400">{item.Categorie_Problems_Name}</span>
                      </div>
                    </div>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      item.Status === 'Completed' 
                        ? 'bg-green-500/10 text-green-400'
                        : item.Status === 'In Progress'
                        ? 'bg-yellow-500/10 text-yellow-400'
                        : 'bg-gray-500/10 text-gray-400'
                    }`}>
                      {item.Status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default AuditDisplay;