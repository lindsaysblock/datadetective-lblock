/**
 * Quality Control Header Component
 * Header section with title and main action buttons
 */

import React from 'react';
import { Button } from '@/components/ui/button';
import { Play, Square, TestTube } from 'lucide-react';

interface QualityControlHeaderProps {
  isRunningOrchestration: boolean;
  isOperational: boolean;
  isRunningTests: boolean;
  onRunOrchestration: () => void;
  onStopOrchestration: () => void;
  onRunTests: () => void;
  onAutoFixTests: () => void;
}

export const QualityControlHeader: React.FC<QualityControlHeaderProps> = ({
  isRunningOrchestration,
  isOperational,
  isRunningTests,
  onRunOrchestration,
  onStopOrchestration,
  onRunTests,
  onAutoFixTests
}) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold">Master Quality Control</h1>
        <p className="text-muted-foreground">
          Comprehensive code quality orchestration and testing dashboard
        </p>
      </div>
      <div className="flex items-center space-x-2">
        {isRunningOrchestration ? (
          <Button 
            onClick={onStopOrchestration}
            variant="destructive"
            className="flex items-center space-x-2"
          >
            <Square className="w-4 h-4" />
            <span>Emergency Stop</span>
          </Button>
        ) : (
          <Button 
            onClick={onRunOrchestration}
            disabled={!isOperational}
            className="flex items-center space-x-2"
          >
            <Play className="w-4 h-4" />
            <span>Run Full Orchestration</span>
          </Button>
        )}
        <Button 
          onClick={onRunTests}
          disabled={isRunningTests}
          variant="outline"
          className="flex items-center space-x-2"
        >
          <TestTube className="w-4 h-4" />
          <span>Run QA Tests</span>
        </Button>
        <Button 
          onClick={onAutoFixTests}
          disabled={isRunningTests}
          variant="secondary"
          className="flex items-center space-x-2"
        >
          <TestTube className="w-4 h-4" />
          <span>Auto-Fix Tests</span>
        </Button>
      </div>
    </div>
  );
};