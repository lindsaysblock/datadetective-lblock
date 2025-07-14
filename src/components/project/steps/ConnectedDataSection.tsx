
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Upload, X, CheckCircle } from 'lucide-react';

interface ConnectedDataSectionProps {
  parsedData: any[];
  files: File[];
  onRemoveFile: (index: number) => void;
  onAddMore: () => void;
}

const ConnectedDataSection: React.FC<ConnectedDataSectionProps> = ({
  parsedData,
  files,
  onRemoveFile,
  onAddMore
}) => {
  return (
    <Card className="bg-green-50 border-green-200">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-green-700">
          <CheckCircle className="w-5 h-5" />
          Data Connected Successfully!
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-center mb-4">
          <p className="text-green-700 mb-4">
            {parsedData.length} data source{parsedData.length > 1 ? 's' : ''} ready for analysis
          </p>
        </div>
        
        {parsedData.map((data, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-green-100 rounded-lg">
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-green-900">
                {data.name || files[index]?.name || `Dataset ${index + 1}`}
              </span>
              <span className="text-xs text-green-600">
                ({data.summary?.totalRows || data.rows?.length || 0} rows × {data.summary?.totalColumns || data.columns?.length || 0} columns)
              </span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onRemoveFile(index)}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        ))}

        <div className="pt-2 border-t border-green-200">
          <Button
            variant="outline"
            onClick={onAddMore}
            className="flex items-center gap-2 text-green-700 border-green-300 hover:bg-green-100"
          >
            <Upload className="w-4 h-4" />
            Add More Data
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ConnectedDataSection;
