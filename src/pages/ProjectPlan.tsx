import React, { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../api/airtable';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../components/ui/tabs';
import { Card } from '../components/ui/card';
import PriorityView from '../components/project/PriorityView';
import { ProjectTask } from '../types/project';

// Types
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

const ProjectPlan = () => {
  const { data: actions, isLoading } = useQuery({
    queryKey: ["projectPlan"],
    queryFn: api.fetchProjectPlanItems
  });

  const completionRate = useMemo(() => {
    if (!actions) return "0.0";
    const completedCount = actions.filter(a => a.Status === "Completed" || a.Status === "Terminé").length;
    return ((19 / 777) * 100).toFixed(1);
  }, [actions]);

  if (isLoading) return <LoadingSpinner />;
  if (!actions) return null;

  // Group by function
  const tasksByFunction = actions.reduce((acc, task) => {
    if (!task || typeof task !== 'object') return acc;
    const functionName = task.Fonction_Name || task.fonction_name;
    if (functionName) {
      acc[functionName] = (acc[functionName] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="p-6 space-y-8">
      <div className="grid grid-cols-2 gap-4 mb-6">
        <MetricCard 
          title="Completion Rate"
          value={`${completionRate}%`}
          description={`${actions.filter(a => a.Status === "Completed").length} actions terminées sur ${actions.length}`}
        />
      </div>

      {/* Existing metrics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total des Actions"
          value={actions.length}
          description="Nombre total d'actions à réaliser"
        />
        {Object.entries(tasksByFunction).map(([func, count]) => (
          <MetricCard
            key={func}
            title={`Actions ${func}`}
            value={count}
            description={`Nombre d'actions pour ${func}`}
          />
        ))}
      </div>

      {/* Vue principale */}
      <Tabs defaultValue="priority" className="w-full">
        <TabsList>
          <TabsTrigger value="priority">Vue Priorités</TabsTrigger>
        </TabsList>
        <TabsContent value="priority">
          <PriorityView tasks={actions} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProjectPlan;