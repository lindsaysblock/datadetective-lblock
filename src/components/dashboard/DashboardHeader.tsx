
import React from 'react';

interface DashboardHeaderProps {
  filename?: string;
  totalRows: number;
  totalColumns: number;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  filename,
  totalRows,
  totalColumns
}) => {
  return (
    <div className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
            📊 Data Analysis Dashboard
          </h1>
          <p className="text-gray-600 text-lg">
            Analyzing {filename} • {totalRows.toLocaleString()} rows • {totalColumns} columns
          </p>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
