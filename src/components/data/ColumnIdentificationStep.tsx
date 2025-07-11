
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { ArrowRight, ArrowLeft, CheckCircle, User, Calendar, Activity, Hash, Tag } from 'lucide-react';
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
  const [currentStep, setCurrentStep] = useState(1);
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

  const getColumnSample = (columnName: string) => {
    if (parsedData.length > 0 && parsedData[0].data && parsedData[0].data.length > 0) {
      const sample = parsedData[0].data[0][columnName];
      return sample?.toString().substring(0, 50) || 'N/A';
    }
    return 'N/A';
  };

  const nextStep = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const steps = [
    { number: 1, title: "User Information", icon: User, description: "Who performed the actions?" },
    { number: 2, title: "Time Information", icon: Calendar, description: "When did actions happen?" },
    { number: 3, title: "Action Information", icon: Activity, description: "What actions were taken?" },
    { number: 4, title: "Numbers to Analyze", icon: Hash, description: "What numbers do you want to analyze?" },
    { number: 5, title: "Categories & Groups", icon: Tag, description: "How do you want to group your data?" }
  ];

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <User className="w-12 h-12 text-blue-600 mx-auto mb-3" />
              <h3 className="text-xl font-semibold">Step 1: User Information</h3>
              <p className="text-gray-600">Which column identifies who performed the actions?</p>
              <p className="text-sm text-gray-500 mt-2">Examples: Customer ID, User ID, Email, Account Number</p>
            </div>
            
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="pt-6">
                <Label>Select the column that identifies users (Optional)</Label>
                <Select onValueChange={(value) => handleMappingChange('userIdColumn', value === 'none' ? undefined : value)}>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Choose a column..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Skip - No user column</SelectItem>
                    {availableColumns.map(column => (
                      <SelectItem key={column} value={column}>
                        <div className="flex flex-col items-start">
                          <span className="font-medium">{column}</span>
                          <span className="text-xs text-gray-500">Example: {getColumnSample(column)}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <Calendar className="w-12 h-12 text-green-600 mx-auto mb-3" />
              <h3 className="text-xl font-semibold">Step 2: Time Information</h3>
              <p className="text-gray-600">Which column shows when actions happened?</p>
              <p className="text-sm text-gray-500 mt-2">Examples: Date, Timestamp, Created At, Order Date</p>
            </div>
            
            <Card className="bg-green-50 border-green-200">
              <CardContent className="pt-6">
                <Label>Select the column with dates/times (Optional)</Label>
                <Select onValueChange={(value) => handleMappingChange('timestampColumn', value === 'none' ? undefined : value)}>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Choose a column..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Skip - No time column</SelectItem>
                    {availableColumns.map(column => (
                      <SelectItem key={column} value={column}>
                        <div className="flex flex-col items-start">
                          <span className="font-medium">{column}</span>
                          <span className="text-xs text-gray-500">Example: {getColumnSample(column)}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <Activity className="w-12 h-12 text-purple-600 mx-auto mb-3" />
              <h3 className="text-xl font-semibold">Step 3: Action Information</h3>
              <p className="text-gray-600">Which column describes what action was taken?</p>
              <p className="text-sm text-gray-500 mt-2">Examples: Event Type, Action, Activity, Purchase Type</p>
            </div>
            
            <Card className="bg-purple-50 border-purple-200">
              <CardContent className="pt-6">
                <Label>Select the column with actions/events (Optional)</Label>
                <Select onValueChange={(value) => handleMappingChange('eventColumn', value === 'none' ? undefined : value)}>
                  <SelectTrigger className="mt-2">
                    <SelectValue placeholder="Choose a column..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Skip - No action column</SelectItem>
                    {availableColumns.map(column => (
                      <SelectItem key={column} value={column}>
                        <div className="flex flex-col items-start">
                          <span className="font-medium">{column}</span>
                          <span className="text-xs text-gray-500">Example: {getColumnSample(column)}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <Hash className="w-12 h-12 text-orange-600 mx-auto mb-3" />
              <h3 className="text-xl font-semibold">Step 4: Numbers to Analyze</h3>
              <p className="text-gray-600">Which columns contain numbers you want to analyze?</p>
              <p className="text-sm text-gray-500 mt-2">Examples: Sales Amount, Quantity, Price, Revenue, Count</p>
            </div>
            
            <Card className="bg-orange-50 border-orange-200">
              <CardContent className="pt-6">
                <Label className="mb-3 block">Click on columns that contain numbers you want to analyze:</Label>
                <div className="grid grid-cols-2 gap-2">
                  {availableColumns.map(column => (
                    <div
                      key={column}
                      className={`p-3 border rounded-lg cursor-pointer transition-all ${
                        mapping.valueColumns.includes(column)
                          ? 'bg-orange-200 border-orange-400 text-orange-800'
                          : 'bg-white border-gray-200 hover:border-orange-300'
                      }`}
                      onClick={() => {
                        const newColumns = mapping.valueColumns.includes(column)
                          ? mapping.valueColumns.filter(c => c !== column)
                          : [...mapping.valueColumns, column];
                        handleMappingChange('valueColumns', newColumns);
                      }}
                    >
                      <div className="font-medium">{column}</div>
                      <div className="text-xs text-gray-600">Example: {getColumnSample(column)}</div>
                      {mapping.valueColumns.includes(column) && (
                        <CheckCircle className="w-4 h-4 text-orange-600 mt-1" />
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 5:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <Tag className="w-12 h-12 text-teal-600 mx-auto mb-3" />
              <h3 className="text-xl font-semibold">Step 5: Categories & Groups</h3>
              <p className="text-gray-600">Which columns help you group or categorize your data?</p>
              <p className="text-sm text-gray-500 mt-2">Examples: Product Category, Region, Department, Status</p>
            </div>
            
            <Card className="bg-teal-50 border-teal-200">
              <CardContent className="pt-6">
                <Label className="mb-3 block">Click on columns that contain categories or groups:</Label>
                <div className="grid grid-cols-2 gap-2">
                  {availableColumns.map(column => (
                    <div
                      key={column}
                      className={`p-3 border rounded-lg cursor-pointer transition-all ${
                        mapping.categoryColumns.includes(column)
                          ? 'bg-teal-200 border-teal-400 text-teal-800'
                          : 'bg-white border-gray-200 hover:border-teal-300'
                      }`}
                      onClick={() => {
                        const newColumns = mapping.categoryColumns.includes(column)
                          ? mapping.categoryColumns.filter(c => c !== column)
                          : [...mapping.categoryColumns, column];
                        handleMappingChange('categoryColumns', newColumns);
                      }}
                    >
                      <div className="font-medium">{column}</div>
                      <div className="text-xs text-gray-600">Example: {getColumnSample(column)}</div>
                      {mapping.categoryColumns.includes(column) && (
                        <CheckCircle className="w-4 h-4 text-teal-600 mt-1" />
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Let's Understand Your Data</h2>
        <p className="text-gray-600">We'll walk through this step by step - it's easier than it looks!</p>
      </div>

      {/* Progress indicator */}
      <div className="flex justify-center mb-8">
        <div className="flex items-center space-x-4">
          {steps.map((step, index) => (
            <div key={step.number} className="flex items-center">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                currentStep >= step.number 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-500'
              }`}>
                {currentStep > step.number ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  <step.icon className="w-5 h-5" />
                )}
              </div>
              {index < steps.length - 1 && (
                <div className={`w-8 h-0.5 mx-2 ${
                  currentStep > step.number ? 'bg-blue-600' : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>
      </div>

      {renderStepContent()}

      {/* Step Navigation */}
      <div className="flex justify-between pt-6">
        <Button 
          variant="outline" 
          onClick={currentStep === 1 ? onPrevious : prevStep}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          {currentStep === 1 ? 'Back to Data' : 'Previous Step'}
        </Button>
        
        {currentStep < 5 ? (
          <Button onClick={nextStep} className="bg-blue-600 hover:bg-blue-700">
            Next Step
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        ) : (
          <Button onClick={onNext} className="bg-green-600 hover:bg-green-700">
            Complete Setup
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        )}
      </div>

      {/* Summary card at the bottom */}
      {(mapping.userIdColumn || mapping.timestampColumn || mapping.eventColumn || 
        mapping.valueColumns.length > 0 || mapping.categoryColumns.length > 0) && (
        <Card className="bg-gray-50 border-gray-200 mt-6">
          <CardContent className="pt-6">
            <h4 className="font-medium text-gray-900 mb-3">Your Data Setup:</h4>
            <div className="space-y-1 text-sm">
              {mapping.userIdColumn && (
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-blue-600" />
                  <span><strong>Users:</strong> {mapping.userIdColumn}</span>
                </div>
              )}
              {mapping.timestampColumn && (
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-green-600" />
                  <span><strong>Time:</strong> {mapping.timestampColumn}</span>
                </div>
              )}
              {mapping.eventColumn && (
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-purple-600" />
                  <span><strong>Actions:</strong> {mapping.eventColumn}</span>
                </div>
              )}
              {mapping.valueColumns.length > 0 && (
                <div className="flex items-center gap-2">
                  <Hash className="w-4 h-4 text-orange-600" />
                  <span><strong>Numbers:</strong> {mapping.valueColumns.join(', ')}</span>
                </div>
              )}
              {mapping.categoryColumns.length > 0 && (
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4 text-teal-600" />
                  <span><strong>Categories:</strong> {mapping.categoryColumns.join(', ')}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ColumnIdentificationStep;
