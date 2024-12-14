import React from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

interface FunctionHeaderProps {
  name: string;
  count: number;
  isExpanded: boolean;
  onToggle: () => void;
}

const FunctionHeader: React.FC<FunctionHeaderProps> = ({
  name,
  count,
  isExpanded,
  onToggle,
}) => {
  return (
    <button
      onClick={onToggle}
      className="w-full flex items-center justify-between p-4 bg-[#1C1D24] hover:bg-[#2D2E3A] transition-colors rounded-lg"
    >
      <div className="flex items-center space-x-2">
        {isExpanded ? (
          <ChevronDown className="h-5 w-5 text-violet-400" />
        ) : (
          <ChevronRight className="h-5 w-5 text-violet-400" />
        )}
        <span className="font-medium text-gray-200">{name}</span>
        <span className="text-sm text-gray-400">({count} KPIs)</span>
      </div>
    </button>
  );
};

export default FunctionHeader;
