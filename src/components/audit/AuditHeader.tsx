import React from 'react';
import { FileSpreadsheet } from 'lucide-react';

const AuditHeader = () => {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center space-x-3">
        <FileSpreadsheet className="h-8 w-8 text-violet-500" />
        <h1 className="text-2xl font-bold text-white">Audit</h1>
      </div>
    </div>
  );
};

export default AuditHeader;