import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../api/airtable';
import FunctionCard from './FunctionCard';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';

const FunctionGrid = () => {
  const { data: scores, isLoading, error } = useQuery({
    queryKey: ['functionScores'],
    queryFn: api.fetchFunctionScores
  });

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error as Error} />;
  if (!scores) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {scores.map((score) => (
        <FunctionCard key={score.Name} data={score} />
      ))}
    </div>
  );
};

export default FunctionGrid;