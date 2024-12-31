import React from 'react';
import { CheckCircle2, Clock, AlertTriangle } from 'lucide-react';
import { AuditItem } from '../../types/airtable';

interface ActionItemProps {
  item: AuditItem;
  problemName: string;
  subProblemName: string;
  priority: string;
  onStatusChange: (itemId: string, newStatus: string) => void;
}

const ActionItem: React.FC<ActionItemProps> = ({
  item,
  problemName,
  subProblemName,
  priority,
  onStatusChange,
}) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High':
        return 'border-red-500';
      case 'Medium':
        return 'border-yellow-500';
      case 'Low':
        return 'border-green-500';
      default:
        return 'border-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Completed':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'In Progress':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      default:
        return <AlertTriangle className="h-5 w-5 text-gray-400" />;
    }
  };

  return (
    <div 
      className={`border-l-4 pl-4 py-2 bg-card-bg rounded-lg mb-4 ${getPriorityColor(priority)}`}
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-medium text-text">{item.Item_Name}</h3>
          <div className="text-sm text-text-secondary mt-1">
            <p>{problemName} → {subProblemName}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <select
            value={item.Status}
            onChange={(e) => onStatusChange(item.Item_ID, e.target.value)}
            className="text-sm border rounded-md px-2 py-1 bg-background text-text border-border"
          >
            <option value="Not Started">Not Started</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>
          {getStatusIcon(item.Status)}
        </div>
      </div>
      
      <div className="mt-2 text-sm">
        <p className="text-text-secondary">{item.Action_Required}</p>
        {item.Playbook_Link && (
          <a 
            href={item.Playbook_Link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:text-primary-hover mt-2 inline-block"
          >
            View Playbook →
          </a>
        )}
      </div>
    </div>
  );
};

export default ActionItem;