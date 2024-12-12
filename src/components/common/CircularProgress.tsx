import React from 'react';

interface CircularProgressProps {
  value: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  trackColor?: string;
}

const CircularProgress: React.FC<CircularProgressProps> = ({
  value,
  size = 'md',
  className = '',
  trackColor = 'rgb(45, 46, 58)'
}) => {
  const normalizedValue = Math.min(100, Math.max(0, value));
  const radius = size === 'lg' ? 58 : size === 'md' ? 45 : 35;
  const strokeWidth = size === 'lg' ? 6 : size === 'md' ? 5 : 4;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (normalizedValue / 100) * circumference;

  const dimensions = {
    sm: 80,
    md: 100,
    lg: 128
  };

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      <svg
        className="transform -rotate-90"
        width={dimensions[size]}
        height={dimensions[size]}
      >
        <circle
          className="transition-all duration-300"
          stroke={trackColor}
          strokeWidth={strokeWidth}
          fill="none"
          r={radius}
          cx={dimensions[size] / 2}
          cy={dimensions[size] / 2}
        />
        <circle
          className="transition-all duration-300"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          fill="none"
          r={radius}
          cx={dimensions[size] / 2}
          cy={dimensions[size] / 2}
          style={{
            strokeDasharray: circumference,
            strokeDashoffset
          }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <slot />
      </div>
    </div>
  );
};

export default CircularProgress;
