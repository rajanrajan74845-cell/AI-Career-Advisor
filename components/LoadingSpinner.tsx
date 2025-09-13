
import React from 'react';

interface LoadingSpinnerProps {
    text: string;
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ text }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 bg-card rounded-lg shadow-md border border-slate-200/80">
      <div className="w-12 h-12 border-4 border-slate-200 border-t-primary rounded-full animate-spin"></div>
      <p className="mt-4 text-secondary font-medium">{text}</p>
    </div>
  );
};

export default LoadingSpinner;
