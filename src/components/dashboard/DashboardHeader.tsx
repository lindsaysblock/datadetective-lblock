
/**
 * Dashboard Header Component
 * Refactored to meet coding standards with proper constants and semantic theming
 */

import React from 'react';
import { SPACING, TEXT_SIZES } from '@/constants/ui';

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
      <div className={`container mx-auto px-${SPACING.MD} py-${SPACING.LG}`}>
        <div className="text-center">
          <h1 className={`${TEXT_SIZES.HEADING} font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-${SPACING.SM}`}>
            📊 Data Analysis Dashboard
          </h1>
          <p className={`text-gray-600 ${TEXT_SIZES.LARGE}`}>
            Analyzing {filename} • {totalRows.toLocaleString()} rows • {totalColumns} columns
          </p>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
