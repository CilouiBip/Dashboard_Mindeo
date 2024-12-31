import React, { useState, useEffect, useRef } from 'react';
import { Navigate } from 'react-router-dom';
import Card from '../components/common/Card';
import { Lock } from 'lucide-react';
import { useUIConfig } from '../contexts/UIConfigContext';

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
  appTitle: string;
  appLogo: string;
  headerLogo: string;
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
  },
  appTitle: '',
  appLogo: '',
  headerLogo: ''
};

const AdminPage: React.FC = () => {
  const { uiConfig, updateConfig } = useUIConfig();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [password, setPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [selectedLogo, setSelectedLogo] = useState<File | null>(null);
  const [selectedHeaderLogo, setSelectedHeaderLogo] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const headerLogoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Check if already authenticated
    const authenticated = localStorage.getItem(LOCAL_STORAGE_AUTH_KEY) === 'true';
    setIsAuthenticated(authenticated);

    // Load saved UI config
    const savedConfig = localStorage.getItem(LOCAL_STORAGE_UI_CONFIG_KEY);
    if (savedConfig) {
      updateConfig(JSON.parse(savedConfig));
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
    updateConfig(prev => ({
      ...prev,
      functionLabels: {
        ...prev.functionLabels,
        [key]: value
      }
    }));
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateConfig({ appTitle: e.target.value });
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateConfig({ appLogo: reader.result as string });
        setSelectedLogo(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleHeaderLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateConfig({ headerLogo: reader.result as string });
        setSelectedHeaderLogo(file);
      };
      reader.readAsDataURL(file);
    }
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
          <h2 className="text-lg font-medium text-white">App Settings</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                App Title (Optional)
              </label>
              <input
                type="text"
                value={uiConfig.appTitle}
                onChange={handleTitleChange}
                placeholder="Default: Infopreneur Business Health"
                className="w-full px-4 py-2 bg-[#1C1D24] border border-[#2D2E3A] rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-violet-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Custom App Logo (Optional)
              </label>
              <div className="flex items-center space-x-4">
                {uiConfig.appLogo && (
                  <div className="flex items-center space-x-2">
                    <img
                      src={uiConfig.appLogo}
                      alt="Custom App Logo"
                      className="h-8 w-auto object-contain"
                    />
                    <button
                      onClick={() => updateConfig({ appLogo: '' })}
                      className="text-red-400 hover:text-red-300"
                    >
                      Reset to default
                    </button>
                  </div>
                )}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 bg-violet-500/10 text-violet-400 rounded-lg hover:bg-violet-500/20 transition-colors"
                >
                  {uiConfig.appLogo ? 'Change Logo' : 'Upload Custom Logo'}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleLogoChange}
                  className="hidden"
                />
              </div>
              {!uiConfig.appLogo && (
                <p className="text-sm text-gray-500 mt-1">
                  Currently using default BarChart2 icon
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Custom Header Logo (Optional)
              </label>
              <div className="flex items-center space-x-4">
                {uiConfig.headerLogo && (
                  <div className="flex items-center space-x-2">
                    <img
                      src={uiConfig.headerLogo}
                      alt="Custom Header Logo"
                      className="h-6 w-auto object-contain"
                    />
                    <button
                      onClick={() => updateConfig({ headerLogo: '' })}
                      className="text-red-400 hover:text-red-300"
                    >
                      Reset to default
                    </button>
                  </div>
                )}
                <button
                  onClick={() => headerLogoInputRef.current?.click()}
                  className="px-4 py-2 bg-violet-500/10 text-violet-400 rounded-lg hover:bg-violet-500/20 transition-colors"
                >
                  {uiConfig.headerLogo ? 'Change Logo' : 'Upload Custom Logo'}
                </button>
                <input
                  ref={headerLogoInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleHeaderLogoChange}
                  className="hidden"
                />
              </div>
              {!uiConfig.headerLogo && (
                <p className="text-sm text-gray-500 mt-1">
                  Currently using default BarChart2 icon
                </p>
              )}
            </div>
          </div>
        </Card>

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
                onChange={(e) => updateConfig(prev => ({ ...prev, kpiPageTitle: e.target.value }))}
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
                onChange={(e) => updateConfig(prev => ({ ...prev, kpiUpdateTitle: e.target.value }))}
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
                onChange={(e) => updateConfig(prev => ({ ...prev, kpiSearchPlaceholder: e.target.value }))}
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
                onChange={(e) => updateConfig(prev => ({ ...prev, expandAllText: e.target.value }))}
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
