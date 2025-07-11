
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, File, Plus, Settings } from 'lucide-react';

interface ConnectedDataSectionProps {
  parsedData: any[];
  onRemoveFile: (index: number) => void;
  onContinueToColumnId: () => void;
  onAddAdditionalSource: () => void;
}

const ConnectedDataSection: React.FC<ConnectedDataSectionProps> = ({
  parsedData,
  onRemoveFile,
  onContinueToColumnId,
  onAddAdditionalSource
}) => {
  return (
    <>
      <Card className="bg-green-50 border-green-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-700">
            <CheckCircle className="w-5 h-5 text-green-600" />
            Data Sources Connected!
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-green-700 mb-4">
            {parsedData.length} file{parsedData.length > 1 ? 's' : ''} uploaded successfully.
          </p>

          {parsedData.map((data, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-green-100 rounded-lg">
              <div className="flex items-center gap-2">
                <File className="w-4 h-4 text-green-600" />
                <span className="text-sm font-medium text-green-900">{data.name}</span>
                <span className="text-xs text-green-600">
                  ({data.rows} rows × {data.columns} columns)
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onRemoveFile(index)}
                className="text-red-600 hover:text-red-700"
              >
                ×
              </Button>
            </div>
          ))}
          
          <p className="text-xs text-green-600">
            Successfully processed and ready for analysis
          </p>
          
          {/* Column Identification Button */}
          <div className="pt-2 space-y-2">
            <Button
              onClick={onContinueToColumnId}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
            >
              <Settings className="w-4 h-4" />
              Identify Column Types
            </Button>
            <p className="text-xs text-blue-600">
              Help us understand your data structure for better analysis recommendations
            </p>
          </div>
          
          {/* Add Additional Source Button */}
          <div className="pt-2">
            <Button
              variant="outline"
              onClick={onAddAdditionalSource}
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Additional Source
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Success Message */}
      <div className="text-center p-4 bg-blue-50 rounded-lg">
        <p className="text-blue-800 font-medium">
          ✅ Your data is ready! Continue to add context or identify column types for better analysis.
        </p>
      </div>
    </>
  );
};

export default ConnectedDataSection;
