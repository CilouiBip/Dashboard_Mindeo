import React, { createContext, useContext, useState, useEffect } from 'react';

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

interface UIConfigContextType {
  uiConfig: UIConfig;
  getFunctionLabel: (key: string) => string;
}

const UIConfigContext = createContext<UIConfigContextType>({
  uiConfig: defaultUIConfig,
  getFunctionLabel: (key: string) => key
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

  const getFunctionLabel = (key: string): string => {
    return uiConfig.functionLabels[key] || key;
  };

  return (
    <UIConfigContext.Provider value={{ uiConfig, getFunctionLabel }}>
      {children}
    </UIConfigContext.Provider>
  );
};
