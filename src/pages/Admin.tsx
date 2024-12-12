import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import Card from '../components/common/Card';
import { Lock } from 'lucide-react';

const ADMIN_PASSWORD = '0000';
const LOCAL_STORAGE_AUTH_KEY = 'admin_authenticated';
const LOCAL_STORAGE_UI_CONFIG_KEY = 'ui_config';

interface UIConfig {
  kpiPageTitle: string;
  kpiUpdateTitle: string;
  kpiSearchPlaceholder: string;
  expandAllText: string;
  functionLabels: {
    [key: string]: string;
  };
}

const defaultUIConfig: UIConfig = {
  kpiPageTitle: 'KPIs',
  kpiUpdateTitle: 'Update KPIs',
  kpiSearchPlaceholder: 'Search KPIs or functions...',
  expandAllText: 'Expand All',
  functionLabels: {
    Content: 'Content',
    Executive: 'Executive',
    Finance: 'Finance',
    Legal: 'Legal',
    Marketing: 'Marketing',
    Product: 'Product',
    HR: 'HR',
    Sales: 'Sales'
  }
};

const AdminPage: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [password, setPassword] = useState<string>('');
  const [uiConfig, setUIConfig] = useState<UIConfig>(defaultUIConfig);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    // Check if already authenticated
    const authenticated = localStorage.getItem(LOCAL_STORAGE_AUTH_KEY) === 'true';
    setIsAuthenticated(authenticated);

    // Load saved UI config
    const savedConfig = localStorage.getItem(LOCAL_STORAGE_UI_CONFIG_KEY);
    if (savedConfig) {
      setUIConfig(JSON.parse(savedConfig));
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      localStorage.setItem(LOCAL_STORAGE_AUTH_KEY, 'true');
      setError('');
    } else {
      setError('Invalid password');
    }
  };

  const handleSave = () => {
    localStorage.setItem(LOCAL_STORAGE_UI_CONFIG_KEY, JSON.stringify(uiConfig));
    alert('Settings saved successfully!');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem(LOCAL_STORAGE_AUTH_KEY);
  };

  const updateFunctionLabel = (key: string, value: string) => {
    setUIConfig(prev => ({
      ...prev,
      functionLabels: {
        ...prev.functionLabels,
        [key]: value
      }
    }));
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#13141A] flex items-center justify-center p-6">
        <Card className="w-full max-w-md p-8">
          <div className="flex items-center space-x-3 mb-6">
            <Lock className="h-6 w-6 text-violet-400" />
            <h1 className="text-xl font-medium text-white">Admin Access</h1>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full px-4 py-2 bg-[#1C1D24] border border-[#2D2E3A] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-violet-500"
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              type="submit"
              className="w-full px-4 py-2 bg-violet-500 text-white rounded-lg hover:bg-violet-600 transition-colors"
            >
              Login
            </button>
          </form>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#13141A] p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-medium text-white">Admin Settings</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
          >
            Logout
          </button>
        </div>

        <Card className="p-6 space-y-6">
          <h2 className="text-lg font-medium text-white">KPI Page Settings</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Page Title
              </label>
              <input
                type="text"
                value={uiConfig.kpiPageTitle}
                onChange={(e) => setUIConfig(prev => ({ ...prev, kpiPageTitle: e.target.value }))}
                className="w-full px-4 py-2 bg-[#1C1D24] border border-[#2D2E3A] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-violet-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Update Section Title
              </label>
              <input
                type="text"
                value={uiConfig.kpiUpdateTitle}
                onChange={(e) => setUIConfig(prev => ({ ...prev, kpiUpdateTitle: e.target.value }))}
                className="w-full px-4 py-2 bg-[#1C1D24] border border-[#2D2E3A] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-violet-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Search Placeholder
              </label>
              <input
                type="text"
                value={uiConfig.kpiSearchPlaceholder}
                onChange={(e) => setUIConfig(prev => ({ ...prev, kpiSearchPlaceholder: e.target.value }))}
                className="w-full px-4 py-2 bg-[#1C1D24] border border-[#2D2E3A] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-violet-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Expand All Text
              </label>
              <input
                type="text"
                value={uiConfig.expandAllText}
                onChange={(e) => setUIConfig(prev => ({ ...prev, expandAllText: e.target.value }))}
                className="w-full px-4 py-2 bg-[#1C1D24] border border-[#2D2E3A] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-violet-500"
              />
            </div>
          </div>
        </Card>

        <Card className="p-6 space-y-6">
          <h2 className="text-lg font-medium text-white">Function Labels</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(uiConfig.functionLabels).map(([key, value]) => (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  {key}
                </label>
                <input
                  type="text"
                  value={value}
                  onChange={(e) => updateFunctionLabel(key, e.target.value)}
                  className="w-full px-4 py-2 bg-[#1C1D24] border border-[#2D2E3A] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-violet-500"
                />
              </div>
            ))}
          </div>
        </Card>

        <div className="flex justify-end">
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-violet-500 text-white rounded-lg hover:bg-violet-600 transition-colors"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
