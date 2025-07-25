/**
 * Test Category Group Component
 * Expandable group for tests within a category
 */

import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { TestResultItem } from './TestResultItem';
import type { QATestResult } from './QATestResultsDashboard';

interface TestCategoryGroupProps {
  category: string;
  tests: QATestResult[];
  isExpanded: boolean;
  onToggle: () => void;
  onRetryTest?: (testId: string) => void;
  onRetryCategory?: (category: string) => void;
}

export const TestCategoryGroup: React.FC<TestCategoryGroupProps> = ({
  category,
  tests,
  isExpanded,
  onToggle,
  onRetryTest,
  onRetryCategory
}) => {
  const passedTests = tests.filter(t => t.status === 'passed').length;

  return (
    <div className="mb-4">
      <Collapsible open={isExpanded} onOpenChange={onToggle}>
        <CollapsibleTrigger asChild>
          <div className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 cursor-pointer">
            <div className="flex items-center space-x-2">
              {isExpanded ? 
                <ChevronDown className="w-3 h-3" /> : 
                <ChevronRight className="w-3 h-3" />
              }
              <span className="font-medium capitalize">{category} Tests</span>
              <Badge variant="secondary">
                {passedTests}/{tests.length}
              </Badge>
            </div>
            <Button 
              size="sm" 
              variant="ghost" 
              onClick={(e) => {
                e.stopPropagation();
                onRetryCategory?.(category);
              }}
            >
              Retry Category
            </Button>
          </div>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <div className="ml-4 mt-2 space-y-2">
            {tests.map((test) => (
              <TestResultItem
                key={test.id}
                test={test}
                onRetry={onRetryTest}
              />
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
};