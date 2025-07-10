
import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Lightbulb, AlertCircle, CheckCircle, Info } from 'lucide-react';

interface QueryExplainerProps {
  query: string;
}

interface QueryAnalysis {
  type: string;
  elements: string[];
  complexity: 'beginner' | 'intermediate' | 'advanced';
  explanation: string;
  warnings: string[];
  suggestions: string[];
  performance: string;
}

const QueryExplainer: React.FC<QueryExplainerProps> = ({ query }) => {
  const analyzeQuery = (sql: string): QueryAnalysis => {
    const upperQuery = sql.toUpperCase();
    const elements: string[] = [];
    const warnings: string[] = [];
    const suggestions: string[] = [];
    
    // Detect query elements
    if (upperQuery.includes('SELECT')) elements.push('SELECT');
    if (upperQuery.includes('FROM')) elements.push('FROM');
    if (upperQuery.includes('WHERE')) elements.push('WHERE');
    if (upperQuery.includes('JOIN')) elements.push('JOIN');
    if (upperQuery.includes('GROUP BY')) elements.push('GROUP BY');
    if (upperQuery.includes('ORDER BY')) elements.push('ORDER BY');
    if (upperQuery.includes('HAVING')) elements.push('HAVING');
    if (upperQuery.includes('LIMIT')) elements.push('LIMIT');
    
    // Determine complexity
    let complexity: 'beginner' | 'intermediate' | 'advanced' = 'beginner';
    if (upperQuery.includes('JOIN') || upperQuery.includes('GROUP BY')) {
      complexity = 'intermediate';
    }
    if (upperQuery.includes('SUBQUERY') || (upperQuery.match(/SELECT/g) || []).length > 1) {
      complexity = 'advanced';
    }
    
    // Generate warnings
    if (upperQuery.includes('SELECT *') && upperQuery.includes('JOIN')) {
      warnings.push('Using SELECT * with JOINs can return duplicate column names');
    }
    if (!upperQuery.includes('WHERE') && !upperQuery.includes('LIMIT')) {
      warnings.push('Query will return all rows - consider adding WHERE or LIMIT for large tables');
    }
    if (upperQuery.includes('ORDER BY') && !upperQuery.includes('LIMIT')) {
      warnings.push('Sorting all rows can be slow on large datasets');
    }
    
    // Generate suggestions
    if (upperQuery.includes('SELECT *')) {
      suggestions.push('Consider selecting only needed columns for better performance');
    }
    if (upperQuery.includes('WHERE') && !upperQuery.includes('LIMIT')) {
      suggestions.push('Add LIMIT to test your query with a smaller result set first');
    }
    if (upperQuery.includes('JOIN') && !upperQuery.includes('ORDER BY')) {
      suggestions.push('Consider adding ORDER BY for consistent result ordering');
    }
    
    const explanation = generateExplanation(upperQuery, elements);
    const performance = assessPerformance(upperQuery, elements);
    
    return {
      type: upperQuery.includes('SELECT') ? 'Query' : 'Unknown',
      elements,
      complexity,
      explanation,
      warnings,
      suggestions,
      performance
    };
  };

  const generateExplanation = (query: string, elements: string[]): string => {
    let explanation = "This query ";
    
    if (query.includes('SELECT *')) {
      explanation += "selects all columns ";
    } else if (query.includes('SELECT')) {
      explanation += "selects specific columns ";
    }
    
    if (query.includes('FROM')) {
      const tableMatch = query.match(/FROM\s+(\w+)/i);
      if (tableMatch) {
        explanation += `from the ${tableMatch[1]} table`;
      }
    }
    
    if (query.includes('JOIN')) {
      explanation += ", combines data from multiple tables";
    }
    
    if (query.includes('WHERE')) {
      explanation += ", filters results based on conditions";
    }
    
    if (query.includes('GROUP BY')) {
      explanation += ", groups rows with similar values";
    }
    
    if (query.includes('ORDER BY')) {
      explanation += ", sorts the results";
    }
    
    if (query.includes('LIMIT')) {
      explanation += ", and limits the number of returned rows";
    }
    
    return explanation + ".";
  };

  const assessPerformance = (query: string, elements: string[]): string => {
    if (query.includes('SELECT *') && query.includes('JOIN')) {
      return 'Moderate - Consider selecting specific columns';
    }
    if (!query.includes('WHERE') && !query.includes('LIMIT')) {
      return 'Potentially slow - Scans entire table';
    }
    if (query.includes('ORDER BY') && !query.includes('LIMIT')) {
      return 'Moderate - Sorts all results';
    }
    if (query.includes('WHERE') && query.includes('LIMIT')) {
      return 'Good - Filtered and limited results';
    }
    return 'Good - Well-structured query';
  };

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!query.trim()) return null;

  const analysis = analyzeQuery(query);

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-yellow-500" />
          <h3 className="text-lg font-semibold">Query Analysis</h3>
          <Badge className={getComplexityColor(analysis.complexity)}>
            {analysis.complexity}
          </Badge>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Query Structure */}
          <div>
            <h4 className="font-semibold mb-3">Query Structure</h4>
            <div className="space-y-2">
              <div className="flex flex-wrap gap-2">
                {analysis.elements.map(element => (
                  <Badge key={element} variant="outline">{element}</Badge>
                ))}
              </div>
              <p className="text-sm text-gray-600 mt-2">
                {analysis.explanation}
              </p>
            </div>
          </div>

          {/* Performance */}
          <div>
            <h4 className="font-semibold mb-3">Performance Assessment</h4>
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span className="text-sm">{analysis.performance}</span>
            </div>
          </div>
        </div>

        {/* Warnings */}
        {analysis.warnings.length > 0 && (
          <div>
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-orange-500" />
              Warnings
            </h4>
            <ul className="space-y-1">
              {analysis.warnings.map((warning, index) => (
                <li key={index} className="text-sm text-orange-700 flex items-start gap-2">
                  <span>⚠️</span>
                  <span>{warning}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Suggestions */}
        {analysis.suggestions.length > 0 && (
          <div>
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <Info className="w-4 h-4 text-blue-500" />
              Suggestions
            </h4>
            <ul className="space-y-1">
              {analysis.suggestions.map((suggestion, index) => (
                <li key={index} className="text-sm text-blue-700 flex items-start gap-2">
                  <span>💡</span>
                  <span>{suggestion}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Learning Resources */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-semibold text-blue-800 mb-2">📚 Want to learn more?</h4>
          <p className="text-sm text-blue-700 mb-3">
            Understanding each part of your query helps you write better SQL. Here's what each element does:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-blue-600">
            {analysis.elements.includes('SELECT') && (
              <div>• <strong>SELECT:</strong> Chooses which columns to display</div>
            )}
            {analysis.elements.includes('FROM') && (
              <div>• <strong>FROM:</strong> Specifies which table(s) to query</div>
            )}
            {analysis.elements.includes('WHERE') && (
              <div>• <strong>WHERE:</strong> Filters rows based on conditions</div>
            )}
            {analysis.elements.includes('JOIN') && (
              <div>• <strong>JOIN:</strong> Combines data from multiple tables</div>
            )}
            {analysis.elements.includes('GROUP BY') && (
              <div>• <strong>GROUP BY:</strong> Groups rows for aggregation</div>
            )}
            {analysis.elements.includes('ORDER BY') && (
              <div>• <strong>ORDER BY:</strong> Sorts the results</div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default QueryExplainer;
