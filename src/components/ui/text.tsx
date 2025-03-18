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
