
/**
 * Column Identification Step Component
 * Refactored to meet coding standards with proper constants and semantic styling
 */

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { ArrowRight, ArrowLeft, CheckCircle, User, Calendar, Activity, Lightbulb, Tag } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { SPACING, TEXT_SIZES, ICON_SIZES, CONFIDENCE_LEVELS } from '@/constants/ui';

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
  const availableColumns = parsedData.length > 0 && parsedData[0].columns 
    ? parsedData[0].columns.map(col => col.name)
    : [];

  const handleMappingChange = (key: keyof ColumnMapping, value: string | string[]) => {
    const newMapping = { ...mapping, [key]: value };
    setMapping(newMapping);
    onColumnMappingComplete(newMapping);
  };

  const getColumnSample = (columnName: string) => {
    const MAX_SAMPLE_LENGTH = 50;
    if (parsedData.length > 0 && parsedData[0].rows && parsedData[0].rows.length > 0) {
      const sample = parsedData[0].rows[0][columnName];
      return sample?.toString().substring(0, MAX_SAMPLE_LENGTH) || 'N/A';
    }
    return 'N/A';
  };

  const isNumericColumn = (columnName: string) => {
    const NUMERIC_THRESHOLD = 0.8; // 80% or more are numeric
    const SAMPLE_SIZE = 5;
    
    if (parsedData.length > 0 && parsedData[0].rows && parsedData[0].rows.length > 0) {
      const samples = parsedData[0].rows.slice(0, SAMPLE_SIZE).map(row => row[columnName]);
      const numericSamples = samples.filter(sample => {
        const num = Number(sample);
        return !isNaN(num) && isFinite(num) && sample !== '' && sample !== null;
      });
      return numericSamples.length >= samples.length * NUMERIC_THRESHOLD;
    }
    return false;
  };

  const getColumnRecommendations = () => {
    const recommendations = [];
    
    availableColumns.forEach(column => {
      const lowerColumn = column.toLowerCase();
      const sample = getColumnSample(column);
      const isNumeric = isNumericColumn(column);
      
      if (isNumeric) {
        // Revenue/Money related
        if (/revenue|sales|price|cost|amount|total|value|fee|payment/.test(lowerColumn)) {
          recommendations.push({
            column,
            type: 'revenue',
            reason: 'Contains monetary values - great for revenue analysis',
            priority: 'high',
            sample
          });
        }
        // Count/Quantity related
        else if (/count|quantity|qty|number|volume|size/.test(lowerColumn)) {
          recommendations.push({
            column,
            type: 'quantity',
            reason: 'Contains quantities - useful for volume analysis',
            priority: 'high',
            sample
          });
        }
        // General numeric
        else {
          recommendations.push({
            column,
            type: 'metric',
            reason: 'Numeric data - can be analyzed for trends and patterns',
            priority: 'medium',
            sample
          });
        }
      }
      // Category columns
      else if (/category|type|status|segment|group|department|region/.test(lowerColumn)) {
        recommendations.push({
          column,
          type: 'category',
          reason: 'Contains categories - perfect for grouping and segmentation',
          priority: 'high',
          sample
        });
      }
    });

    return recommendations.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  };

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const steps = [
    { number: 1, title: "Who", icon: User, description: "Who performed the actions?" },
    { number: 2, title: "When", icon: Calendar, description: "When did actions happen?" },
    { number: 3, title: "What", icon: Activity, description: "What actions were taken?" },
    { number: 4, title: "Categories", icon: Tag, description: "How to group your data?" }
  ];

  const recommendations = getColumnRecommendations();

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="text-center mb-6">
              <User className={`w-12 h-12 text-primary mx-auto mb-${SPACING.SM}`} />
              <h3 className={`${TEXT_SIZES.LARGE} font-semibold`}>Step 1: Who</h3>
              <p className="text-muted-foreground">Which column identifies who performed the actions?</p>
              <p className={`${TEXT_SIZES.SMALL} text-muted-foreground mt-${SPACING.SM}`}>Examples: Customer ID, User ID, Email, Account Number</p>
            </div>
            
            <Card className="bg-primary/10 border-primary/20">
              <CardContent className={`pt-${SPACING.LG}`}>
                <Label>Select the column that identifies users (Optional)</Label>
                <Select onValueChange={(value) => handleMappingChange('userIdColumn', value === 'none' ? undefined : value)}>
                  <SelectTrigger className={`mt-${SPACING.SM}`}>
                    <SelectValue placeholder="Choose a column..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Skip - No user column</SelectItem>
                    {availableColumns.map(column => (
                      <SelectItem key={column} value={column}>
                        <div className="flex flex-col items-start">
                          <span className="font-medium">{column}</span>
                          <span className={`${TEXT_SIZES.SMALL} text-muted-foreground`}>Example: {getColumnSample(column)}</span>
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
              <h3 className="text-xl font-semibold">Step 2: When</h3>
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
              <h3 className="text-xl font-semibold">Step 3: What</h3>
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
              <Lightbulb className="w-12 h-12 text-orange-600 mx-auto mb-3" />
              <h3 className="text-xl font-semibold">Step 4: Smart Recommendations</h3>
              <p className="text-gray-600">We've analyzed your data and found these interesting columns</p>
              <p className="text-sm text-gray-500 mt-2">Select any that look relevant to your analysis</p>
            </div>
            
            <Card className="bg-orange-50 border-orange-200">
              <CardContent className="pt-6">
                {recommendations.length > 0 ? (
                  <div className="space-y-3">
                    <Label className="mb-3 block">Recommended columns for analysis:</Label>
                    {recommendations.map((rec, index) => (
                      <div
                        key={rec.column}
                        className={`p-4 border rounded-lg cursor-pointer transition-all ${
                          (rec.type === 'category' ? mapping.categoryColumns : mapping.valueColumns).includes(rec.column)
                            ? 'bg-orange-200 border-orange-400 text-orange-800'
                            : 'bg-white border-gray-200 hover:border-orange-300'
                        }`}
                        onClick={() => {
                          const targetArray = rec.type === 'category' ? 'categoryColumns' : 'valueColumns';
                          const currentArray = mapping[targetArray];
                          const newColumns = currentArray.includes(rec.column)
                            ? currentArray.filter(c => c !== rec.column)
                            : [...currentArray, rec.column];
                          handleMappingChange(targetArray, newColumns);
                        }}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium">{rec.column}</span>
                              <Badge 
                                variant="secondary" 
                                className={`text-xs ${rec.priority === 'high' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}
                              >
                                {rec.priority} priority
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{rec.reason}</p>
                            <p className="text-xs text-gray-500">Example: {rec.sample}</p>
                          </div>
                          {(rec.type === 'category' ? mapping.categoryColumns : mapping.valueColumns).includes(rec.column) && (
                            <CheckCircle className="w-5 h-5 text-orange-600 ml-2 flex-shrink-0" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p>No specific recommendations found for this dataset.</p>
                    <p className="text-sm mt-1">You can still proceed with the analysis.</p>
                  </div>
                )}
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
        
        {currentStep < 4 ? (
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
                  <Lightbulb className="w-4 h-4 text-orange-600" />
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
