import { createBrowserRouter, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import KPIsMVD from './pages/KPIsMVD';
import AuditTabs from './components/audit/AuditTabs';
import ActionsList from './pages/ActionsList';
import ImpactSimulator from './pages/ImpactSimulator';
import AdminPage from './pages/Admin';
import VisionPage from './pages/VisionPage';
import OKRPage from './pages/OKRPage';
import RoadmapPage from './pages/RoadmapPage';
import Layout from './components/layout/Layout';
import ErrorBoundary from './components/common/ErrorBoundary';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <ErrorBoundary><Layout /></ErrorBoundary>,
    errorElement: <Navigate to="/dashboard" replace />,
    children: [
      {
        index: true,
        element: <Navigate to="/dashboard" replace />,
      },
      {
        path: 'dashboard',
        element: <ErrorBoundary><Dashboard /></ErrorBoundary>,
      },
      {
        path: 'kpis',
        element: <ErrorBoundary><KPIsMVD /></ErrorBoundary>,
      },
      {
        path: 'audit',
        element: <ErrorBoundary><AuditTabs /></ErrorBoundary>,
      },
      {
        path: 'actions',
        element: <ErrorBoundary><ActionsList /></ErrorBoundary>,
      },
      {
        path: 'impact-simulator',
        element: <ErrorBoundary><ImpactSimulator /></ErrorBoundary>,
      },
      {
        path: 'admin',
        element: <ErrorBoundary><AdminPage /></ErrorBoundary>,
      },
      // Routes OKR Tools
      {
        path: 'okr-tools',
        children: [
          {
            path: 'vision',
            element: <ErrorBoundary><VisionPage /></ErrorBoundary>,
          },
          {
            path: 'okr',
            element: <ErrorBoundary><OKRPage /></ErrorBoundary>,
          },
          {
            path: 'roadmap',
            element: <ErrorBoundary><RoadmapPage /></ErrorBoundary>,
          },
        ],
      },
      // Catch-all route
      {
        path: '*',
        element: <Navigate to="/dashboard" replace />,
      },
    ],
  },
], {
  future: {
    v7_startTransition: true,
    v7_relativeSplatPath: true
  }
});
