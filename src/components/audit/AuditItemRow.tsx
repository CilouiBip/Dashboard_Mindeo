import React from 'react';
import { AuditItem } from '../../types/audit';

interface AuditItemRowProps {
  item: AuditItem;
}

const AuditItemRow: React.FC<AuditItemRowProps> = ({ item }) => {
  return (
    <div className="bg-[#2D2E3A] rounded-lg p-3">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h6 className="text-white text-sm">{item.Item_Name}</h6>
          <p className="text-gray-400 text-sm mt-1">{item.Action_Required}</p>
          {item.Playbook_Link && (
            <a
              href={item.Playbook_Link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-violet-400 hover:text-violet-300 text-sm mt-2 inline-block"
            >
              View Playbook →
            </a>
          )}
        </div>
        <div className="flex flex-col items-end space-y-2">
          <span className={`px-2 py-1 text-xs rounded-full ${
            item.Status === 'Completed' 
              ? 'bg-green-500/10 text-green-400'
              : item.Status === 'In Progress'
              ? 'bg-yellow-500/10 text-yellow-400'
              : 'bg-gray-500/10 text-gray-400'
          }`}>
            {item.Status}
          </span>
          <span className={`px-2 py-1 text-xs rounded-full ${
            item.Criticality === 'High'
              ? 'bg-red-500/10 text-red-400'
              : item.Criticality === 'Medium'
              ? 'bg-yellow-500/10 text-yellow-400'
              : 'bg-green-500/10 text-green-400'
          }`}>
            {item.Criticality}
          </span>
          {item.Score !== undefined && (
            <span className="text-sm text-blue-400">
              Score: {item.Score}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuditItemRow;