#!/bin/bash

echo "🔧 Correction du projet Dashboard Mindeo"

# 1. Correction de vite.config.ts
echo "📝 Mise à jour de vite.config.ts..."
cat > "vite.config.ts" << 'EOL'
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@services': path.resolve(__dirname, './src/lib/supabase/services'),
      'recharts/lib': 'recharts/es6/lib'
    },
    dedupe: ['react', 'react-dom', 'recharts']
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    coverage: {
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules/', 'src/test/setup.ts'],
    },
  },
  optimizeDeps: {
    include: ['recharts'],
    exclude: ['recharts/lib'],
    force: true
  }
});
EOL

# 2. Correction des composants UI
UI_DIR="src/components/ui"

# Button.tsx
echo "📝 Mise à jour de Button.tsx..."
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
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        ref={ref}
        {...props}
      />
    );
  }
);

Button.displayName = 'Button';
EOL

# Card.tsx
echo "📝 Mise à jour de card.tsx..."
cat > "$UI_DIR/card.tsx" << 'EOL'
import * as React from "react"
import { cn } from "../../lib/utils"

export const Card = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("rounded-lg border bg-card text-card-foreground shadow-sm", className)} {...props} />
  )
)
Card.displayName = "Card"

export const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex flex-col space-y-1.5 p-6", className)} {...props} />
  )
)
CardHeader.displayName = "CardHeader"

export const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h3 ref={ref} className={cn("text-2xl font-semibold leading-none tracking-tight", className)} {...props} />
  )
)
CardTitle.displayName = "CardTitle"

export const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn("text-sm text-muted-foreground", className)} {...props} />
  )
)
CardDescription.displayName = "CardDescription"

export const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
  )
)
CardContent.displayName = "CardContent"

export const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn("flex items-center p-6 pt-0", className)} {...props} />
  )
)
CardFooter.displayName = "CardFooter"
EOL

# index.ts
echo "📝 Mise à jour de index.ts..."
cat > "$UI_DIR/index.ts" << 'EOL'
export { Button } from './Button';
export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent } from './card';
export { Input } from './input';
export { Text } from './text';
export { Title } from './title';
export { Badge } from './badge';
export { CompletionBar } from './completion-bar';
export { CompletionCircle } from './completion-circle';
export { Progress } from './progress';
export { ScoreDisplay } from './score-display';
export { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './select';
export { StarRating } from './star-rating';
export { Tabs, TabsContent, TabsList, TabsTrigger } from './tabs';
export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from './tooltip';
export { PlusOutlined } from '@ant-design/icons';
EOL

# 3. Installation des dépendances manquantes
echo "📦 Installation des dépendances..."
npm install @radix-ui/react-tabs @radix-ui/react-select @radix-ui/react-tooltip class-variance-authority lucide-react

echo "✅ Corrections terminées"
echo "🚀 Redémarrez le serveur avec ./restart-dev.sh"
