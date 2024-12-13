import React from 'react';
import { Link } from 'react-router-dom';
import { BarChart2, Lock } from 'lucide-react';
import { useUIConfig } from '../../contexts/UIConfigContext';

const Header: React.FC = () => {
  const { uiConfig } = useUIConfig();

  return (
    <header className="bg-[#1C1D24] border-b border-[#2D2E3A] px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {/* Show custom header logo if available, otherwise show default icon */}
          {uiConfig.headerLogo ? (
            <img
              src={uiConfig.headerLogo}
              alt="Header Logo"
              className="h-6 w-auto"
            />
          ) : (
            <BarChart2 className="h-6 w-6 text-violet-500" />
          )}
          <span className="text-xl font-semibold text-white">
            {uiConfig.appTitle || 'Infopreneur Business Health'}
          </span>
        </div>
        <div className="flex items-center space-x-4">
          <Link 
            to="/admin" 
            className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors"
          >
            <Lock className="h-5 w-5" />
            <span className="text-sm font-medium">ADMIN</span>
          </Link>
          {/* Show custom app logo if available, otherwise show default icon */}
          {uiConfig.appLogo ? (
            <img
              src={uiConfig.appLogo}
              alt="App Logo"
              className="h-8 w-auto"
            />
          ) : (
            <BarChart2 className="h-8 w-8 text-violet-500" />
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;