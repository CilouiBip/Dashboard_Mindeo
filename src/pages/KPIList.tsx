import React from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { api } from '../api/airtable';
import { BarChart2 } from 'lucide-react';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';
import KPIGroupedList from '../components/kpi/KPIGroupedList';

const KPIList = () => {
  const [searchParams] = useSearchParams();
  const selectedFunction = searchParams.get('function');

  const { data: kpis, isLoading, error } = useQuery({
    queryKey: ['kpis'],
    queryFn: api.fetchKPIs
  });

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error as Error} />;
  if (!kpis?.length) return (
    <div className="p-6 text-center">
      <p className="text-gray-400">No KPIs found</p>
    </div>
  );

  return (
    <div className="p-6">
      <div className="flex items-center space-x-3 mb-6">
        <BarChart2 className="h-8 w-8 text-violet-500" />
        <h1 className="text-2xl font-bold text-white">KPIs Overview</h1>
      </div>
      <KPIGroupedList kpis={kpis} initialFunction={selectedFunction} />
    </div>
  );
};

export default KPIList;