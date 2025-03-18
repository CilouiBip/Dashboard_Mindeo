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
