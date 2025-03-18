#!/bin/bash

# Chemin vers le dossier des composants UI
UI_DIR="src/components/ui"

# Correction de Button.tsx
cat > "$UI_DIR/Button.tsx" << 'EOL'
import React from 'react';
import { cn } from '../../utils/cn';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'outline' | 'ghost' | 'link';
  size?: 'sm' | 'md' | 'lg';
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'md', ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 disabled:pointer-events-none disabled:opacity-50';
    
    const variants = {
      default: 'bg-violet-600 text-white hover:bg-violet-700 active:bg-violet-800',
      outline: 'border border-violet-200 bg-transparent hover:bg-violet-100 text-violet-700',
      ghost: 'hover:bg-violet-100 text-violet-700',
      link: 'text-violet-700 underline-offset-4 hover:underline',
    };

    const sizes = {
      sm: 'h-8 px-3 text-sm',
      md: 'h-10 px-4',
      lg: 'h-12 px-6 text-lg',
    };

    return (
      <button
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';
EOL

# Correction de index.ts
cat > "$UI_DIR/index.ts" << 'EOL'
export { Button } from './Button';
export { Input } from './input';
export { Text } from './text';
export { Title } from './title';
export { Badge } from './badge';
export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent } from './card';
export { CompletionBar } from './completion-bar';
export { CompletionCircle } from './completion-circle';
export { Progress } from './progress';
export { ScoreDisplay } from './score-display';
export { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';
export { StarRating } from './star-rating';
export { Tabs, TabsContent, TabsList, TabsTrigger } from './tabs';
export { Tooltip } from './tooltip';
export { PlusOutlined } from '@ant-design/icons';
EOL

echo "Composants UI corrigés"
