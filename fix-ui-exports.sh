#!/bin/bash

UI_DIR="src/components/ui"

# Button
echo "📝 Mise à jour de Button.tsx..."
cat > "$UI_DIR/Button.tsx" << 'EOL'
import React from 'react';
import { cn } from '../../lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, variant = 'primary', size = 'md', className = '', ...props }, ref) => {
    const variants = {
      primary: 'bg-blue-600 hover:bg-blue-700 text-white',
      secondary: 'bg-gray-600 hover:bg-gray-700 text-white',
      danger: 'bg-red-600 hover:bg-red-700 text-white',
    };

    const sizes = {
      sm: 'px-2 py-1 text-sm',
      md: 'px-4 py-2',
      lg: 'px-6 py-3 text-lg',
    };

    return (
      <button
        ref={ref}
        className={cn(
          'rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
EOL

# Text
echo "📝 Mise à jour de text.tsx..."
cat > "$UI_DIR/text.tsx" << 'EOL'
import React from 'react';
import { cn } from '../../lib/utils';

interface TextProps extends React.HTMLAttributes<HTMLParagraphElement> {
  className?: string;
}

export const Text = React.forwardRef<HTMLParagraphElement, TextProps>(
  ({ className = '', ...props }, ref) => {
    return (
      <p
        ref={ref}
        className={cn('text-sm text-gray-500 dark:text-gray-400', className)}
        {...props}
      />
    );
  }
);

Text.displayName = 'Text';
EOL

# Title
echo "📝 Mise à jour de title.tsx..."
cat > "$UI_DIR/title.tsx" << 'EOL'
import React from 'react';
import { cn } from '../../lib/utils';

interface TitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  className?: string;
  level?: 1 | 2 | 3 | 4 | 5 | 6;
}

export const Title = React.forwardRef<HTMLHeadingElement, TitleProps>(
  ({ className = '', level = 1, ...props }, ref) => {
    const Component = `h${level}` as keyof JSX.IntrinsicElements;
    
    return (
      <Component
        ref={ref}
        className={cn('font-bold text-gray-900 dark:text-white', className)}
        {...props}
      />
    );
  }
);

Title.displayName = 'Title';
EOL

# Badge
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

# Card
echo "📝 Mise à jour de card.tsx..."
cat > "$UI_DIR/card.tsx" << 'EOL'
import React from 'react';
import { cn } from '../../lib/utils';

export const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      'rounded-lg border bg-card text-card-foreground shadow-sm',
      className
    )}
    {...props}
  />
));
Card.displayName = 'Card';

export const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex flex-col space-y-1.5 p-6', className)}
    {...props}
  />
));
CardHeader.displayName = 'CardHeader';

export const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      'text-2xl font-semibold leading-none tracking-tight',
      className
    )}
    {...props}
  />
));
CardTitle.displayName = 'CardTitle';

export const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn('text-sm text-muted-foreground', className)}
    {...props}
  />
));
CardDescription.displayName = 'CardDescription';

export const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
));
CardContent.displayName = 'CardContent';

export const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('flex items-center p-6 pt-0', className)}
    {...props}
  />
));
CardFooter.displayName = 'CardFooter';
EOL

# Star Rating
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

# Tooltip
echo "📝 Mise à jour de tooltip.tsx..."
cat > "$UI_DIR/tooltip.tsx" << 'EOL'
"use client"

import * as React from "react"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"
import { cn } from "../../lib/utils"

export const TooltipProvider = TooltipPrimitive.Provider;
export const Tooltip = TooltipPrimitive.Root;
export const TooltipTrigger = TooltipPrimitive.Trigger;

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
));

TooltipContent.displayName = TooltipPrimitive.Content.displayName;
EOL

# Mise à jour de index.ts
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

echo "✅ Corrections terminées"
echo "🚀 Redémarrez le serveur avec npm run dev"
