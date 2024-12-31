import React, { useState } from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}

export const StarRating: React.FC<StarRatingProps> = ({ value, onChange, disabled }) => {
  const [hoverValue, setHoverValue] = useState<number | null>(null);
  
  const handleMouseEnter = (index: number) => {
    if (!disabled) {
      setHoverValue(index);
    }
  };

  const handleMouseLeave = () => {
    setHoverValue(null);
  };

  const handleClick = (index: number) => {
    if (!disabled) {
      onChange(index);
    }
  };

  return (
    <div 
      className="flex gap-1" 
      onMouseLeave={handleMouseLeave}
    >
      {[1, 2, 3, 4, 5].map((index) => (
        <button
          key={index}
          type="button"
          onClick={() => handleClick(index)}
          onMouseEnter={() => handleMouseEnter(index)}
          disabled={disabled}
          className={`p-1 transition-colors ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
          aria-label={`Rate ${index} out of 5`}
        >
          <Star
            className={`w-4 h-4 ${
              (hoverValue !== null ? index <= hoverValue : index <= value)
                ? 'fill-violet-500 text-violet-500 hover:fill-violet-400 hover:text-violet-400'
                : 'text-gray-600 hover:text-gray-500'
            }`}
          />
        </button>
      ))}
    </div>
  );
};
