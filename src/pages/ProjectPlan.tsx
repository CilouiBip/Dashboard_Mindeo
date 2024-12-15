import React from 'react';
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
  const { data: projectItems, isLoading, error } = useQuery<ProjectTask[]>({
    queryKey: ['projectItems'],
    queryFn: api.fetchProjectPlanItems,
  });

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error as Error} />;
  if (!projectItems) return null;

  // Calculer les métriques
  const totalTasks = projectItems.length;
  
  // Grouper par fonction
  const tasksByFunction = projectItems.reduce((acc, task) => {
    const functionName = task["Fonction_Name (from Action_ID)"];
    if (functionName) {
      acc[functionName] = (acc[functionName] || 0) + 1;
    }
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="p-6 space-y-8">
      {/* En-tête avec les métriques */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <MetricCard
          title="Total des Actions"
          value={totalTasks}
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
          <PriorityView tasks={projectItems} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProjectPlan;