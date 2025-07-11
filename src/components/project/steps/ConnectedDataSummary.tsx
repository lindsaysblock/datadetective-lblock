
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Plus, X } from 'lucide-react';

interface ConnectedDataSummaryProps {
  parsedData: any[];
  onRemoveFile: (index: number) => void;
  onAddAdditionalSource: () => void;
}

const ConnectedDataSummary: React.FC<ConnectedDataSummaryProps> = ({
  parsedData,
  onRemoveFile,
  onAddAdditionalSource
}) => {
  const handleRemoveFile = (index: number) => {
    console.log('Removing file at index:', index);
    onRemoveFile(index);
  };

  return (
    <Card className="bg-green-50 border-green-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-green-700">
          <CheckCircle className="w-5 h-5 text-green-600" />
          Data Connected Successfully!
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center mb-4">
          <img 
            src="https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=400&h=300&fit=crop" 
            alt="Success" 
            className="w-32 h-24 object-cover rounded-lg mx-auto mb-4"
          />
          <p className="text-green-700 mb-4">
            {parsedData.length} data source{parsedData.length > 1 ? 's' : ''} connected and ready for analysis.
          </p>
        </div>
        
        {parsedData.map((data, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-green-100 rounded-lg mb-2">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-green-900">{data.name || `Dataset ${index + 1}`}</span>
              <span className="text-xs text-green-600">
                ({data.summary?.totalRows || data.rows || 0} rows × {data.summary?.totalColumns || data.columns || 0} columns)
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleRemoveFile(index)}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        ))}

        <div className="pt-2 border-t border-green-200">
          <Button
            variant="outline"
            onClick={onAddAdditionalSource}
            className="flex items-center gap-2 text-green-700 border-green-300 hover:bg-green-100"
          >
            <Plus className="w-4 h-4" />
            Add Additional Source
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ConnectedDataSummary;
