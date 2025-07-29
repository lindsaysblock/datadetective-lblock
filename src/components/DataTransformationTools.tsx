
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Wand2, Filter, Merge, Split, Calculator, Calendar, Type, Hash } from 'lucide-react';
import { type ParsedData } from '../utils/dataParser';
import { SafeMathEvaluator } from '../utils/security/mathEvaluator';

interface DataTransformationToolsProps {
  data: ParsedData;
  onDataTransformed: (newData: ParsedData) => void;
}

interface TransformationRule {
  id: string;
  type: 'filter' | 'clean' | 'convert' | 'calculate' | 'merge' | 'split';
  column: string;
  operation: string;
  value?: string;
  newColumn?: string;
  description: string;
}

const DataTransformationTools: React.FC<DataTransformationToolsProps> = ({
  data,
  onDataTransformed
}) => {
  const [transformationRules, setTransformationRules] = useState<TransformationRule[]>([]);
  const [previewData, setPreviewData] = useState<ParsedData | null>(null);
  const { toast } = useToast();

  const addTransformationRule = (rule: Omit<TransformationRule, 'id'>) => {
    const newRule: TransformationRule = {
      ...rule,
      id: Date.now().toString()
    };
    setTransformationRules(prev => [...prev, newRule]);
    generatePreview([...transformationRules, newRule]);
  };

  const removeTransformationRule = (ruleId: string) => {
    const updatedRules = transformationRules.filter(rule => rule.id !== ruleId);
    setTransformationRules(updatedRules);
    generatePreview(updatedRules);
  };

  const generatePreview = (rules: TransformationRule[]) => {
    try {
      let transformedData = { ...data };
      let transformedRows = [...data.rows];

      rules.forEach(rule => {
        switch (rule.type) {
          case 'filter':
            transformedRows = applyFilter(transformedRows, rule);
            break;
          case 'clean':
            transformedRows = applyClean(transformedRows, rule);
            break;
          case 'convert':
            transformedRows = applyConvert(transformedRows, rule);
            break;
          case 'calculate':
            transformedRows = applyCalculate(transformedRows, rule);
            break;
          case 'split':
            transformedRows = applySplit(transformedRows, rule);
            break;
        }
      });

      // Update columns if new ones were added
      const newColumns = [...data.columns];
      rules.forEach(rule => {
        if (rule.newColumn && !newColumns.find(col => col.name === rule.newColumn)) {
          newColumns.push({
            name: rule.newColumn,
            type: 'string',
            samples: transformedRows.slice(0, 5).map(row => row[rule.newColumn!])
          });
        }
      });
      
      transformedData = {
        ...transformedData,
        columns: newColumns,
        rows: transformedRows,
        summary: {
          ...transformedData.summary,
          totalRows: transformedRows.length,
          totalColumns: newColumns.length
        }
      };

      setPreviewData(transformedData);
    } catch (error) {
      console.error('Error generating preview:', error);
      toast({
        title: "Preview Error",
        description: "Failed to generate transformation preview",
        variant: "destructive"
      });
    }
  };

  const applyFilter = (rows: Record<string, any>[], rule: TransformationRule) => {
    return rows.filter(row => {
      const value = row[rule.column];
      switch (rule.operation) {
        case 'not_empty':
          return value !== null && value !== undefined && value !== '';
        case 'equals':
          return value === rule.value;
        case 'contains':
          return String(value).toLowerCase().includes(rule.value?.toLowerCase() || '');
        case 'greater_than':
          return Number(value) > Number(rule.value);
        case 'less_than':
          return Number(value) < Number(rule.value);
        default:
          return true;
      }
    });
  };

  const applyClean = (rows: Record<string, any>[], rule: TransformationRule) => {
    return rows.map(row => {
      const value = row[rule.column];
      let cleanedValue = value;

      switch (rule.operation) {
        case 'trim':
          cleanedValue = String(value).trim();
          break;
        case 'lowercase':
          cleanedValue = String(value).toLowerCase();
          break;
        case 'uppercase':
          cleanedValue = String(value).toUpperCase();
          break;
        case 'remove_duplicates':
          // This would need to be handled at the dataset level
          break;
        case 'fill_missing':
          cleanedValue = value || rule.value || '';
          break;
      }

      return { ...row, [rule.column]: cleanedValue };
    });
  };

  const applyConvert = (rows: Record<string, any>[], rule: TransformationRule) => {
    return rows.map(row => {
      const value = row[rule.column];
      let convertedValue = value;

      switch (rule.operation) {
        case 'to_number':
          convertedValue = Number(value) || 0;
          break;
        case 'to_date':
          convertedValue = new Date(value).toISOString().split('T')[0];
          break;
        case 'to_text':
          convertedValue = String(value);
          break;
        case 'to_boolean':
          convertedValue = Boolean(value) && value !== 'false' && value !== '0';
          break;
      }

      return { ...row, [rule.column]: convertedValue };
    });
  };

  const applyCalculate = (rows: Record<string, any>[], rule: TransformationRule) => {
    return rows.map(row => {
      const expression = rule.value || '';
      
      // Create variables object with sanitized column names
      const variables: Record<string, number> = {};
      data.columns.forEach(col => {
        const sanitizedName = SafeMathEvaluator.sanitizeColumnName(col.name);
        const value = parseFloat(row[col.name]) || 0;
        variables[sanitizedName] = value;
      });

      // Replace original column names in expression with sanitized ones
      let sanitizedExpression = expression;
      data.columns.forEach(col => {
        const sanitizedName = SafeMathEvaluator.sanitizeColumnName(col.name);
        const regex = new RegExp(`\\b${col.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'g');
        sanitizedExpression = sanitizedExpression.replace(regex, sanitizedName);
      });

      const calculatedValue = SafeMathEvaluator.evaluate(sanitizedExpression, variables);

      return { ...row, [rule.newColumn || 'calculated']: calculatedValue };
    });
  };

  const applySplit = (rows: Record<string, any>[], rule: TransformationRule) => {
    return rows.map(row => {
      const value = String(row[rule.column] || '');
      const delimiter = rule.value || ',';
      const parts = value.split(delimiter);

      const newRow = { ...row };
      parts.forEach((part, index) => {
        newRow[`${rule.column}_part_${index + 1}`] = part.trim();
      });

      return newRow;
    });
  };

  const applyTransformations = () => {
    if (previewData) {
      onDataTransformed(previewData);
      toast({
        title: "Transformations Applied",
        description: `Applied ${transformationRules.length} transformation(s) to your data.`,
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <Wand2 className="w-5 h-5 text-purple-500" />
          Data Transformation Tools
        </h2>

        <Tabs defaultValue="filter" className="w-full">
          <TabsList className="grid grid-cols-6 w-full">
            <TabsTrigger value="filter" className="flex items-center gap-1">
              <Filter className="w-4 h-4" />
              Filter
            </TabsTrigger>
            <TabsTrigger value="clean" className="flex items-center gap-1">
              <Type className="w-4 h-4" />
              Clean
            </TabsTrigger>
            <TabsTrigger value="convert" className="flex items-center gap-1">
              <Hash className="w-4 h-4" />
              Convert
            </TabsTrigger>
            <TabsTrigger value="calculate" className="flex items-center gap-1">
              <Calculator className="w-4 h-4" />
              Calculate
            </TabsTrigger>
            <TabsTrigger value="split" className="flex items-center gap-1">
              <Split className="w-4 h-4" />
              Split
            </TabsTrigger>
            <TabsTrigger value="merge" className="flex items-center gap-1">
              <Merge className="w-4 h-4" />
              Merge
            </TabsTrigger>
          </TabsList>

          <TabsContent value="filter" className="space-y-4">
            <FilterTransformation onAddRule={addTransformationRule} columns={data.columns} />
          </TabsContent>

          <TabsContent value="clean" className="space-y-4">
            <CleanTransformation onAddRule={addTransformationRule} columns={data.columns} />
          </TabsContent>

          <TabsContent value="convert" className="space-y-4">
            <ConvertTransformation onAddRule={addTransformationRule} columns={data.columns} />
          </TabsContent>

          <TabsContent value="calculate" className="space-y-4">
            <CalculateTransformation onAddRule={addTransformationRule} columns={data.columns} />
          </TabsContent>

          <TabsContent value="split" className="space-y-4">
            <SplitTransformation onAddRule={addTransformationRule} columns={data.columns} />
          </TabsContent>

          <TabsContent value="merge" className="space-y-4">
            <div className="text-center py-8 text-gray-500">
              <Merge className="w-12 h-12 mx-auto mb-2" />
              <p>Merge functionality coming soon!</p>
            </div>
          </TabsContent>
        </Tabs>
      </Card>

      {/* Applied Rules */}
      {transformationRules.length > 0 && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Applied Transformations ({transformationRules.length})</h3>
          <div className="space-y-2 mb-4">
            {transformationRules.map(rule => (
              <div key={rule.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Badge variant="outline">{rule.type}</Badge>
                  <span className="text-sm">{rule.description}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeTransformationRule(rule.id)}
                >
                  Remove
                </Button>
              </div>
            ))}
          </div>
          
          <div className="flex gap-2">
            <Button onClick={applyTransformations} className="flex-1">
              Apply All Transformations
            </Button>
            <Button 
              variant="outline" 
              onClick={() => {
                setTransformationRules([]);
                setPreviewData(null);
              }}
            >
              Clear All
            </Button>
          </div>
        </Card>
      )}

      {/* Preview */}
      {previewData && (
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Preview ({previewData.rows.length} rows)</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse border border-gray-200">
              <thead>
                <tr>
                  {previewData.columns.slice(0, 8).map(col => (
                    <th key={col.name} className="border border-gray-200 p-2 bg-gray-50 text-left text-sm font-medium">
                      {col.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {previewData.rows.slice(0, 5).map((row, index) => (
                  <tr key={index}>
                    {previewData.columns.slice(0, 8).map(col => (
                      <td key={col.name} className="border border-gray-200 p-2 text-sm">
                        {String(row[col.name] || '')}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
};

// Individual transformation components
const FilterTransformation: React.FC<{
  onAddRule: (rule: Omit<TransformationRule, 'id'>) => void;
  columns: any[];
}> = ({ onAddRule, columns }) => {
  const [column, setColumn] = useState('');
  const [operation, setOperation] = useState('');
  const [value, setValue] = useState('');

  const handleAdd = () => {
    if (column && operation) {
      onAddRule({
        type: 'filter',
        column,
        operation,
        value,
        description: `Filter ${column} where ${operation} ${value || 'condition met'}`
      });
      setColumn('');
      setOperation('');
      setValue('');
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div>
        <Label>Column</Label>
        <Select value={column} onValueChange={setColumn}>
          <SelectTrigger>
            <SelectValue placeholder="Select column" />
          </SelectTrigger>
          <SelectContent>
            {columns.map(col => (
              <SelectItem key={col.name} value={col.name}>{col.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label>Operation</Label>
        <Select value={operation} onValueChange={setOperation}>
          <SelectTrigger>
            <SelectValue placeholder="Select operation" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="not_empty">Not Empty</SelectItem>
            <SelectItem value="equals">Equals</SelectItem>
            <SelectItem value="contains">Contains</SelectItem>
            <SelectItem value="greater_than">Greater Than</SelectItem>
            <SelectItem value="less_than">Less Than</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label>Value</Label>
        <Input value={value} onChange={(e) => setValue(e.target.value)} placeholder="Filter value" />
      </div>
      <div className="flex items-end">
        <Button onClick={handleAdd} className="w-full">Add Filter</Button>
      </div>
    </div>
  );
};

const CleanTransformation: React.FC<{
  onAddRule: (rule: Omit<TransformationRule, 'id'>) => void;
  columns: any[];
}> = ({ onAddRule, columns }) => {
  const [column, setColumn] = useState('');
  const [operation, setOperation] = useState('');
  const [value, setValue] = useState('');

  const handleAdd = () => {
    if (column && operation) {
      onAddRule({
        type: 'clean',
        column,
        operation,
        value,
        description: `Clean ${column} by ${operation.replace('_', ' ')}`
      });
      setColumn('');
      setOperation('');
      setValue('');
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div>
        <Label>Column</Label>
        <Select value={column} onValueChange={setColumn}>
          <SelectTrigger>
            <SelectValue placeholder="Select column" />
          </SelectTrigger>
          <SelectContent>
            {columns.map(col => (
              <SelectItem key={col.name} value={col.name}>{col.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label>Operation</Label>
        <Select value={operation} onValueChange={setOperation}>
          <SelectTrigger>
            <SelectValue placeholder="Select operation" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="trim">Trim Whitespace</SelectItem>
            <SelectItem value="lowercase">To Lowercase</SelectItem>
            <SelectItem value="uppercase">To Uppercase</SelectItem>
            <SelectItem value="fill_missing">Fill Missing</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label>Fill Value (if applicable)</Label>
        <Input value={value} onChange={(e) => setValue(e.target.value)} placeholder="Default value" />
      </div>
      <div className="flex items-end">
        <Button onClick={handleAdd} className="w-full">Add Cleaning</Button>
      </div>
    </div>
  );
};

const ConvertTransformation: React.FC<{
  onAddRule: (rule: Omit<TransformationRule, 'id'>) => void;
  columns: any[];
}> = ({ onAddRule, columns }) => {
  const [column, setColumn] = useState('');
  const [operation, setOperation] = useState('');

  const handleAdd = () => {
    if (column && operation) {
      onAddRule({
        type: 'convert',
        column,
        operation,
        description: `Convert ${column} ${operation.replace('to_', 'to ')}`
      });
      setColumn('');
      setOperation('');
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div>
        <Label>Column</Label>
        <Select value={column} onValueChange={setColumn}>
          <SelectTrigger>
            <SelectValue placeholder="Select column" />
          </SelectTrigger>
          <SelectContent>
            {columns.map(col => (
              <SelectItem key={col.name} value={col.name}>{col.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label>Convert To</Label>
        <Select value={operation} onValueChange={setOperation}>
          <SelectTrigger>
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="to_number">Number</SelectItem>
            <SelectItem value="to_date">Date</SelectItem>
            <SelectItem value="to_text">Text</SelectItem>
            <SelectItem value="to_boolean">Boolean</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="flex items-end">
        <Button onClick={handleAdd} className="w-full">Add Conversion</Button>
      </div>
    </div>
  );
};

const CalculateTransformation: React.FC<{
  onAddRule: (rule: Omit<TransformationRule, 'id'>) => void;
  columns: any[];
}> = ({ onAddRule, columns }) => {
  const [newColumn, setNewColumn] = useState('');
  const [expression, setExpression] = useState('');

  const handleAdd = () => {
    if (newColumn && expression) {
      onAddRule({
        type: 'calculate',
        column: '',
        operation: 'calculate',
        value: expression,
        newColumn,
        description: `Calculate ${newColumn} = ${expression}`
      });
      setNewColumn('');
      setExpression('');
    }
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label>New Column Name</Label>
          <Input 
            value={newColumn} 
            onChange={(e) => setNewColumn(e.target.value)} 
            placeholder="calculated_field" 
          />
        </div>
        <div className="flex items-end">
          <Button onClick={handleAdd} className="w-full">Add Calculation</Button>
        </div>
      </div>
      <div>
        <Label>Expression</Label>
        <Textarea 
          value={expression} 
          onChange={(e) => setExpression(e.target.value)} 
          placeholder="column1 + column2 * 0.1"
          className="min-h-16"
        />
        <p className="text-xs text-gray-500 mt-1">
          Available columns: {columns.map(col => col.name).join(', ')}
        </p>
      </div>
    </div>
  );
};

const SplitTransformation: React.FC<{
  onAddRule: (rule: Omit<TransformationRule, 'id'>) => void;
  columns: any[];
}> = ({ onAddRule, columns }) => {
  const [column, setColumn] = useState('');
  const [delimiter, setDelimiter] = useState('');

  const handleAdd = () => {
    if (column && delimiter) {
      onAddRule({
        type: 'split',
        column,
        operation: 'split',
        value: delimiter,
        description: `Split ${column} by "${delimiter}"`
      });
      setColumn('');
      setDelimiter('');
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div>
        <Label>Column</Label>
        <Select value={column} onValueChange={setColumn}>
          <SelectTrigger>
            <SelectValue placeholder="Select column" />
          </SelectTrigger>
          <SelectContent>
            {columns.filter(col => col.type === 'string').map(col => (
              <SelectItem key={col.name} value={col.name}>{col.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label>Delimiter</Label>
        <Input 
          value={delimiter} 
          onChange={(e) => setDelimiter(e.target.value)} 
          placeholder="," 
        />
      </div>
      <div className="flex items-end">
        <Button onClick={handleAdd} className="w-full">Add Split</Button>
      </div>
    </div>
  );
};

export default DataTransformationTools;
