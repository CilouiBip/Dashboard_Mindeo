import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { queryClient } from './lib/queryClient';
import Header from './components/layout/Header';
import Navigation from './components/layout/Navigation';
import Dashboard from './pages/Dashboard';
import KPIsMVD from './pages/KPIsMVD';
import AuditTabs from './components/audit/AuditTabs';
import ActionsList from './pages/ActionsList';
import ImpactSimulator from './pages/ImpactSimulator';
import ProjectPlan from './pages/ProjectPlan';
import { api } from './api/airtable';
import { AuditItem } from './types/airtable';
import ErrorBoundary from './components/ErrorBoundary';
import { UIConfigProvider } from './contexts/UIConfigContext';
import AdminPage from './pages/Admin';

function App() {
  const [auditItems, setAuditItems] = useState<AuditItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const items = await api.fetchAuditItems();
      setAuditItems(items);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    try {
      const items = await api.fetchAuditItems();
      setAuditItems(items);
    } catch (err) {
      console.error('Failed to refresh data:', err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-violet-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <UIConfigProvider>
        <QueryClientProvider client={queryClient}>
          <Router>
            <div className="min-h-screen bg-[#14151A]">
              <Header />
              <Navigation />
              <main className="container mx-auto px-4">
                <Routes>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/kpis" element={<KPIsMVD />} />
                  <Route path="/audit" element={<AuditTabs auditItems={auditItems} onUpdate={refreshData} />} />
                  <Route path="/actions" element={<ActionsList />} />
                  <Route path="/project-plan" element={<ProjectPlan />} />
                  <Route path="/simulator" element={<ImpactSimulator />} />
                  <Route path="/admin" element={<AdminPage />} />
                </Routes>
              </main>
            </div>
            <ReactQueryDevtools initialIsOpen={false} />
          </Router>
        </QueryClientProvider>
      </UIConfigProvider>
    </ErrorBoundary>
  );
}

export default App;