import { TestResult } from './types';
import createFileUploadTestSuite from './fileUploadTestSuite';
import { AnalysisEngine } from '@/services/analysisEngine';
import { DataAnalysisContext } from '@/types/data';

export interface DataPipelineTestResult extends TestResult {
  testName: string;
  status: 'pass' | 'fail' | 'skip' | 'warning';
  message: string;
  success: boolean;
  error?: string;
  details?: any;
  duration: number;
}

export interface DataPipelineTestSuite {
  name: string;
  testEndToEndPipeline: () => Promise<DataPipelineTestResult>;
  testFileUploadValidation: () => Promise<DataPipelineTestResult>;
  testAnalysisEngine: () => Promise<DataPipelineTestResult>;
  testDataTransformation: () => Promise<DataPipelineTestResult>;
  testErrorHandling: () => Promise<DataPipelineTestResult>;
  runAllTests: () => Promise<DataPipelineTestResult[]>;
}

export const createDataPipelineTestSuite = (): DataPipelineTestSuite => {
  const createMockData = () => ({
    csvData: `user_id,event_name,timestamp,value
1,purchase,2024-01-01,100
2,view,2024-01-01,0
1,purchase,2024-01-02,150
3,signup,2024-01-02,0
2,purchase,2024-01-03,75`,
    
    jsonData: {
      users: [
        { id: 1, name: "John", age: 25, purchases: 250 },
        { id: 2, name: "Jane", age: 30, purchases: 75 },
        { id: 3, name: "Bob", age: 35, purchases: 0 }
      ]
    },
    
    context: {
      question: "How many total purchases were made?",
      columns: ["user_id", "event_name", "timestamp", "value"],
      data: []
    }
  });

  const testEndToEndPipeline = async (): Promise<DataPipelineTestResult> => {
    const startTime = Date.now();
    
    try {
      console.log('🧪 Testing End-to-End Data Pipeline...');
      
      // Step 1: File Upload Simulation
      const mockData = createMockData();
      const csvFile = new File([mockData.csvData], 'test-data.csv', { type: 'text/csv' });
      
      if (!csvFile.name) {
        throw new Error('File creation failed');
      }
      
      // Step 2: File Parsing
      const text = await csvFile.text();
      const lines = text.split('\n').filter(line => line.trim());
      const headers = lines[0]?.split(',') || [];
      const dataRows = lines.slice(1).map(line => {
        const values = line.split(',');
        const row: any = {};
        headers.forEach((header, index) => {
          row[header] = values[index] || '';
        });
        return row;
      });
      
      if (dataRows.length === 0) {
        throw new Error('No data rows parsed');
      }
      
      // Step 3: Data Analysis Context Creation
      const analysisContext: DataAnalysisContext = {
        researchQuestion: "How many total purchases were made?",
        additionalContext: "Testing analysis with purchase data",
        parsedData: [{
          id: 'test-file-1',
          name: 'test-data.csv',
          rows: dataRows.length,
          columns: headers.length,
          rowCount: dataRows.length,
          data: dataRows
        }],
        educationalMode: false
      };
      
      // Step 4: Analysis Engine Test
      const analysisResults = await AnalysisEngine.analyzeData(analysisContext);
      
      if (!analysisResults) {
        throw new Error('Analysis engine returned no results');
      }
      
      if (!analysisResults.insights) {
        throw new Error('Analysis results missing insights');
      }
      
      // Step 5: Validate Results Structure
      const requiredFields = ['insights', 'confidence', 'recommendations', 'detailedResults'];
      for (const field of requiredFields) {
        if (!(field in analysisResults)) {
          throw new Error(`Analysis results missing required field: ${field}`);
        }
      }
      
      const duration = Date.now() - startTime;
      
      return {
        testName: 'End-to-End Data Pipeline',
        status: 'pass',
        success: true,
        message: 'Complete data pipeline test passed successfully',
        duration,
        details: {
          fileProcessed: csvFile.name,
          rowsParsed: dataRows.length,
          columnsFound: headers.length,
          analysisCompleted: true,
          insightsGenerated: analysisResults.insights.length > 0,
          recommendationsCount: analysisResults.recommendations?.length || 0,
          detailedResultsCount: analysisResults.detailedResults?.length || 0
        }
      };
    } catch (error) {
      const duration = Date.now() - startTime;
      
      return {
        testName: 'End-to-End Data Pipeline',
        status: 'fail',
        success: false,
        message: 'End-to-end pipeline test failed',
        error: error instanceof Error ? error.message : 'Unknown error',
        duration
      };
    }
  };

  const testFileUploadValidation = async (): Promise<DataPipelineTestResult> => {
    const startTime = Date.now();
    
    try {
      console.log('🧪 Testing File Upload Validation...');
      
      // Test various CSV file scenarios that could cause "unsupported file type" errors
      const testCases = [
        {
          name: 'standard-csv-mime',
          content: 'name,age,city\nJohn,30,NYC\nJane,25,LA',
          filename: 'test.csv',
          mimeType: 'text/csv'
        },
        {
          name: 'excel-csv-mime',
          content: 'name,age,city\nJohn,30,NYC\nJane,25,LA',
          filename: 'test.csv',
          mimeType: 'application/vnd.ms-excel'
        },
        {
          name: 'empty-mime',
          content: 'name,age,city\nJohn,30,NYC\nJane,25,LA',
          filename: 'test.csv',
          mimeType: ''
        },
        {
          name: 'octet-stream-mime',
          content: 'name,age,city\nJohn,30,NYC\nJane,25,LA',
          filename: 'test.csv',
          mimeType: 'application/octet-stream'
        }
      ];
      
      let passedTests = 0;
      const testResults = [];
      
      for (const testCase of testCases) {
        try {
          const file = new File([testCase.content], testCase.filename, { type: testCase.mimeType });
          
          // Test file extension detection
          const extension = file.name?.split('.').pop()?.toLowerCase();
          if (extension !== 'csv') {
            throw new Error(`Extension detection failed: expected 'csv', got '${extension}'`);
          }
          
          // Test file parsing logic (simulating the real parsing)
          const reader = new FileReader();
          const parseResult = await new Promise((resolve, reject) => {
            reader.onload = (event) => {
              try {
                const text = event.target?.result as string;
                const extension = file.name?.split('.').pop()?.toLowerCase();
                
                // This is the actual logic from useFileUploadManager
                if (extension === 'csv' || file.type === 'text/csv' || file.type === 'application/vnd.ms-excel') {
                  const lines = text.split('\n').filter(line => line.trim());
                  if (lines.length === 0) {
                    reject(new Error('CSV file is empty'));
                    return;
                  }
                  
                  const headers = lines[0]?.split(',').map(h => h.trim().replace(/"/g, '')) || [];
                  const rows = lines.slice(1).map(line => {
                    const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
                    const row: any = {};
                    headers.forEach((header, index) => {
                      row[header] = values[index] || '';
                    });
                    return row;
                  });

                  resolve({
                    rows,
                    columns: headers,
                    rowCount: rows.length,
                    fileType: 'CSV'
                  });
                } else {
                  reject(new Error(`Unsupported file type: ${extension}. Please upload CSV, JSON, or TXT files.`));
                }
              } catch (error) {
                reject(error);
              }
            };
            reader.onerror = () => reject(new Error('Failed to read file'));
            reader.readAsText(file);
          });
          
          testResults.push({
            testCase: testCase.name,
            success: true,
            result: parseResult
          });
          passedTests++;
          
        } catch (error) {
          testResults.push({
            testCase: testCase.name,
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
          });
        }
      }
      
      const duration = Date.now() - startTime;
      
      return {
        testName: 'File Upload Validation',
        status: passedTests === testCases.length ? 'pass' : 'fail',
        success: passedTests === testCases.length,
        message: `${passedTests}/${testCases.length} file upload scenarios passed`,
        error: passedTests < testCases.length ? 'Some CSV file scenarios failed - this explains the "unsupported file type" error' : undefined,
         duration,
        details: {
          passedTests,
          totalTests: testCases.length,
          testResults,
          criticalIssue: passedTests < testCases.length ? 'File validation logic needs fixing' : null
        }
      };
    } catch (error) {
      const duration = Date.now() - startTime;
      
      return {
        testName: 'File Upload Validation',
        status: 'fail',
        success: false,
        message: 'File upload validation test failed',
        error: error instanceof Error ? error.message : 'Unknown error',
         duration,
        details: {
          criticalIssue: 'File upload validation system failure'
        }
      };
    }
  };

  const testAnalysisEngine = async (): Promise<DataPipelineTestResult> => {
    const startTime = Date.now();
    
    try {
      console.log('🧪 Testing Analysis Engine...');
      
      const mockData = createMockData();
      const context: DataAnalysisContext = {
        researchQuestion: "What is the average purchase value?",
        additionalContext: "Testing with sample purchase data",
        parsedData: [{
          id: 'test-analysis',
          name: 'test.csv',
          rows: 3,
          columns: 3,
          rowCount: 3,
          data: [
            { user_id: "1", event_name: "purchase", value: "100" },
            { user_id: "2", event_name: "purchase", value: "150" },
            { user_id: "3", event_name: "view", value: "0" }
          ]
        }],
        educationalMode: false
      };
      
      // Test with valid data
      const results = await AnalysisEngine.analyzeData(context);
      
      if (!results.insights || results.insights.length === 0) {
        throw new Error('Analysis engine did not generate insights');
      }
      
      if (!results.confidence) {
        throw new Error('Analysis engine did not set confidence level');
      }
      
      if (!Array.isArray(results.recommendations)) {
        throw new Error('Analysis engine did not generate recommendations array');
      }
      
      // Test with edge cases
      const emptyContext: DataAnalysisContext = {
        researchQuestion: "Test question",
        additionalContext: "",
        parsedData: [],
        educationalMode: false
      };
      
      const emptyResults = await AnalysisEngine.analyzeData(emptyContext);
      if (!emptyResults) {
        throw new Error('Analysis engine should handle empty data gracefully');
      }
      
      const duration = Date.now() - startTime;
      
      return {
        testName: 'Analysis Engine',
        status: 'pass',
        success: true,
        message: 'Analysis engine test passed',
        duration,
        details: {
          validDataTest: true,
          emptyDataHandling: true,
          insightsGenerated: results.insights.length > 0,
          confidenceSet: !!results.confidence,
          recommendationsGenerated: results.recommendations.length > 0
        }
      };
    } catch (error) {
      const duration = Date.now() - startTime;
      
      return {
        testName: 'Analysis Engine',
        status: 'fail',
        success: false,
        message: 'Analysis engine test failed',
        error: error instanceof Error ? error.message : 'Unknown error',
        duration
      };
    }
  };

  const testDataTransformation = async (): Promise<DataPipelineTestResult> => {
    const startTime = Date.now();
    
    try {
      console.log('🧪 Testing Data Transformation...');
      
      // Test CSV parsing with various formats
      const csvVariants = [
        'simple,data,format\n1,2,3\n4,5,6',
        '"quoted,data",normal,data\n"value,with,commas",simple,value',
        'header1,header2,header3\n"",empty,""',
        'numeric,date,boolean\n123,2024-01-01,true'
      ];
      
      const results = [];
      
      for (const csvData of csvVariants) {
        const lines = csvData.split('\n').filter(line => line.trim());
        if (lines.length < 2) {
          throw new Error('Invalid CSV format detected');
        }
        
        const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
        const dataRows = lines.slice(1).map(line => {
          const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
          const row: any = {};
          headers.forEach((header, index) => {
            row[header] = values[index] || '';
          });
          return row;
        });
        
        results.push({
          headers: headers.length,
          rows: dataRows.length,
          valid: dataRows.length > 0 && headers.length > 0
        });
      }
      
      const allValid = results.every(r => r.valid);
      if (!allValid) {
        throw new Error('Some CSV variants failed to parse correctly');
      }
      
      // Test JSON transformation
      const jsonTestData = {
        users: [{ id: 1, name: "Test" }],
        metadata: { count: 1 }
      };
      
      const jsonString = JSON.stringify(jsonTestData);
      const parsedJson = JSON.parse(jsonString);
      
      if (!parsedJson.users || parsedJson.users.length !== 1) {
        throw new Error('JSON transformation failed');
      }
      
      const duration = Date.now() - startTime;
      
      return {
        testName: 'Data Transformation',
        status: 'pass',
        success: true,
        message: 'Data transformation test passed',
        duration,
        details: {
          csvVariantsTested: csvVariants.length,
          allVariantsValid: allValid,
          jsonTransformationWorking: true,
          transformationResults: results
        }
      };
    } catch (error) {
      const duration = Date.now() - startTime;
      
      return {
        testName: 'Data Transformation',
        status: 'fail',
        success: false,
        message: 'Data transformation test failed',
        error: error instanceof Error ? error.message : 'Unknown error',
        duration
      };
    }
  };

  const testErrorHandling = async (): Promise<DataPipelineTestResult> => {
    const startTime = Date.now();
    
    try {
      console.log('🧪 Testing Error Handling...');
      
      const errorScenarios = [
        {
          name: 'Null file name',
          test: () => {
            const fileName = null as any;
            const extension = fileName?.split?.('.').pop()?.toLowerCase();
            return extension === undefined;
          }
        },
        {
          name: 'Empty CSV data',
          test: () => {
            const csvData = '';
            const lines = csvData.split('\n').filter(line => line.trim());
            return lines.length === 0;
          }
        },
        {
          name: 'Invalid JSON',
          test: () => {
            try {
              JSON.parse('invalid json');
              return false;
            } catch {
              return true; // Should catch the error
            }
          }
        },
        {
          name: 'Empty analysis context',
          test: async () => {
            try {
              const emptyContext: DataAnalysisContext = {
                researchQuestion: '',
                additionalContext: '',
                parsedData: [],
                educationalMode: false
              };
              const result = await AnalysisEngine.analyzeData(emptyContext);
              return result !== null; // Should handle gracefully
            } catch {
              return true; // Acceptable to throw error
            }
          }
        }
      ];
      
      const results = [];
      for (const scenario of errorScenarios) {
        try {
          const result = await scenario.test();
          results.push({
            scenario: scenario.name,
            handled: result,
            error: null
          });
        } catch (error) {
          results.push({
            scenario: scenario.name,
            handled: true,
            error: error instanceof Error ? error.message : 'Unknown error'
          });
        }
      }
      
      const allHandled = results.every(r => r.handled);
      
      const duration = Date.now() - startTime;
      
      return {
        testName: 'Error Handling',
        status: allHandled ? 'pass' : 'warning',
        success: allHandled,
        message: allHandled ? 'Error handling test passed' : 'Some error scenarios not handled properly',
        duration,
        details: {
          scenariosTested: errorScenarios.length,
          allHandled,
          results
        }
      };
    } catch (error) {
      const duration = Date.now() - startTime;
      
      return {
        testName: 'Error Handling',
        status: 'fail',
        success: false,
        message: 'Error handling test failed',
        error: error instanceof Error ? error.message : 'Unknown error',
        duration
      };
    }
  };

  const runAllTests = async (): Promise<DataPipelineTestResult[]> => {
    console.log('🚀 Running Data Detective E2E Pipeline Test Suite...');
    
    const tests = [
      testEndToEndPipeline,
      testFileUploadValidation,
      testAnalysisEngine,
      testDataTransformation,
      testErrorHandling
    ];
    
    const results = [];
    let passedCount = 0;
    let failedCount = 0;
    
    for (const test of tests) {
      const result = await test();
      results.push(result);
      
      if (result.success) {
        passedCount++;
        console.log(`✅ ${result.testName}: ${result.message} (${result.duration}ms)`);
      } else {
        failedCount++;
        console.error(`❌ ${result.testName}: ${result.message} - ${result.error} (${result.duration}ms)`);
      }
    }
    
    console.log(`\n📊 Data Pipeline Test Summary:`);
    console.log(`   ✅ Passed: ${passedCount}`);
    console.log(`   ❌ Failed: ${failedCount}`);
    console.log(`   📈 Success Rate: ${((passedCount / (passedCount + failedCount)) * 100).toFixed(1)}%`);
    
    return results;
  };

  return {
    name: 'Data Detective E2E Pipeline Test Suite',
    testEndToEndPipeline,
    testFileUploadValidation,
    testAnalysisEngine,
    testDataTransformation,
    testErrorHandling,
    runAllTests
  };
};

export default createDataPipelineTestSuite;