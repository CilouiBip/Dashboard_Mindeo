import React from 'react';
import { AlertCircle } from 'lucide-react';

interface ErrorMessageProps {
  error: Error;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ error }) => {
  const isConfigError = error.message.includes('configuration') || error.message.includes('API key');
  
  return (
    <div className={`rounded-lg p-4 ${
      isConfigError ? 'bg-yellow-500/10 border border-yellow-500/20' : 'bg-red-500/10 border border-red-500/20'
    }`}>
      <div className="flex items-center space-x-2">
        <AlertCircle className={`h-5 w-5 ${isConfigError ? 'text-yellow-500' : 'text-red-500'}`} />
        <span className={`font-medium ${isConfigError ? 'text-yellow-500' : 'text-red-500'}`}>
          {error.message}
        </span>
      </div>
      {isConfigError && (
        <p className="mt-2 text-sm text-gray-400">
          Please check your .env file and ensure it contains valid Airtable credentials.
        </p>
      )}
    </div>
  );
};

export default ErrorMessage;