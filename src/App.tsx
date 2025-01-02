import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { TooltipProvider } from '@radix-ui/react-tooltip';
import { queryClient } from './lib/queryClient';
import Header from './components/layout/Header';
import Navigation from './components/layout/Navigation';
import Dashboard from './pages/Dashboard';
import KPIsMVD from './pages/KPIsMVD';
import AuditTabs from './components/audit/AuditTabs';
import ActionsList from './pages/ActionsList';
import ImpactSimulator from './pages/ImpactSimulator';
import ProjectPlanBeta from './pages/ProjectPlanBeta';
import ErrorBoundary from './components/ErrorBoundary';
import { UIConfigProvider } from './contexts/UIConfigContext';
import AdminPage from './pages/Admin';
import VisionPage from './pages/VisionPage';
import OKRPage from './pages/OKRPage';
import ProjectPlanPage from './pages/ProjectPlanPage';
import MemoryPage from './pages/MemoryPage';
import RoadmapPage from './pages/RoadmapPage';
import Layout from './components/layout/Layout';

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <UIConfigProvider>
            <Router>
              <div className="min-h-screen bg-[#14151A]">
                <Header />
                <Navigation />
                <main className="container mx-auto px-4">
                  <Routes>
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/kpis" element={<KPIsMVD />} />
                    <Route path="/audit" element={<AuditTabs />} />
                    <Route path="/actions" element={<ActionsList />} />
                    <Route path="/impact-simulator" element={<ImpactSimulator />} />
                    <Route path="/project-plan" element={<ProjectPlanPage />} />
                    <Route path="/project-plan-beta" element={<ProjectPlanBeta />} />
                    <Route path="/admin" element={<AdminPage />} />
                    <Route path="/okr-tools/vision" element={<VisionPage />} />
                    <Route path="/okr-tools/okr" element={<OKRPage />} />
                    <Route path="/okr-tools/roadmap" element={<RoadmapPage />} />
                    <Route path="/okr-tools/memory" element={<MemoryPage />} />
                  </Routes>
                </main>
              </div>
            </Router>
          </UIConfigProvider>
        </TooltipProvider>
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;