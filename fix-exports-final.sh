#!/bin/bash

UI_DIR="src/components/ui"

# Correction de completion-bar.tsx
echo "📝 Mise à jour de completion-bar.tsx..."
cat > "$UI_DIR/completion-bar.tsx" << 'EOL'
import React from 'react';
import { cn } from '../../lib/utils';

interface CompletionBarProps {
  percentage: number;
  className?: string;
}

export const CompletionBar: React.FC<CompletionBarProps> = ({ percentage, className = '' }) => {
  const clampedPercentage = Math.min(100, Math.max(0, percentage));
  
  return (
    <div className={cn(`w-full h-2 bg-gray-200 rounded-full ${className}`)}>
      <div
        className="h-full bg-blue-600 rounded-full transition-all duration-300"
        style={{ width: `${clampedPercentage}%` }}
      />
    </div>
  );
};

CompletionBar.displayName = 'CompletionBar';
EOL

echo "✅ Corrections terminées"
echo "🔄 Redémarrage du serveur..."
./restart-dev.sh
