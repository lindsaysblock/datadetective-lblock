/**
 * Simple Optimization Controls
 * Clean component for running optimizations
 */

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Zap, Play, Activity } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { simpleOptimizer, OptimizationMetrics } from '@/utils/performance/simpleOptimizer';

const SimpleOptimizationRunner: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [metrics, setMetrics] = useState<OptimizationMetrics | null>(null);
  const [progress, setProgress] = useState(0);
  const { toast } = useToast();

  const runQuickOptimization = async () => {
    setIsRunning(true);
    setProgress(0);
    
    try {
      toast({
        title: "🔧 Running Quick Optimization",
        description: "Applying basic optimizations...",
      });

      // Simulate progress
      for (let i = 0; i <= 100; i += 20) {
        setProgress(i);
        await new Promise(resolve => setTimeout(resolve, 200));
      }

      const result = await simpleOptimizer.runBasicOptimizations();
      setMetrics(result);
      
      toast({
        title: "✅ Quick Optimization Complete",
        description: `System efficiency: ${result.systemEfficiency.toFixed(1)}%`,
      });
    } catch (error) {
      toast({
        title: "Optimization Failed",
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: "destructive",
      });
    } finally {
      setIsRunning(false);
      setProgress(0);
    }
  };

  const runFullOptimization = async () => {
    setIsRunning(true);
    setProgress(0);
    
    try {
      toast({
        title: "🚀 Running Full Optimization",
        description: "Applying all optimizations...",
      });

      // Simulate progress
      for (let i = 0; i <= 100; i += 10) {
        setProgress(i);
        await new Promise(resolve => setTimeout(resolve, 300));
      }

      const result = await simpleOptimizer.runAllOptimizations();
      setMetrics(result);
      
      toast({
        title: "✅ Full Optimization Complete",
        description: `System efficiency: ${result.systemEfficiency.toFixed(1)}%`,
      });
    } catch (error) {
      toast({
        title: "Optimization Failed",
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: "destructive",
      });
    } finally {
      setIsRunning(false);
      setProgress(0);
    }
  };

  return (
    <div className="space-y-6">
      {/* Control Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-500" />
            System Optimization
          </CardTitle>
          <CardDescription>
            Run system optimizations to improve performance
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
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
                <span>Progress</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results Card */}
      {metrics && (
        <Card>
          <CardHeader>
            <CardTitle>Optimization Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {metrics.systemEfficiency.toFixed(1)}%
                </div>
                <div className="text-sm text-muted-foreground">System Efficiency</div>
              </div>
              
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {metrics.eventListenersOptimized}
                </div>
                <div className="text-sm text-muted-foreground">Event Listeners</div>
              </div>
              
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">
                  {metrics.memoryReduced}KB
                </div>
                <div className="text-sm text-muted-foreground">Memory Freed</div>
              </div>
              
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">
                  {metrics.imagesLazyLoaded}
                </div>
                <div className="text-sm text-muted-foreground">Images Optimized</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default SimpleOptimizationRunner;