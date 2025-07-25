/**
 * Test Suite Card Component
 * Individual expandable card for test suite results
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { TestCategoryGroup } from './TestCategoryGroup';
import type { QATestSuite, QATestResult } from './QATestResultsDashboard';

interface TestSuiteCardProps {
  suite: QATestSuite;
  isExpanded: boolean;
  onToggle: () => void;
  onRetryTest?: (testId: string) => void;
  onRetryCategory?: (category: string) => void;
  expandedCategories: Set<string>;
  onToggleCategory: (category: string) => void;
}

export const TestSuiteCard: React.FC<TestSuiteCardProps> = ({
  suite,
  isExpanded,
  onToggle,
  onRetryTest,
  onRetryCategory,
  expandedCategories,
  onToggleCategory
}) => {
  const groupTestsByCategory = (results: QATestResult[]) => {
    return results.reduce((groups, test) => {
      if (!groups[test.category]) {
        groups[test.category] = [];
      }
      groups[test.category].push(test);
      return groups;
    }, {} as Record<string, QATestResult[]>);
  };

  const categoryGroups = groupTestsByCategory(suite.results);

  return (
    <Card>
      <Collapsible open={isExpanded} onOpenChange={onToggle}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {isExpanded ? 
                  <ChevronDown className="w-4 h-4" /> : 
                  <ChevronRight className="w-4 h-4" />
                }
                <CardTitle>{suite.name}</CardTitle>
                <Badge variant="outline">
                  {suite.passedTests}/{suite.totalTests} passed
                </Badge>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground">
                  {suite.duration.toFixed(1)}s
                </span>
                <div className="w-32">
                  <Progress 
                    value={(suite.passedTests / suite.totalTests) * 100} 
                    className="h-2" 
                  />
                </div>
              </div>
            </div>
          </CardHeader>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <CardContent className="pt-0">
            {Object.entries(categoryGroups).map(([category, tests]) => (
              <TestCategoryGroup
                key={category}
                category={category}
                tests={tests}
                isExpanded={expandedCategories.has(category)}
                onToggle={() => onToggleCategory(category)}
                onRetryTest={onRetryTest}
                onRetryCategory={onRetryCategory}
              />
            ))}
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};