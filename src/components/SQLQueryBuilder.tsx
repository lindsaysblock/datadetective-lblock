
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Database, Play, BookOpen, Lightbulb, Code, Eye } from 'lucide-react';
import VisualQueryBuilder from './VisualQueryBuilder';
import SQLTutorial from './SQLTutorial';
import QueryExplainer from './QueryExplainer';

interface SQLQueryBuilderProps {
  onExecuteQuery?: (query: string) => void;
}

const SQLQueryBuilder: React.FC<SQLQueryBuilderProps> = ({ onExecuteQuery }) => {
  const [activeMode, setActiveMode] = useState<'visual' | 'tutorial' | 'manual'>('visual');
  const [currentQuery, setCurrentQuery] = useState('');
  const [showExplanation, setShowExplanation] = useState(true);

  const handleQueryChange = (query: string) => {
    setCurrentQuery(query);
  };

  const handleExecuteQuery = () => {
    if (onExecuteQuery && currentQuery.trim()) {
      onExecuteQuery(currentQuery);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">SQL Query Builder</h2>
        <p className="text-gray-600">
          Build queries visually or learn SQL step-by-step with our interactive guide
        </p>
      </div>

      <Tabs value={activeMode} onValueChange={(value) => setActiveMode(value as any)} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="visual" className="flex items-center gap-2">
            <Eye className="w-4 h-4" />
            Visual Builder
          </TabsTrigger>
          <TabsTrigger value="tutorial" className="flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            Learn SQL
          </TabsTrigger>
          <TabsTrigger value="manual" className="flex items-center gap-2">
            <Code className="w-4 h-4" />
            Manual Query
          </TabsTrigger>
        </TabsList>

        <TabsContent value="visual" className="space-y-6">
          <VisualQueryBuilder 
            onQueryChange={handleQueryChange}
            showExplanation={showExplanation}
          />
        </TabsContent>

        <TabsContent value="tutorial" className="space-y-6">
          <SQLTutorial onQueryGenerated={handleQueryChange} />
        </TabsContent>

        <TabsContent value="manual" className="space-y-6">
          <Card className="p-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Manual SQL Editor</h3>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">Advanced</Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowExplanation(!showExplanation)}
                  >
                    <Lightbulb className="w-4 h-4 mr-2" />
                    {showExplanation ? 'Hide' : 'Show'} Explanation
                  </Button>
                </div>
              </div>
              
              <textarea
                className="w-full h-48 p-4 border border-gray-300 rounded-lg font-mono text-sm"
                placeholder="-- Write your SQL query here
SELECT column1, column2
FROM table_name
WHERE condition
ORDER BY column1;"
                value={currentQuery}
                onChange={(e) => handleQueryChange(e.target.value)}
              />
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      {showExplanation && currentQuery && (
        <QueryExplainer query={currentQuery} />
      )}

      {currentQuery && (
        <Card className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Generated Query</h3>
              <Button onClick={handleExecuteQuery} className="flex items-center gap-2">
                <Play className="w-4 h-4" />
                Execute Query
              </Button>
            </div>
            
            <pre className="bg-gray-50 p-4 rounded-lg overflow-x-auto">
              <code className="text-sm">{currentQuery}</code>
            </pre>
          </div>
        </Card>
      )}
    </div>
  );
};

export default SQLQueryBuilder;
