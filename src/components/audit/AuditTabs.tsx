import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { useQuery } from '@tanstack/react-query';
import { api } from '../../api/airtable';
import NewAuditView from './NewAuditView';
import ScorecardView from './ScorecardView';
import LoadingSpinner from '../common/LoadingSpinner';
import ErrorMessage from '../common/ErrorMessage';

export default function AuditTabs() {
  const { data: auditItems, isLoading, error } = useQuery({
    queryKey: ['auditItems'],
    queryFn: api.fetchAuditItems,
  });

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error as Error} />;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4 text-white">Audit</h1>
      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="details">Détails</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <NewAuditView auditItems={auditItems || []} />
        </TabsContent>
        <TabsContent value="details">
          <NewAuditView auditItems={auditItems || []} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
