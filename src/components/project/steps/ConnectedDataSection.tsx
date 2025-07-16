
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Database, FileText, Trash2, Eye, Plus } from 'lucide-react';
import { type ProcessedFileData } from '@/hooks/useFileProcessing';

interface ConnectedDataSectionProps {
  parsedData: any[];
  processedFiles?: ProcessedFileData[];
  files: File[];
  onRemoveFile: (index: number) => void;
  onAddMore: () => void;
  onPreviewData?: (data: any) => void;
}

const ConnectedDataSection: React.FC<ConnectedDataSectionProps> = ({
  parsedData,
  processedFiles = [],
  files,
  onRemoveFile,
  onAddMore,
  onPreviewData
}) => {
  console.log('ConnectedDataSection rendering:', {
    parsedDataCount: parsedData?.length || 0,
    processedFilesCount: processedFiles?.length || 0,
    filesCount: files?.length || 0
  });

  const totalRows = parsedData?.reduce((sum, data) => sum + (data.rowCount || data.summary?.totalRows || 0), 0) || 0;
  const totalColumns = parsedData?.reduce((sum, data) => sum + (data.columns?.length || data.summary?.totalColumns || 0), 0) || 0;

  if (!parsedData || parsedData.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Summary Card */}
      <Card className="bg-green-50 border-green-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-800">
            <Database className="w-5 h-5" />
            Connected Data Sources
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-green-700">{parsedData.length}</div>
              <div className="text-sm text-green-600">Data Source{parsedData.length !== 1 ? 's' : ''}</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-700">{totalRows.toLocaleString()}</div>
              <div className="text-sm text-green-600">Total Rows</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-700">{totalColumns}</div>
              <div className="text-sm text-green-600">Total Columns</div>
            </div>
            <div>
              <Button
                onClick={onAddMore}
                variant="outline"
                size="sm"
                className="w-full"
              >
                <Plus className="w-4 h-4 mr-1" />
                Add More
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Sources List */}
      <div className="space-y-3">
        <h4 className="font-medium text-gray-900">Data Sources:</h4>
        {parsedData.map((data, index) => {
          const processedFile = processedFiles.find(pf => pf.parsedData === data);
          const originalFile = files[index];
          
          return (
            <Card key={data.id || index} className="border-gray-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-blue-600" />
                    <div>
                      <h5 className="font-medium text-gray-900">
                        {data.name || originalFile?.name || `Dataset ${index + 1}`}
                      </h5>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary" className="text-xs">
                          {(data.rowCount || data.summary?.totalRows || 0).toLocaleString()} rows
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {(data.columns?.length || data.summary?.totalColumns || 0)} columns
                        </Badge>
                        {originalFile && (
                          <Badge variant="outline" className="text-xs">
                            {(originalFile.size / 1024).toFixed(1)} KB
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {onPreviewData && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onPreviewData(data)}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onRemoveFile(index)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                {/* Column Preview */}
                {data.columns && data.columns.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <div className="text-xs text-gray-500 mb-2">Columns:</div>
                    <div className="flex flex-wrap gap-1">
                      {data.columns.slice(0, 6).map((column: any, colIndex: number) => (
                        <Badge key={colIndex} variant="outline" className="text-xs">
                          {typeof column === 'object' ? column.name : column}
                        </Badge>
                      ))}
                      {data.columns.length > 6 && (
                        <Badge variant="outline" className="text-xs">
                          +{data.columns.length - 6} more
                        </Badge>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default ConnectedDataSection;
