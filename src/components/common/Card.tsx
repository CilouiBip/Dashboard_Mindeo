import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <div className={`bg-[#1C1D24] border border-[#2D2E3A] rounded-lg ${className}`}>
      {children}
    </div>
  );
};

export default Card;
