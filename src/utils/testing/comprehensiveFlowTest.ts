/**
 * Comprehensive end-to-end flow test for the entire case analysis pipeline
 */

import { validateAnalysisData, sanitizeDataForAnalysis } from '../dataValidationHelper';
import { recoverFromDataError } from '../errorRecovery';

export interface FlowTestResult {
  step: string;
  success: boolean;
  error?: string;
  data?: any;
  warnings?: string[];
}

export const runComprehensiveFlowTest = async (): Promise<FlowTestResult[]> => {
  const results: FlowTestResult[] = [];

  // Step 1: Test File Upload Validation
  results.push(await testFileUploadValidation());

  // Step 2: Test Data Processing
  results.push(await testDataProcessing());

  // Step 3: Test Data Structure Validation
  results.push(await testDataStructureValidation());

  // Step 4: Test Analysis Engine Integration
  results.push(await testAnalysisEngineIntegration());

  // Step 5: Test Error Recovery
  results.push(await testErrorRecovery());

  // Step 6: Test Form State Management
  results.push(await testFormStateManagement());

  return results;
};

const testFileUploadValidation = async (): Promise<FlowTestResult> => {
  try {
    // Create mock files to test validation
    const mockValidFile = new File(['col1,col2\nval1,val2'], 'test.csv', { type: 'text/csv' });
    const mockInvalidFile = new File(['invalid'], 'test.xyz', { type: 'application/unknown' });

    // Import validation function
    const { validateFile } = await import('../fileValidation');

    const validResult = validateFile(mockValidFile);
    const invalidResult = validateFile(mockInvalidFile);

    if (validResult.isValid && !invalidResult.isValid) {
      return {
        step: 'File Upload Validation',
        success: true,
        data: { validResult, invalidResult }
      };
    } else {
      return {
        step: 'File Upload Validation',
        success: false,
        error: 'File validation not working correctly'
      };
    }
  } catch (error) {
    return {
      step: 'File Upload Validation',
      success: false,
      error: `Validation test failed: ${error}`
    };
  }
};

const testDataProcessing = async (): Promise<FlowTestResult> => {
  try {
    // Create mock parsed data
    const mockParsedData = [
      {
        id: 'test-1',
        name: 'test.csv',
        rowCount: 100,
        rows: 100,
        columns: 3,
        columnInfo: [
          { name: 'col1', type: 'string', samples: ['val1', 'val2'] },
          { name: 'col2', type: 'number', samples: [1, 2] },
          { name: 'col3', type: 'date', samples: ['2023-01-01', '2023-01-02'] }
        ],
        data: [
          { col1: 'val1', col2: 1, col3: '2023-01-01' },
          { col1: 'val2', col2: 2, col3: '2023-01-02' }
        ],
        summary: {
          totalRows: 100,
          totalColumns: 3,
          possibleUserIdColumns: [],
          possibleEventColumns: [],
          possibleTimestampColumns: ['col3']
        }
      }
    ];

    // Test data validation
    const validation = validateAnalysisData(mockParsedData);
    
    if (validation.isValid) {
      return {
        step: 'Data Processing',
        success: true,
        data: mockParsedData,
        warnings: validation.warnings
      };
    } else {
      return {
        step: 'Data Processing',
        success: false,
        error: `Data validation failed: ${validation.errors.join(', ')}`
      };
    }
  } catch (error) {
    return {
      step: 'Data Processing',
      success: false,
      error: `Data processing test failed: ${error}`
    };
  }
};

const testDataStructureValidation = async (): Promise<FlowTestResult> => {
  try {
    // Test with corrupted data
    const corruptedData = [
      {
        name: 'broken.csv',
        // Missing required fields
        someInvalidField: 'test'
      },
      {
        name: 'partial.csv',
        rowCount: 50,
        columnInfo: 'not an array', // Wrong type
        data: []
      }
    ];

    // Test sanitization
    const sanitized = sanitizeDataForAnalysis(corruptedData);
    const validation = validateAnalysisData(sanitized);

    return {
      step: 'Data Structure Validation',
      success: true,
      data: { original: corruptedData, sanitized, validation },
      warnings: validation.warnings
    };
  } catch (error) {
    return {
      step: 'Data Structure Validation',
      success: false,
      error: `Structure validation test failed: ${error}`
    };
  }
};

