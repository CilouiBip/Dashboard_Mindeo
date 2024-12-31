import React from 'react';
import { 
  Camera, 
  Users, 
  BarChart, 
  Scale, 
  PieChart, 
  MonitorPlay,
  UserSquare2,
  ShoppingCart
} from 'lucide-react';

interface FunctionIconProps {
  name: string;
  className?: string;
}

export const FunctionIcon: React.FC<FunctionIconProps> = ({ name, className = "h-5 w-5 text-violet-400" }) => {
  const getIcon = () => {
    switch (name.toLowerCase()) {
      case 'content':
        return <Camera className={className} />;
      case 'executive':
        return <Users className={className} />;
      case 'finance':
        return <BarChart className={className} />;
      case 'legal':
      case 'légal':
        return <Scale className={className} />;
      case 'marketing':
        return <PieChart className={className} />;
      case 'product':
        return <MonitorPlay className={className} />;
      case 'rh':
      case 'hr':
      case 'human resources':
        return <Users className={className} />;
      case 'sales':
        return <ShoppingCart className={className} />;
      default:
        return <UserSquare2 className={className} />;
    }
  };

  return getIcon();
};
