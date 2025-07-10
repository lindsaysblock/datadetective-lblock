
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
    <div className="mb-6 text-center">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">
        📊 Data Analysis Dashboard
      </h1>
      <p className="text-gray-600">
        Analyzing {filename} • {totalRows} rows • {totalColumns} columns
      </p>
    </div>
  );
};

export default DashboardHeader;
