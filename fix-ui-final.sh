#!/bin/bash

UI_DIR="src/components/ui"

# Correction de completion-circle.tsx
echo "📝 Mise à jour de completion-circle.tsx..."
cat > "$UI_DIR/completion-circle.tsx" << 'EOL'
import React from 'react';
import { cn } from '../../lib/utils';

interface CompletionCircleProps {
  percentage: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
}

export const CompletionCircle: React.FC<CompletionCircleProps> = ({
  percentage,
  size = 40,
  strokeWidth = 4,
  className = '',
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className={cn('relative', className)} style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        <circle
          className="text-gray-200"
          strokeWidth={strokeWidth}
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <circle
          className="text-blue-600 transition-all duration-300"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center text-sm font-medium">
        {Math.round(percentage)}%
      </div>
    </div>
  );
};

CompletionCircle.displayName = 'CompletionCircle';
EOL

# Correction de progress.tsx
echo "📝 Mise à jour de progress.tsx..."
cat > "$UI_DIR/progress.tsx" << 'EOL'
import React from 'react';
import { cn } from '../../lib/utils';

interface ProgressProps {
  value: number;
  max?: number;
  className?: string;
}

export const Progress: React.FC<ProgressProps> = ({ value, max = 100, className = '' }) => {
  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className={cn('w-full h-2 bg-gray-200 rounded-full', className)}>
      <div
        className="h-full bg-blue-600 rounded-full transition-all duration-300"
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
};

Progress.displayName = 'Progress';
EOL

# Correction de score-display.tsx
echo "📝 Mise à jour de score-display.tsx..."
cat > "$UI_DIR/score-display.tsx" << 'EOL'
import React from 'react';
import { cn } from '../../lib/utils';

interface ScoreDisplayProps {
  score: number;
  maxScore?: number;
  className?: string;
}

export const ScoreDisplay: React.FC<ScoreDisplayProps> = ({
  score,
  maxScore = 100,
  className = '',
}) => {
  const percentage = (score / maxScore) * 100;
  
  return (
    <div className={cn('flex items-center space-x-2', className)}>
      <span className="text-lg font-bold">{score}</span>
      <span className="text-gray-500">/ {maxScore}</span>
      <span className="text-sm text-gray-400">({percentage.toFixed(1)}%)</span>
    </div>
  );
};

ScoreDisplay.displayName = 'ScoreDisplay';
EOL

# Correction des imports dans ImpactSimulator.tsx
echo "📝 Mise à jour des imports dans ImpactSimulator.tsx..."
sed -i '' 's|from '"'"'../components/ui/Card'"'"'|from '"'"'../components/ui/card'"'"'|g' src/pages/ImpactSimulator.tsx
sed -i '' 's|from '"'"'../components/ui/Select'"'"'|from '"'"'../components/ui/select'"'"'|g' src/pages/ImpactSimulator.tsx
sed -i '' 's|from '"'"'../components/ui/Tooltip'"'"'|from '"'"'../components/ui/tooltip'"'"'|g' src/pages/ImpactSimulator.tsx

echo "✅ Corrections terminées"
echo "🔄 Redémarrage du serveur..."
./restart-dev.sh
