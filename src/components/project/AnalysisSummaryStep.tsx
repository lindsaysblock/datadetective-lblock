
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Play, GraduationCap, Database, Settings, FileText } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { ColumnMapping } from '../data/ColumnIdentificationStep';

interface AnalysisSummaryStepProps {
  researchQuestion: string;
  additionalContext: string;
  parsedData: any[];
  columnMapping: ColumnMapping;
  onStartAnalysis: (educational?: boolean) => void;
  onPrevious: () => void;
}

const AnalysisSummaryStep: React.FC<AnalysisSummaryStepProps> = ({
  researchQuestion,
  additionalContext,
  parsedData,
  columnMapping,
  onStartAnalysis,
  onPrevious
}) => {
  const totalRows = parsedData.reduce((sum, data) => sum + (data.rows || 0), 0);
  const totalFiles = parsedData.length;

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Ready to Analyze</h2>
        <p className="text-gray-600">Review your project setup and start the analysis</p>
      </div>

      {/* Research Question */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            Research Question
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-800 font-medium">{researchQuestion}</p>
        </CardContent>
      </Card>

      {/* Data Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5 text-green-600" />
            Data Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-500">Total Files</p>
              <p className="text-2xl font-bold text-gray-900">{totalFiles}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Rows</p>
              <p className="text-2xl font-bold text-gray-900">{totalRows.toLocaleString()}</p>
            </div>
          </div>
          
          {parsedData.map((data, index) => (
            <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
              <span className="text-sm font-medium">{data.name}</span>
              <span className="text-xs text-gray-500">{data.rows} rows × {data.columns} cols</span>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Column Mapping Summary */}
      {(columnMapping.userIdColumn || columnMapping.timestampColumn || columnMapping.eventColumn || 
        columnMapping.valueColumns.length > 0 || columnMapping.categoryColumns.length > 0) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5 text-purple-600" />
              Column Identification
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {columnMapping.userIdColumn && columnMapping.userIdColumn !== 'none' && (
              <div>
                <span className="text-sm text-gray-500">User ID Column:</span>
                <Badge variant="outline" className="ml-2">{columnMapping.userIdColumn}</Badge>
              </div>
            )}
            {columnMapping.timestampColumn && columnMapping.timestampColumn !== 'none' && (
              <div>
                <span className="text-sm text-gray-500">Timestamp Column:</span>
                <Badge variant="outline" className="ml-2">{columnMapping.timestampColumn}</Badge>
              </div>
            )}
            {columnMapping.eventColumn && columnMapping.eventColumn !== 'none' && (
              <div>
                <span className="text-sm text-gray-500">Event Column:</span>
                <Badge variant="outline" className="ml-2">{columnMapping.eventColumn}</Badge>
              </div>
            )}
            {columnMapping.valueColumns.length > 0 && (
              <div>
                <span className="text-sm text-gray-500">Value Columns:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {columnMapping.valueColumns.map(col => (
                    <Badge key={col} variant="secondary">{col}</Badge>
                  ))}
                </div>
              </div>
            )}
            {columnMapping.categoryColumns.length > 0 && (
              <div>
                <span className="text-sm text-gray-500">Category Columns:</span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {columnMapping.categoryColumns.map(col => (
                    <Badge key={col} variant="secondary">{col}</Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Additional Context */}
      {additionalContext && (
        <Card>
          <CardHeader>
            <CardTitle>Additional Context</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700">{additionalContext}</p>
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Button
          onClick={() => onStartAnalysis(false)}
          size="lg"
          className="h-16 bg-blue-600 hover:bg-blue-700"
        >
          <Play className="w-5 h-5 mr-2" />
          <div className="text-left">
            <div className="font-semibold">Start Analysis</div>
            <div className="text-xs opacity-90">Quick analysis results</div>
          </div>
        </Button>

        <Button
          onClick={() => onStartAnalysis(true)}
          size="lg"
          variant="outline"
          className="h-16 border-purple-200 hover:bg-purple-50"
        >
          <GraduationCap className="w-5 h-5 mr-2 text-purple-600" />
          <div className="text-left">
            <div className="font-semibold">Educational Mode</div>
            <div className="text-xs text-gray-500">Step-by-step explanation</div>
          </div>
        </Button>
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-6">
        <Button variant="outline" onClick={onPrevious}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>
        <div></div>
      </div>
    </div>
  );
};

export default AnalysisSummaryStep;
