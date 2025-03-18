#!/bin/bash

UI_DIR="src/components/ui"

# Correction de badge.tsx
echo "📝 Mise à jour de badge.tsx..."
cat > "$UI_DIR/badge.tsx" << 'EOL'
import React from 'react';
import { cn } from '../../lib/utils';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error';
  className?: string;
}

export const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ children, variant = 'default', className }, ref) => {
    const variants = {
      default: 'bg-gray-100 text-gray-800',
      success: 'bg-green-100 text-green-800',
      warning: 'bg-yellow-100 text-yellow-800',
      error: 'bg-red-100 text-red-800',
    };

    return (
      <span
        ref={ref}
        className={cn(
          'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
          variants[variant],
          className
        )}
      >
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';
EOL

# Correction de star-rating.tsx
echo "📝 Mise à jour de star-rating.tsx..."
cat > "$UI_DIR/star-rating.tsx" << 'EOL'
import React from 'react';
import { StarFilled, StarOutlined } from '@ant-design/icons';
import { cn } from '../../lib/utils';

export interface StarRatingProps {
  value: number;
  maxStars?: number;
  onChange?: (value: number) => void;
  className?: string;
}

export const StarRating = React.forwardRef<HTMLDivElement, StarRatingProps>(
  ({ value, maxStars = 5, onChange, className }, ref) => {
    return (
      <div ref={ref} className={cn('inline-flex items-center space-x-1', className)}>
        {[...Array(maxStars)].map((_, index) => {
          const starValue = index + 1;
          const filled = starValue <= value;
          
          return (
            <button
              key={index}
              onClick={() => onChange?.(starValue)}
              className={cn(
                'text-xl focus:outline-none',
                filled ? 'text-yellow-400' : 'text-gray-300'
              )}
            >
              {filled ? <StarFilled /> : <StarOutlined />}
            </button>
          );
        })}
      </div>
    );
  }
);

StarRating.displayName = 'StarRating';
EOL

# Correction de tooltip.tsx
echo "📝 Mise à jour de tooltip.tsx..."
cat > "$UI_DIR/tooltip.tsx" << 'EOL'
"use client"

import * as React from "react"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"
import { cn } from "../../lib/utils"

const TooltipProvider = TooltipPrimitive.Provider

export const Tooltip = TooltipPrimitive.Root

export const TooltipTrigger = TooltipPrimitive.Trigger

export const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitive.Content
    ref={ref}
    sideOffset={sideOffset}
    className={cn(
      "z-50 overflow-hidden rounded-md border bg-popover px-3 py-1.5 text-sm text-popover-foreground shadow-md animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      className
    )}
    {...props}
  />
))
TooltipContent.displayName = TooltipPrimitive.Content.displayName

export { TooltipProvider }
EOL

# Mise à jour de vite.config.ts
echo "📝 Mise à jour de vite.config.ts..."
cat > "vite.config.ts" << 'EOL'
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config();

export default defineConfig({
  root: __dirname,
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
  optimizeDeps: {
    include: ['recharts'],
    force: true
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  },
  server: {
    port: 7002
  }
});
EOL

# Suppression du fichier index.html dupliqué s'il existe
if [ -f "Dashboard_Mindeo-main/index.html" ]; then
  echo "🗑️ Suppression du fichier index.html dupliqué..."
  rm "Dashboard_Mindeo-main/index.html"
fi

echo "✅ Corrections terminées"
echo "🚀 Redémarrez le serveur avec ./restart-dev.sh"
