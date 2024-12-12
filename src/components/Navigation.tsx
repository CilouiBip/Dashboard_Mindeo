import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BarChart2, ClipboardList, AlertCircle } from 'lucide-react';

function Navigation() {
  const location = useLocation();
  
  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <BarChart2 className="h-6 w-6 text-indigo-600" />
            <span className="font-bold text-xl">Scorecard</span>
          </Link>
          
          <div className="flex space-x-4">
            <Link
              to="/"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                location.pathname === '/' 
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              Dashboard
            </Link>
            <Link
              to="/kpis"
              className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium ${
                location.pathname === '/kpis'
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <AlertCircle className="h-4 w-4" />
              <span>KPIs en alerte</span>
            </Link>
            <Link
              to="/action-plan"
              className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium ${
                location.pathname === '/action-plan'
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <ClipboardList className="h-4 w-4" />
              <span>Plan d'action</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navigation;