
import React, { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Play, FileText, Database, Users, Calendar } from 'lucide-react';
import DataDetectiveLogo from '@/components/DataDetectiveLogo';

interface AnalysisSummaryStepProps {
  researchQuestion: string;
  additionalContext: string;
  parsedData: any[];
  columnMapping: Record<string, string>;
  analysisResults?: any;
  analysisCompleted: boolean;
  isProcessingAnalysis: boolean;
  onStartAnalysis: (educationalMode: boolean, projectName: string) => void;
  onPrevious: () => void;
  formData: any;
  projectName?: string;
  onProjectNameChange?: (value: string) => void;
}

const AnalysisSummaryStep: React.FC<AnalysisSummaryStepProps> = ({
  researchQuestion,
  additionalContext,
  parsedData,
  columnMapping,
  analysisResults,
  analysisCompleted,
  isProcessingAnalysis,
  onStartAnalysis,
  onPrevious,
  formData,
  projectName: propProjectName,
  onProjectNameChange: propOnProjectNameChange
}) => {
  const [educationalMode, setEducationalMode] = React.useState(false);
  const [caseNameValue, setCaseNameValue] = React.useState('');

  // Simple logging
  console.log('🔍 Simple case name value:', caseNameValue);

  // Initialize with default if empty
  React.useEffect(() => {
    if (!caseNameValue && researchQuestion) {
      const defaultName = `Analysis: ${researchQuestion.substring(0, 30)}${researchQuestion.length > 30 ? '...' : ''}`;
      setCaseNameValue(defaultName);
    }
  }, [caseNameValue, researchQuestion]);

  const handleCaseNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    console.log('📝 NEW HANDLER - TYPING:', newValue);
    setCaseNameValue(newValue);
    e.stopPropagation(); // Prevent any interference
  };

  const handleStartAnalysis = () => {
    const finalProjectName = caseNameValue?.trim();
    
    console.log('🎯 [BUTTON] Start Analysis clicked with debug info:', {
      hasResearchQuestion: !!researchQuestion,
      researchQuestionText: researchQuestion,
      hasCaseName: !!finalProjectName,
      caseNameText: finalProjectName,
      hasParsedData: !!parsedData,
      parsedDataLength: parsedData?.length || 0,
      isProcessingAnalysis,
      buttonShouldBeDisabled: !researchQuestion || !finalProjectName || !parsedData || parsedData.length === 0 || isProcessingAnalysis
    });

    if (!finalProjectName) {
      console.error('❌ No project name provided');
      alert('Please enter a project name');
      return;
    }

    if (!researchQuestion?.trim()) {
      console.error('❌ No research question provided');
      alert('Please enter a research question');
      return;
    }

    console.log('🔍 [STEP 2] About to check parsedData...');

    console.log('🔍 [CRITICAL] Checking parsedData existence:', {
      hasParsedData: !!parsedData,
      parsedDataType: typeof parsedData,
      parsedDataLength: parsedData?.length,
      isArray: Array.isArray(parsedData),
      parsedDataValue: parsedData,
      firstDataItem: parsedData?.[0],
      firstDataItemKeys: parsedData?.[0] ? Object.keys(parsedData[0]) : 'No first item',
      firstDataItemStructure: parsedData?.[0] ? {
        hasRows: !!parsedData[0].rows,
        hasColumns: !!parsedData[0].columns, 
        hasSummary: !!parsedData[0].summary,
        summaryStructure: parsedData[0].summary ? Object.keys(parsedData[0].summary) : 'No summary'
      } : 'No structure'
    });

    if (!parsedData || parsedData.length === 0) {
      console.error('❌ No data available - STOPPING HERE');
      console.error('❌ parsedData details:', { parsedData, length: parsedData?.length });
      alert('Please upload data before starting analysis');
      return;
    }

    console.log('✅ parsedData check passed, proceeding to structure validation...');

    // Validate data structure - enhanced debugging
    console.log('🔍 Starting detailed data structure validation...');
    console.log('🔍 Raw parsedData:', parsedData);
    
    const hasValidData = parsedData && parsedData.length > 0 && parsedData.some(data => {
      console.log('🔍 Validating individual data item:', data);
      
      const hasRowCount = data?.rowCount && data.rowCount > 0;
      const hasRowsArray = data?.rows && Array.isArray(data.rows) && data.rows.length > 0;
      const hasColumns = data?.columns && Array.isArray(data.columns) && data.columns.length > 0;
      
      const isValidStructure = data && (hasRowCount || hasRowsArray) && hasColumns;
      
      console.log('🔍 Data validation details:', { 
        hasData: !!data,
        hasRowCount,
        hasRowsArray,
        hasColumns,
        rowCount: data?.rowCount,
        rowsLength: data?.rows?.length,
        columnsLength: data?.columns?.length,
        isValid: isValidStructure,
        dataKeys: data ? Object.keys(data) : 'No data object'
      });
      
      return isValidStructure;
    });
    
    console.log('🔍 Final validation result:', hasValidData);

    if (!hasValidData) {
      console.error('❌ Data structure validation failed!');
      console.error('❌ Invalid data structure details:', parsedData);
      alert('The uploaded data appears to be corrupted or empty. Please try uploading again.');
      return;
    }

    console.log('✅ All validation passed! Calling onStartAnalysis...');
    console.log('🔍 About to call onStartAnalysis with:', { educationalMode: false, projectName: finalProjectName });
    
    try {
      console.log('🚀 CALLING onStartAnalysis NOW...');
      onStartAnalysis(false, finalProjectName);
      console.log('✅ onStartAnalysis called successfully');
    } catch (error) {
      console.error('❌ Error starting analysis:', error);
      alert('An error occurred while starting the analysis. Please try again.');
    }
  };

  const totalRows = parsedData?.reduce((sum, data) => sum + (data.rowCount || data.rows || 0), 0) || 0;
  const totalFiles = parsedData?.length || 0;

  return (
    <div className="space-y-6 p-6 bg-gradient-to-br from-brand-blue/5 to-brand-purple/5 rounded-xl">
      {/* Header with Logo */}
      <div className="text-center">
        <div className="flex justify-center mb-6">
          <DataDetectiveLogo size="xl" showText={true} animated={true} />
        </div>
        <h2 className="text-3xl font-bold bg-gradient-to-r from-brand-blue via-brand-purple to-brand-pink bg-clip-text text-transparent mb-2">
          🕵️ Investigation Summary
        </h2>
        <p className="text-muted-foreground text-lg">Review your case details before starting the investigation</p>
      </div>

      {/* Project Name Input */}
      <Card className="border-2 border-brand-blue/20 bg-gradient-to-br from-white to-brand-blue/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-brand-blue" />
            <span className="bg-gradient-to-r from-brand-blue via-brand-purple to-brand-pink bg-clip-text text-transparent">
              🕵️ Case Name
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="projectName">Give your investigation a memorable name</Label>
            <input
              id="projectName"
              type="text"
              value={caseNameValue}
              onChange={handleCaseNameChange}
              placeholder="Type your case name here..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              autoComplete="off"
              autoFocus
            />
            {!caseNameValue && (
              <p className="text-sm text-red-600">Case name is required to start investigation</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Research Question Summary */}
      <Card className="border-l-4 border-l-brand-blue bg-gradient-to-r from-white to-brand-blue/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5 text-brand-blue" />
            <span className="bg-gradient-to-r from-brand-blue via-brand-purple to-brand-pink bg-clip-text text-transparent">
              🔍 Research Question
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-foreground font-medium">{researchQuestion || 'No research question provided'}</p>
          {additionalContext && (
            <div className="mt-3 pt-3 border-t border-brand-purple/20">
              <h4 className="font-medium text-foreground mb-1">Additional Context:</h4>
              <p className="text-muted-foreground text-sm">{additionalContext}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Data Summary */}
      <Card className="border-l-4 border-l-brand-purple bg-gradient-to-r from-white to-brand-purple/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-brand-purple" />
            <span className="bg-gradient-to-r from-brand-blue via-brand-purple to-brand-pink bg-clip-text text-transparent">
              📊 Evidence Overview
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div className="text-center p-3 bg-gradient-to-br from-brand-blue/10 to-brand-blue/20 rounded-lg border border-brand-blue/20">
              <div className="text-2xl font-bold text-brand-blue">{totalFiles}</div>
              <div className="text-sm text-brand-blue">Evidence Files</div>
            </div>
            <div className="text-center p-3 bg-gradient-to-br from-green-500/10 to-green-500/20 rounded-lg border border-green-500/20">
              <div className="text-2xl font-bold text-green-600">{totalRows.toLocaleString()}</div>
              <div className="text-sm text-green-600">Total Records</div>
            </div>
            <div className="text-center p-3 bg-gradient-to-br from-brand-purple/10 to-brand-purple/20 rounded-lg border border-brand-purple/20">
              <div className="text-2xl font-bold text-brand-purple">
                {(() => {
                  const firstData = parsedData?.[0];
                  if (!firstData) return 0;
                  
                  if (Array.isArray(firstData.columnInfo)) {
                    return firstData.columnInfo.length;
                  }
                  
                  if (Array.isArray(firstData.columns)) {
                    return firstData.columns.length;
                  }
                  
                  if (typeof firstData.columns === 'number') {
                    return firstData.columns;
                  }
                  
                  return 0;
                })()}
              </div>
              <div className="text-sm text-brand-purple">Data Points</div>
            </div>
            <div className="text-center p-3 bg-gradient-to-br from-orange-500/10 to-orange-500/20 rounded-lg border border-orange-500/20">
              <div className="text-2xl font-bold text-orange-600">
                {Object.keys(columnMapping || {}).length}
              </div>
              <div className="text-sm text-orange-600">Mapped Fields</div>
            </div>
          </div>

          {parsedData && parsedData.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-medium text-foreground flex items-center gap-2">
                <FileText className="w-4 h-4 text-brand-blue" />
                📋 Files to Investigate:
              </h4>
              {parsedData.map((data, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gradient-to-r from-background to-brand-blue/5 rounded-lg border border-brand-blue/20">
                  <div className="flex items-center gap-3">
                    <FileText className="w-4 h-4 text-brand-blue" />
                    <div>
                      <div className="font-medium text-sm text-foreground">{data.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {(data.rowCount || data.rows || 0).toLocaleString()} records • {
                            (() => {
                              if (Array.isArray(data.columnInfo)) {
                                return data.columnInfo.length;
                              }
                              
                              if (Array.isArray(data.columns)) {
                                return data.columns.length;
                              }
                              
                              if (typeof data.columns === 'number') {
                                return data.columns;
                              }
                              
                              return 0;
                            })()
                          } data points
                        </div>
                    </div>
                  </div>
                  <Badge variant="secondary" className="bg-green-500/10 text-green-600 border-green-500/20">
                    🔍 Ready for Analysis
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Analysis Options */}
      <Card className="border-l-4 border-l-brand-pink bg-gradient-to-r from-white to-brand-pink/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-brand-pink" />
            <span className="bg-gradient-to-r from-brand-blue via-brand-purple to-brand-pink bg-clip-text text-transparent">
              ⚙️ Investigation Options
            </span>
          </CardTitle>
          <CardDescription>
            Choose your detective approach for this case
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 p-3 bg-gradient-to-r from-brand-purple/5 to-brand-pink/5 rounded-lg border border-brand-purple/20">
            <input
              type="checkbox"
              id="educational"
              checked={educationalMode}
              onChange={(e) => setEducationalMode(e.target.checked)}
              className="rounded border-brand-purple/50 text-brand-purple focus:ring-brand-purple"
            />
            <Label htmlFor="educational" className="text-sm font-medium">
              📚 Educational Mode - Teach me how to code SQL step by step during the investigation
            </Label>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-between pt-6">
        <Button variant="outline" onClick={onPrevious} className="flex items-center gap-2 hover:bg-muted">
          <ArrowLeft className="w-4 h-4" />
          Previous
        </Button>
        
        <Button 
          onClick={handleStartAnalysis}
          disabled={!researchQuestion || !caseNameValue?.trim() || !parsedData || parsedData.length === 0 || isProcessingAnalysis}
          className="bg-gradient-to-r from-brand-blue via-brand-purple to-brand-pink hover:from-brand-blue/90 hover:via-brand-purple/90 hover:to-brand-pink/90 text-white flex items-center gap-2 px-8 py-2 shadow-lg hover:shadow-xl transition-all duration-200"
        >
          <Play className="w-4 h-4" />
          {isProcessingAnalysis ? '🔍 Starting the Case...' : '🕵️ Start the Case'}
        </Button>
      </div>
    </div>
  );
};

export default AnalysisSummaryStep;
