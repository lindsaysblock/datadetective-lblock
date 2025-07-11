
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { ArrowRight, ArrowLeft, Info } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ColumnIdentificationStepProps {
  parsedData: any[];
  onColumnMappingComplete: (mapping: ColumnMapping) => void;
  onNext: () => void;
  onPrevious: () => void;
}

export interface ColumnMapping {
  userIdColumn?: string;
  timestampColumn?: string;
  eventColumn?: string;
  valueColumns: string[];
  categoryColumns: string[];
}

const ColumnIdentificationStep: React.FC<ColumnIdentificationStepProps> = ({
  parsedData,
  onColumnMappingComplete,
  onNext,
  onPrevious
}) => {
  const [mapping, setMapping] = useState<ColumnMapping>({
    valueColumns: [],
    categoryColumns: []
  });

  // Get all available columns from the first file
  const availableColumns = parsedData.length > 0 && parsedData[0].data && parsedData[0].data.length > 0 
    ? Object.keys(parsedData[0].data[0]) 
    : [];

  const handleMappingChange = (key: keyof ColumnMapping, value: string | string[]) => {
    const newMapping = { ...mapping, [key]: value };
    setMapping(newMapping);
    onColumnMappingComplete(newMapping);
  };

  const toggleValueColumn = (column: string) => {
    const newValueColumns = mapping.valueColumns.includes(column)
      ? mapping.valueColumns.filter(c => c !== column)
      : [...mapping.valueColumns, column];
    handleMappingChange('valueColumns', newValueColumns);
  };

  const toggleCategoryColumn = (column: string) => {
    const newCategoryColumns = mapping.categoryColumns.includes(column)
      ? mapping.categoryColumns.filter(c => c !== column)
      : [...mapping.categoryColumns, column];
    handleMappingChange('categoryColumns', newCategoryColumns);
  };

  const getColumnSample = (columnName: string) => {
    if (parsedData.length > 0 && parsedData[0].data && parsedData[0].data.length > 0) {
      return parsedData[0].data[0][columnName];
    }
    return 'N/A';
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Identify Your Data Columns</h2>
        <p className="text-gray-600">Help us understand your data structure for better analysis</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="w-5 h-5 text-blue-600" />
            Column Identification
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* User ID Column */}
          <div className="space-y-2">
            <Label htmlFor="user-id-column">User ID Column (Optional)</Label>
            <Select onValueChange={(value) => handleMappingChange('userIdColumn', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select user identifier column..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No user ID column</SelectItem>
                {availableColumns.map(column => (
                  <SelectItem key={column} value={column}>
                    {column} (e.g., {getColumnSample(column)})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Timestamp Column */}
          <div className="space-y-2">
            <Label htmlFor="timestamp-column">Timestamp Column (Optional)</Label>
            <Select onValueChange={(value) => handleMappingChange('timestampColumn', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select timestamp column..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No timestamp column</SelectItem>
                {availableColumns.map(column => (
                  <SelectItem key={column} value={column}>
                    {column} (e.g., {getColumnSample(column)})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Event/Action Column */}
          <div className="space-y-2">
            <Label htmlFor="event-column">Event/Action Column (Optional)</Label>
            <Select onValueChange={(value) => handleMappingChange('eventColumn', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select event/action column..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No event column</SelectItem>
                {availableColumns.map(column => (
                  <SelectItem key={column} value={column}>
                    {column} (e.g., {getColumnSample(column)})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Value Columns */}
          <div className="space-y-2">
            <Label>Numeric/Value Columns</Label>
            <p className="text-sm text-gray-500 mb-3">Select columns containing numbers you want to analyze</p>
            <div className="flex flex-wrap gap-2">
              {availableColumns.map(column => (
                <Badge
                  key={column}
                  variant={mapping.valueColumns.includes(column) ? "default" : "outline"}
                  className="cursor-pointer hover:bg-blue-100"
                  onClick={() => toggleValueColumn(column)}
                >
                  {column}
                </Badge>
              ))}
            </div>
          </div>

          {/* Category Columns */}
          <div className="space-y-2">
            <Label>Category/Group Columns</Label>
            <p className="text-sm text-gray-500 mb-3">Select columns containing categories or groups</p>
            <div className="flex flex-wrap gap-2">
              {availableColumns.map(column => (
                <Badge
                  key={column}
                  variant={mapping.categoryColumns.includes(column) ? "default" : "outline"}
                  className="cursor-pointer hover:bg-green-100"
                  onClick={() => toggleCategoryColumn(column)}
                >
                  {column}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Preview of selected mapping */}
      {(mapping.userIdColumn || mapping.timestampColumn || mapping.eventColumn || 
        mapping.valueColumns.length > 0 || mapping.categoryColumns.length > 0) && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="pt-6">
            <h4 className="font-medium text-blue-900 mb-3">Column Mapping Summary:</h4>
            <div className="space-y-2 text-sm">
              {mapping.userIdColumn && mapping.userIdColumn !== 'none' && (
                <div><strong>User ID:</strong> {mapping.userIdColumn}</div>
              )}
              {mapping.timestampColumn && mapping.timestampColumn !== 'none' && (
                <div><strong>Timestamp:</strong> {mapping.timestampColumn}</div>
              )}
              {mapping.eventColumn && mapping.eventColumn !== 'none' && (
                <div><strong>Event/Action:</strong> {mapping.eventColumn}</div>
              )}
              {mapping.valueColumns.length > 0 && (
                <div><strong>Value Columns:</strong> {mapping.valueColumns.join(', ')}</div>
              )}
              {mapping.categoryColumns.length > 0 && (
                <div><strong>Category Columns:</strong> {mapping.categoryColumns.join(', ')}</div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Navigation */}
      <div className="flex justify-between pt-6">
        <Button variant="outline" onClick={onPrevious}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>
        
        <Button onClick={onNext} className="bg-green-600 hover:bg-green-700">
          Continue
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default ColumnIdentificationStep;
