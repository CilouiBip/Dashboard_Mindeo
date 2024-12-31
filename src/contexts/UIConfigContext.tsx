import React, { createContext, useContext, useState, useEffect } from 'react';

interface UIConfig {
  appTitle: string;
  appLogo: string;
  headerLogo: string;
  kpiPageTitle: string;
  kpiUpdateTitle: string;
  kpiSearchPlaceholder: string;
  expandAllText: string;
  functionLabels: {
    [key: string]: string;
  };
}

const defaultUIConfig: UIConfig = {
  appTitle: 'Infopreneur Business Health',
  appLogo: '',
  headerLogo: '',
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
};

interface UIConfigContextType {
  uiConfig: UIConfig;
  updateConfig: (newConfig: Partial<UIConfig>) => void;
  getFunctionLabel: (key: string) => string;
}

const UIConfigContext = createContext<UIConfigContextType>({
  uiConfig: defaultUIConfig,
  updateConfig: () => {},
  getFunctionLabel: (key: string) => key,
});

export const useUIConfig = () => useContext(UIConfigContext);

export const UIConfigProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [uiConfig, setUIConfig] = useState<UIConfig>(defaultUIConfig);

  useEffect(() => {
    const savedConfig = localStorage.getItem('ui_config');
    if (savedConfig) {
      setUIConfig(JSON.parse(savedConfig));
    }
  }, []);

  const updateConfig = (newConfig: Partial<UIConfig>) => {
    setUIConfig(prev => ({
      ...prev,
      ...newConfig,
    }));
  };

  const getFunctionLabel = (key: string): string => {
    return uiConfig.functionLabels[key] || key;
  };

  return (
    <UIConfigContext.Provider value={{ uiConfig, updateConfig, getFunctionLabel }}>
      {children}
    </UIConfigContext.Provider>
  );
};
