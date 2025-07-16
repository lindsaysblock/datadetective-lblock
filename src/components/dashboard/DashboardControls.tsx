
/**
 * Dashboard Controls Component
 * Refactored to meet coding standards with proper constants and semantic styling
 */

import React from 'react';
import { Button } from '@/components/ui/button';
import { SPACING } from '@/constants/ui';

interface DashboardControlsProps {
  onRunQA: () => void;
}

const DashboardControls: React.FC<DashboardControlsProps> = ({ onRunQA }) => {
  return (
    <div className={`mb-${SPACING.LG} flex justify-center`}>
      <Button 
        onClick={onRunQA}
        className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600"
      >
        🔍 Run QA Analysis
      </Button>
    </div>
  );
};

export default DashboardControls;
