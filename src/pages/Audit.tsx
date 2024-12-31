import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../api/airtable';
import NewAuditView from '../components/audit/NewAuditView';
import LoadingSpinner from '../components/common/LoadingSpinner';
import ErrorMessage from '../components/common/ErrorMessage';

const Audit = () => {
  const { data: auditItems, isLoading, error } = useQuery({
    queryKey: ['auditItems'],
    queryFn: api.fetchAuditItems
  });

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error as Error} />;
  if (!auditItems?.length) return <div>No audit items found</div>;

  return (
    <div className="p-6">
      <NewAuditView auditItems={auditItems} />
    </div>
  );
};

export default Audit;