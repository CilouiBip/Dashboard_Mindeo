import React from 'react';
import { useAirtableData } from '../../hooks/useAirtableData';
import { useScoreStore } from '../../store/scoreStore';
import ActionItem from './ActionItem';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';
import { ClipboardList } from 'lucide-react';
import { updateAuditItemStatus } from '../../api/airtable';

const ActionPlan = () => {
  const { isLoading, error } = useAirtableData();
  const { auditItems, problems, subProblems } = useScoreStore();

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error as Error} />;

  const prioritizedItems = auditItems
    .map(item => {
      const subProblem = subProblems.find(sp => 
        sp.Audit_Items?.includes(item.Item_ID)
      );
      const problem = problems.find(p => 
        subProblem && p.Sub_Problems?.includes(subProblem.SubProblem_ID)
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
      return (priorityOrder[a.priority as keyof typeof priorityOrder] || 2) - 
             (priorityOrder[b.priority as keyof typeof priorityOrder] || 2);
    });

  const handleStatusChange = async (itemId: string, newStatus: string) => {
    try {
      await updateAuditItemStatus(itemId, newStatus as any);
      // The data will be automatically refreshed by react-query
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center space-x-3 mb-8">
          <ClipboardList className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold text-text">Plan d'action</h1>
        </div>
        
        <div className="space-y-6">
          {prioritizedItems.map((item) => (
            <ActionItem
              key={item.Item_ID}
              item={item}
              problemName={item.problemName}
              subProblemName={item.subProblemName}
              priority={item.priority}
              onStatusChange={handleStatusChange}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ActionPlan;