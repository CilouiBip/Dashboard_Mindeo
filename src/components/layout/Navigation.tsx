import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, BarChart2, FileSpreadsheet } from 'lucide-react';

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
        <Link to="/kpis-mvd" className={getNavItemClass('/kpis-mvd')}>
          <BarChart2 className="h-5 w-5" />
          <span className="font-medium">KPIs</span>
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