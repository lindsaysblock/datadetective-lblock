/**
 * Optimization Controls Component
 * Provides buttons and controls for running system optimizations
 */

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Zap, HardDrive, Play } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { coreSystemOptimizer } from '@/utils/performance/coreSystemOptimizer';

interface OptimizationControlsProps {
  onOptimizationComplete: (metrics: any) => void;
}

const OptimizationControls: React.FC<OptimizationControlsProps> = ({ onOptimizationComplete }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  const runQuickOptimization = async () => {
    setIsRunning(true);
    setProgress(0);
    
    try {
      toast({
        title: "🔧 Running Quick Optimization",
        description: "Applying basic system optimizations...",
      });

      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 20, 90));
      }, 300);

      const metrics = await coreSystemOptimizer.runBasicOptimizations();
      
      clearInterval(progressInterval);
      setProgress(100);
      
      onOptimizationComplete(metrics);
      
      toast({
        title: "✅ Quick Optimization Complete",
        description: `System efficiency: ${metrics.systemEfficiency.toFixed(1)}%`,
      });
    } catch (error) {
      toast({
        title: "Optimization Failed",
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: "destructive",
      });
    } finally {
      setIsRunning(false);
      setTimeout(() => setProgress(0), 1000);
    }
  };

  const runFullOptimization = async () => {
    setIsRunning(true);
    setProgress(0);
    
    try {
      toast({
        title: "🚀 Running Full Optimization",
        description: "Applying comprehensive system optimizations...",
      });

      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress(prev => Math.min(prev + 10, 90));
      }, 400);

      const metrics = await coreSystemOptimizer.runAllOptimizations();
      
      clearInterval(progressInterval);
      setProgress(100);
      
      onOptimizationComplete(metrics);
      
      toast({
        title: "✅ Full Optimization Complete",
        description: `System efficiency: ${metrics.systemEfficiency.toFixed(1)}%`,
      });
    } catch (error) {
      toast({
        title: "Optimization Failed",
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: "destructive",
      });
    } finally {
      setIsRunning(false);
      setTimeout(() => setProgress(0), 1000);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Button
          onClick={runQuickOptimization}
          disabled={isRunning}
          variant="outline"
          size="sm"
        >
          <Zap className="w-4 h-4 mr-2" />
          Quick Optimize
        </Button>
        
        <Button
          onClick={runFullOptimization}
          disabled={isRunning}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
        >
          <Play className="w-4 h-4 mr-2" />
          {isRunning ? 'Optimizing...' : 'Full Optimize'}
        </Button>
      </div>

      {isRunning && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Optimization Progress</span>
            <span>{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      )}
    </div>
  );
};

export default OptimizationControls;