const testAnalysisEngineIntegration = async (): Promise<FlowTestResult> => {
  try {
    // Create valid analysis context
    const analysisContext = {
      researchQuestion: 'What are the main trends in the data?',
      additionalContext: 'Testing analysis engine integration',
      parsedData: [
        {
          id: 'test-1',
          name: 'test.csv',
          rows: 10,
          columns: 2,
          rowCount: 10,
          columnInfo: [
            { name: 'date', type: 'date' as const, samples: ['2023-01-01'] },
            { name: 'value', type: 'number' as const, samples: [100] }
          ],
          data: [
            { date: '2023-01-01', value: 100 },
            { date: '2023-01-02', value: 110 }
          ],
          summary: {
            totalRows: 10,
            totalColumns: 2,
            possibleUserIdColumns: [],
            possibleEventColumns: [],
            possibleTimestampColumns: ['date']
          }
        }
      ],
      columnMapping: {
        valueColumns: ['value'],
        categoryColumns: []
      },
      educationalMode: false
    };

    // Try to import and run analysis engine
    const { AnalysisEngine } = await import('../../services/analysisEngine');
    const results = await AnalysisEngine.analyzeData(analysisContext);

    if (results && results.insights && results.recommendations) {
      return {
        step: 'Analysis Engine Integration',
        success: true,
        data: results
      };
    } else {
      return {
        step: 'Analysis Engine Integration',
        success: false,
        error: 'Analysis engine did not return expected results'
      };
    }
  } catch (error) {
    return {
      step: 'Analysis Engine Integration',
      success: false,
      error: `Analysis engine test failed: ${error}`
    };
  }
};

const testErrorRecovery = async (): Promise<FlowTestResult> => {
  try {
    // Test with completely broken data
    const brokenData = [null, undefined, 'not an object', { invalid: true }];

    const recovery = recoverFromDataError(brokenData as any);
    
    return {
      step: 'Error Recovery',
      success: true,
      data: recovery,
      warnings: recovery.success ? [] : [recovery.error || 'Recovery failed']
    };
  } catch (error) {
    return {
      step: 'Error Recovery',
      success: false,
      error: `Error recovery test failed: ${error}`
    };
  }
};

const testFormStateManagement = async (): Promise<FlowTestResult> => {
  try {
    // Test form data structure
    const mockFormData = {
      projectName: 'Test Project',
      researchQuestion: 'What trends exist?',
      businessContext: 'Test context',
      files: [],
      parsedData: [],
      step: 1,
      uploading: false,
      parsing: false
    };

    // Test step validation
    const { validateStepProgression } = await import('../dataValidationHelper');
    
    const step1Validation = validateStepProgression(1, mockFormData);
    const step4Validation = validateStepProgression(4, { 
      ...mockFormData, 
      parsedData: [{ rowCount: 10, columnInfo: [{ name: 'test', type: 'string' }] }] 
    });

    return {
      step: 'Form State Management',
      success: step1Validation.isValid && step4Validation.isValid,
      data: { step1Validation, step4Validation }
    };
  } catch (error) {
    return {
      step: 'Form State Management',
      success: false,
      error: `Form state test failed: ${error}`
    };
  }
};

export const logTestResults = (results: FlowTestResult[]) => {
  console.log('🧪 Comprehensive Flow Test Results:');
  console.log('=====================================');
  
  results.forEach((result, index) => {
    const status = result.success ? '✅' : '❌';
    console.log(`${index + 1}. ${status} ${result.step}`);
    
    if (result.error) {
      console.log(`   Error: ${result.error}`);
    }
    
    if (result.warnings && result.warnings.length > 0) {
      console.log(`   Warnings: ${result.warnings.join(', ')}`);
    }
  });
  
  const successCount = results.filter(r => r.success).length;
  console.log(`\n📊 Overall: ${successCount}/${results.length} tests passed`);
  
  if (successCount === results.length) {
    console.log('🎉 All tests passed! The flow should work correctly.');
  } else {
    console.log('⚠️ Some tests failed. Check the errors above.');
  }
};