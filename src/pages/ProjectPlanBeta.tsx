import React, { useMemo, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { StatusSelect } from '../components/project/StatusSelect';
import { fetchActions, updateActionStatus } from '../api/actionsBeta';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { Card } from '../components/ui/card';
import { ActionStatus } from '../types/project';
import { TimeEntryModal } from '../components/project/TimeEntryModal';

interface MetricCardProps {
  title: string;
  value: string | number;
  description: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, description }) => (
  <Card className="p-4 bg-[#141517] border-[#2D2E3A]">
    <h3 className="text-sm font-medium text-gray-400">{title}</h3>
    <p className="text-2xl font-bold text-white mt-1">{value}</p>
    <p className="text-sm text-gray-500 mt-1">{description}</p>
  </Card>
);

export default function ProjectPlanBeta() {
  const queryClient = useQueryClient();
  const [timeModalState, setTimeModalState] = useState<{
    isOpen: boolean;
    type: 'estimate' | 'actual';
    actionId: string;
    actionName: string;
    newStatus: string;
    initialValue: number;
  } | null>(null);

  const { data: actions, isLoading } = useQuery({
    queryKey: ['actions'],
    queryFn: fetchActions
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status, estimatedHours, actualHours }: { 
      id: string;
      status: string;
      estimatedHours?: number;
      actualHours?: number;
    }) => updateActionStatus(id, status, estimatedHours, actualHours),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['actions'] });
    }
  });

  const handleStatusChange = (id: string, status: string) => {
    const action = actions?.find(a => a.id === id);
    if (!action) return;

    if (status === ActionStatus.COMPLETED) {
      // When marking as completed, ask for actual hours
      setTimeModalState({
        isOpen: true,
        type: 'actual',
        actionId: id,
        actionName: action.action,
        newStatus: status,
        initialValue: action.actualHours
      });
    } else if (status === ActionStatus.IN_PROGRESS && !action.estimatedHours) {
      // When starting work and no estimate exists, ask for estimated hours
      setTimeModalState({
        isOpen: true,
        type: 'estimate',
        actionId: id,
        actionName: action.action,
        newStatus: status,
        initialValue: 0
      });
    } else {
      // For other status changes, just update the status
      updateStatusMutation.mutate({ id, status });
    }
  };

  const handleTimeSubmit = (hours: number) => {
    if (!timeModalState) return;

    const { actionId, newStatus, type } = timeModalState;
    updateStatusMutation.mutate({
      id: actionId,
      status: newStatus,
      ...(type === 'estimate' ? { estimatedHours: hours } : { actualHours: hours })
    });

    setTimeModalState(null);
  };

  const metrics = useMemo(() => {
    if (!actions?.length) return null;

    const totalActions = actions.length;
    const completedActions = actions.filter(a => a.status === ActionStatus.COMPLETED).length;
    const completionRate = ((completedActions / totalActions) * 100).toFixed(1);

    const estimatedHours = actions.reduce((sum, action) => sum + (action.estimatedHours || 0), 0);
    const actualHours = actions.reduce((sum, action) => sum + (action.actualHours || 0), 0);
    const variance = actualHours - estimatedHours;

    return {
      completionRate,
      totalActions,
      completedActions,
      estimatedHours,
      actualHours,
      variance
    };
  }, [actions]);

  if (isLoading) return <LoadingSpinner />;
  if (!actions || !metrics) return null;

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-2xl font-bold text-white">Project Plan (Beta)</h1>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <MetricCard 
          title="Taux de Complétion"
          value={`${metrics.completionRate}%`}
          description={`${metrics.completedActions} actions sur ${metrics.totalActions}`}
        />
        <MetricCard 
          title="Heures Estimées"
          value={metrics.estimatedHours}
          description="Total des heures estimées"
        />
        <MetricCard 
          title="Heures Réelles"
          value={metrics.actualHours}
          description={`Variance: ${metrics.variance > 0 ? '+' : ''}${metrics.variance}`}
        />
      </div>
      
      <div className="bg-[#141517] rounded-lg border border-[#2D2E3A] overflow-hidden">
        <table className="w-full">
          <thead className="bg-[#1A1B1E]">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">ACTION</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">FONCTION</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">STATUS</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">SEMAINE</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">HEURES EST.</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">HEURES ACT.</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#2D2E3A]">
            {actions.map((action) => (
              <tr key={action.id} className="hover:bg-[#1A1B1E]">
                <td className="px-4 py-3 text-sm text-white">{action.action}</td>
                <td className="px-4 py-3 text-sm text-gray-400">{action.functionName}</td>
                <td className="px-4 py-3">
                  <StatusSelect 
                    actionId={action.id}
                    currentStatus={action.status}
                    onStatusChange={handleStatusChange}
                  />
                </td>
                <td className="px-4 py-3 text-sm text-gray-400">{action.week}</td>
                <td className="px-4 py-3 text-sm text-gray-400">{action.estimatedHours}</td>
                <td className="px-4 py-3 text-sm text-gray-400">{action.actualHours}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {timeModalState && (
        <TimeEntryModal
          isOpen={timeModalState.isOpen}
          onClose={() => setTimeModalState(null)}
          onSubmit={handleTimeSubmit}
          type={timeModalState.type}
          initialValue={timeModalState.initialValue}
          actionName={timeModalState.actionName}
        />
      )}
    </div>
  );
}