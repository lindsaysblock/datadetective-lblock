
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Database, Play, BookOpen, Lightbulb, Code, Eye, GraduationCap } from 'lucide-react';
import VisualQueryBuilder from './VisualQueryBuilder';
import SQLTutorial from './SQLTutorial';
import QueryExplainer from './QueryExplainer';

interface SQLQueryBuilderProps {
  onExecuteQuery?: (query: string) => void;
}

const SQLQueryBuilder: React.FC<SQLQueryBuilderProps> = ({ onExecuteQuery }) => {
  const [activeMode, setActiveMode] = useState<'visual' | 'tutorial' | 'manual' | 'learn'>('visual');
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
          Build queries visually, learn SQL step-by-step, or write queries manually
        </p>
      </div>

      <Tabs value={activeMode} onValueChange={(value) => setActiveMode(value as any)} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="visual" className="flex items-center gap-2">
            <Eye className="w-4 h-4" />
            Visual Builder
          </TabsTrigger>
          <TabsTrigger value="learn" className="flex items-center gap-2">
            <GraduationCap className="w-4 h-4" />
            Learn Queries
          </TabsTrigger>
          <TabsTrigger value="tutorial" className="flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            SQL Tutorial
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

        <TabsContent value="learn" className="space-y-6">
          <Card className="p-6">
            <div className="text-center space-y-6">
              <div>
                <GraduationCap className="w-16 h-16 text-blue-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-3">Learn How to Write Queries</h3>
                <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
                  Master SQL by watching how our visual query builder constructs queries in real-time. 
                  See how each selection translates to SQL code, understand query structure, and learn best practices.
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                <div className="bg-blue-50 p-6 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-3">🎯 Interactive Learning</h4>
                  <p className="text-blue-700 text-sm">
                    Use the Visual Builder tab and watch the "Generated Query" section update in real-time 
                    as you make selections. Each change shows you the corresponding SQL.
                  </p>
                </div>

                <div className="bg-green-50 p-6 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-3">📚 Step-by-Step Guide</h4>
                  <p className="text-green-700 text-sm">
                    Try the SQL Tutorial tab for a structured learning path that teaches you SQL 
                    concepts from basic SELECT statements to complex JOINs.
                  </p>
                </div>

                <div className="bg-purple-50 p-6 rounded-lg">
                  <h4 className="font-semibold text-purple-800 mb-3">🔍 Query Analysis</h4>
                  <p className="text-purple-700 text-sm">
                    Every query you build gets automatically analyzed and explained, helping you 
                    understand what each part does and why it's structured that way.
                  </p>
                </div>

                <div className="bg-orange-50 p-6 rounded-lg">
                  <h4 className="font-semibold text-orange-800 mb-3">⚡ Practice Mode</h4>
                  <p className="text-orange-700 text-sm">
                    Switch between visual building and manual writing to test your knowledge. 
                    Compare your hand-written queries with the visual builder's output.
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap justify-center gap-3">
                <Button 
                  onClick={() => setActiveMode('visual')}
                  className="flex items-center gap-2"
                >
                  <Eye className="w-4 h-4" />
                  Start with Visual Builder
                </Button>
                <Button 
                  onClick={() => setActiveMode('tutorial')}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <BookOpen className="w-4 h-4" />
                  Begin SQL Tutorial
                </Button>
              </div>
            </div>
          </Card>
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
