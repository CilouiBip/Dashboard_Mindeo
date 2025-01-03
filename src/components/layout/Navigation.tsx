import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BarChart2, 
  ClipboardCheck, 
  FileText,
  CalendarClock,
  LineChart
} from 'lucide-react';

const Navigation = () => {
  const location = useLocation();

  const getNavItemClass = (path: string) => `
    flex items-center space-x-2 px-4 py-2 rounded-lg
    ${location.pathname === path ? 'bg-violet-500/10 text-violet-400' : 'text-gray-400 hover:bg-violet-500/5 hover:text-violet-400'}
    transition-colors
  `;

  return (
    <nav className="bg-[#1C1D24] border-b border-[#2D2E3A] px-6 py-2">
      <div className="flex space-x-6">
        <Link to="/" className={getNavItemClass('/')}>
          <LayoutDashboard className="h-5 w-5" />
          <span className="font-medium">Dashboard</span>
        </Link>
        <Link to="/kpis" className={getNavItemClass('/kpis')}>
          <BarChart2 className="h-5 w-5" />
          <span className="font-medium">KPIs</span>
        </Link>
        <Link to="/audit" className={getNavItemClass('/audit')}>
          <ClipboardCheck className="h-5 w-5" />
          <span className="font-medium">Audit</span>
        </Link>
        <Link to="/actions" className={getNavItemClass('/actions')}>
          <FileText className="h-5 w-5" />
          <span className="font-medium">Liste Complète</span>
        </Link>
        <Link to="/project-plan" className={getNavItemClass('/project-plan')}>
          <CalendarClock className="h-5 w-5" />
          <span className="font-medium">Project Plan</span>
        </Link>
        <Link to="/simulator" className={getNavItemClass('/simulator')}>
          <LineChart className="h-5 w-5" />
          <span className="font-medium">Simulateur</span>
        </Link>
      </div>
    </nav>
  );
};

export default Navigation;