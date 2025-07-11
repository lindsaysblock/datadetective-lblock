
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Code, Lightbulb } from 'lucide-react';

interface QueryStep {
  step: number;
  title: string;
  description: string;
  code: string;
  explanation: string;
}

interface SQLQueryBreakdownProps {
  query: string;
  steps: QueryStep[];
}

const SQLQueryBreakdown: React.FC<SQLQueryBreakdownProps> = ({ query, steps }) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Code className="w-5 h-5" />
            Generated SQL Query
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-900 text-gray-100 p-4 rounded-lg font-mono text-sm overflow-x-auto">
            <pre>{query}</pre>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-yellow-500" />
            Step-by-Step Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {steps.map((step, index) => (
            <div key={step.step} className="relative">
              {index < steps.length - 1 && (
                <div className="absolute left-4 top-8 w-px h-full bg-gray-200" />
              )}
              <div className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-medium flex-shrink-0">
                  {step.step}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-gray-900">{step.title}</h3>
                    <Badge variant="outline" className="text-xs">
                      Step {step.step}
                    </Badge>
                  </div>
                  <p className="text-gray-600 mb-3">{step.description}</p>
                  <div className="bg-gray-50 p-3 rounded-lg mb-3">
                    <code className="text-sm font-mono text-gray-800">{step.code}</code>
                  </div>
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <p className="text-sm text-blue-800">💡 {step.explanation}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default SQLQueryBreakdown;
