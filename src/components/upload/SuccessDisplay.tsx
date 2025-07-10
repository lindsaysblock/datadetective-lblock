
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Database, FileText } from 'lucide-react';
import { ParsedData } from '@/utils/dataParser';

interface SuccessDisplayProps {
  data?: ParsedData;
}

const SuccessDisplay: React.FC<SuccessDisplayProps> = ({ data }) => {
  if (!data) return null;

  return (
    <div className="max-w-2xl mx-auto mt-8">
      <Card className="bg-green-50 border-green-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-700">
            <CheckCircle className="w-5 h-5" />
            Upload Successful!
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4 text-blue-600" />
              <span className="text-sm text-gray-700">
                {data.summary.totalRows.toLocaleString()} rows processed
              </span>
            </div>
            <div className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-600" />
              <span className="text-sm text-gray-700">
                {data.summary.totalColumns} columns detected
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SuccessDisplay;
