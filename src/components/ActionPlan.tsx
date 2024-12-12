import React from 'react';
import { useScoreStore } from '../store/scoreStore';
import { CheckCircle2, Clock, AlertTriangle } from 'lucide-react';
import { airtableService } from '../services/airtable';

function ActionPlan() {
  const { auditItems, problems, subProblems } = useScoreStore();

  const prioritizedItems = auditItems
    .map(item => {
      const subProblem = subProblems.find(sp => 
        sp.Audit_Items.includes(item.Item_ID)
      );
      const problem = problems.find(p => 
        p.Sub_Problems.includes(subProblem?.SubProblem_ID || '')
      );
      
      return {
        ...item,
        problemName: problem?.Problem_Name || 'Unknown Problem',
        subProblemName: subProblem?.SubProblem_Name || 'Unknown Sub-problem',
        priority: problem?.Priority || 'Low'
      };
    })
    .sort((a, b) => {
      const priorityOrder = { High: 0, Medium: 1, Low: 2 };
      return priorityOrder[a.priority as keyof typeof priorityOrder] - 
             priorityOrder[b.priority as keyof typeof priorityOrder];
    });

  const handleStatusChange = async (itemId: string, newStatus: string) => {
    try {
      await airtableService.updateAuditItemStatus(itemId, newStatus as any);
      // Refresh data would be handled by react-query's cache invalidation
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-6">Action Plan</h1>
        
        <div className="space-y-6">
          {prioritizedItems.map((item) => (
            <div 
              key={item.Item_ID}
              className="border-l-4 pl-4 py-2"
              style={{
                borderColor: 
                  item.priority === 'High' ? '#EF4444' :
                  item.priority === 'Medium' ? '#F59E0B' :
                  '#10B981'
              }}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">{item.Item_Name}</h3>
                  <div className="text-sm text-gray-500 mt-1">
                    <p>{item.problemName} → {item.subProblemName}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <select
                    value={item.Status}
                    onChange={(e) => handleStatusChange(item.Item_ID, e.target.value)}
                    className="text-sm border rounded-md px-2 py-1"
                  >
                    <option value="Not Started">Not Started</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                  {item.Status === 'Completed' ? (
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                  ) : item.Status === 'In Progress' ? (
                    <Clock className="h-5 w-5 text-yellow-500" />
                  ) : (
                    <AlertTriangle className="h-5 w-5 text-gray-400" />
                  )}
                </div>
              </div>
              
              <div className="mt-2 text-sm">
                <p className="text-gray-600">{item.Action_Required}</p>
                {item.Playbook_Link && (
                  <a 
                    href={item.Playbook_Link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-600 hover:text-indigo-800 mt-2 inline-block"
                  >
                    View Playbook →
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ActionPlan;