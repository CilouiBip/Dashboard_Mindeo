import React from 'react';
import { ChevronDown } from 'lucide-react';

interface FunctionHeaderProps {
  title: string;
  expanded: boolean;
  onToggle: () => void;
}

const FunctionHeader: React.FC<FunctionHeaderProps> = ({
  title,
  expanded,
  onToggle,
}) => {
  return (
    <button
      onClick={onToggle}
      className="w-full flex items-center justify-between p-4 bg-[#1C1D24] rounded-lg hover:bg-[#2D2E3A] transition-colors"
    >
      <div className="flex items-center space-x-2">
        <h2 className="text-lg font-semibold text-white">{title}</h2>
      </div>
      <ChevronDown
        className={`w-5 h-5 text-gray-400 transition-transform ${
          expanded ? 'transform rotate-180' : ''
        }`}
      />
    </button>
  );
};

export default FunctionHeader;
