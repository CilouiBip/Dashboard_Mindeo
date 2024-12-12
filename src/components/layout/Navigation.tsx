import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, BarChart2, PencilLine, FileSpreadsheet } from 'lucide-react';

const Navigation = () => {
  const location = useLocation();

  const getNavItemClass = (path: string) => `
    flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors
    ${location.pathname === path
      ? 'bg-violet-500/10 text-violet-500'
      : 'text-gray-400 hover:text-white hover:bg-[#2D2E3A]'
    }
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
        <Link to="/kpis-mvd" className={getNavItemClass('/kpis-mvd')}>
          <PencilLine className="h-5 w-5" />
          <span className="font-medium">KPIs MVD</span>
        </Link>
        <Link to="/audit" className={getNavItemClass('/audit')}>
          <FileSpreadsheet className="h-5 w-5" />
          <span className="font-medium">Audit</span>
        </Link>
      </div>
    </nav>
  );
};

export default Navigation;