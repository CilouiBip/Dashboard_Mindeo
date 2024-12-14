import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../api/airtable';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import ProjectPlanView from '../components/project/ProjectPlanView';

const ProjectPlan = () => {
  const { data: projectItems, isLoading, error } = useQuery({
    queryKey: ['projectPlanItems'],
    queryFn: async () => {
      try {
        console.log('🚀 Starting to fetch project plan items');
        const items = await api.fetchProjectPlanItems();
        console.log('📦 Fetched items:', items);
        return items;
      } catch (err) {
        console.error('❌ Error fetching project plan items:', err);
        throw err;
      }
    }
  });

  if (isLoading) {
    console.log('⌛ Loading project plan items...');
    return <LoadingSpinner />;
  }
  
  if (error) {
    console.error('🔥 Project Plan Error:', error);
    return <ErrorMessage error={error as Error} />;
  }
  
  if (!projectItems?.length) {
    console.log('ℹ️ No project items found');
    return (
      <div className="p-6 text-center">
        <p className="text-gray-400">No action items requiring attention found.</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Project Plan</h1>
        <p className="text-gray-400 mt-2">
          Action items requiring attention (score below 4)
        </p>
      </div>
      <ProjectPlanView items={projectItems} />
    </div>
  );
};

export default ProjectPlan;