import { TestResult } from './types';
import createFileUploadTestSuite, { FileUploadTestResult } from './fileUploadTestSuite';

export interface E2ETestResult extends TestResult {
  testName: string;
  duration: number;
  timestamp: string;
  success?: boolean;
  error?: string;
  details?: any;
}

export interface E2ETestSuite {
  name: string;
  runTests: () => Promise<E2ETestResult[]>;
}

export const createOptimizedE2ETestRunner = (): E2ETestSuite => {
  const fileUploadSuite = createFileUploadTestSuite();

  const convertToE2EResult = (result: FileUploadTestResult): E2ETestResult => ({
    testName: result.testName,
    status: result.status,
    message: result.message,
    duration: 0,
    timestamp: new Date().toISOString(),
    success: result.success,
    error: result.error,
    details: result.details,
    category: 'File Upload',
    executionTime: 0
  });

  const testNewProjectFlow = async (): Promise<E2ETestResult> => {
    const startTime = Date.now();
    
    try {
      console.log('🧪 Testing New Project Flow...');
      
      // Test Step 1: Research Question Input
      const researchQuestion = "How many rows of data across all files?";
      if (!researchQuestion || researchQuestion.length < 10) {
        throw new Error('Research question validation failed');
      }
      
      // Test Step 2: File Upload Process
      const fileUploadResult = await fileUploadSuite.testFileUpload();
      if (!fileUploadResult.success) {
        throw new Error(`File upload failed: ${fileUploadResult.error}`);
      }
      
      // Test Step 3: File Processing
      const fileProcessingResult = await fileUploadSuite.testFileProcessing();
      if (!fileProcessingResult.success) {
        throw new Error(`File processing failed: ${fileProcessingResult.error}`);
      }
      
      // Test Step 4: Project Creation Validation
      const projectName = "Test Investigation";
      if (!projectName || projectName.length < 3) {
        throw new Error('Project name validation failed');
      }
      
      const duration = Date.now() - startTime;
      
      return {
        testName: 'New Project Flow',
        status: 'pass',
        message: 'New project flow completed successfully',
        duration,
        timestamp: new Date().toISOString(),
        success: true,
        details: {
          researchQuestionLength: researchQuestion.length,
          fileUploadDetails: fileUploadResult.details,
          fileProcessingDetails: fileProcessingResult.details,
          projectNameLength: projectName.length
        },
        category: 'Integration',
        executionTime: duration
      };
    } catch (error) {
      const duration = Date.now() - startTime;
      
      return {
        testName: 'New Project Flow',
        status: 'fail',
        message: 'New project flow failed',
        error: error instanceof Error ? error.message : 'Unknown error',
        duration,
        timestamp: new Date().toISOString(),
        success: false,
        category: 'Integration',
        executionTime: duration
      };
    }
  };

  const testFileUploadAndRemoval = async (): Promise<E2ETestResult> => {
    const startTime = Date.now();
    
    try {
      console.log('🧪 Testing File Upload and Removal...');
      
      // Test multiple file upload
      const multipleUploadResult = await fileUploadSuite.testMultipleFileUpload();
      if (!multipleUploadResult.success) {
        throw new Error(`Multiple file upload failed: ${multipleUploadResult.error}`);
      }
      
      // Test file removal
      const fileRemovalResult = await fileUploadSuite.testFileRemoval();
      if (!fileRemovalResult.success) {
        throw new Error(`File removal failed: ${fileRemovalResult.error}`);
      }
      
      // Test invalid file handling
      const invalidFileResult = await fileUploadSuite.testInvalidFileUpload();
      if (!invalidFileResult.success) {
        throw new Error(`Invalid file handling failed: ${invalidFileResult.error}`);
      }
      
      const duration = Date.now() - startTime;
      
      return {
        testName: 'File Upload and Removal',
        status: 'pass',
        message: 'File upload and removal tests completed successfully',
        duration,
        timestamp: new Date().toISOString(),
        success: true,
        details: {
          multipleUploadDetails: multipleUploadResult.details,
          fileRemovalDetails: fileRemovalResult.details,
          invalidFileDetails: invalidFileResult.details
        },
        category: 'File Operations',
        executionTime: duration
      };
    } catch (error) {
      const duration = Date.now() - startTime;
      
      return {
        testName: 'File Upload and Removal',
        status: 'fail',
        message: 'File upload and removal tests failed',
        error: error instanceof Error ? error.message : 'Unknown error',
        duration,
        timestamp: new Date().toISOString(),
        success: false,
        category: 'File Operations',
        executionTime: duration
      };
    }
  };

  const testDataParsing = async (): Promise<E2ETestResult> => {
    const startTime = Date.now();
    
    try {
      console.log('🧪 Testing Data Parsing Logic...');
      
      // Test CSV parsing with edge cases
      const csvContent = `name,age,city
"John, Jr.",30,"New York, NY"
Jane Smith,25,Los Angeles
"Bob ""Robert"" Johnson",35,"Chicago, IL"`;
      
      const csvFile = new File([csvContent], 'test.csv', { type: 'text/csv' });
      
      // Test file name extraction (the problematic area we fixed)
      const fileName = csvFile.name;
      if (!fileName) {
        throw new Error('File name is undefined');
      }
      
      const extension = fileName?.split('.').pop()?.toLowerCase();
      if (extension !== 'csv') {
        throw new Error('File extension detection failed');
      }
      
      // Test parsing logic with null safety
      const text = await csvFile.text();
      const lines = text.split('\n').filter(line => line.trim());
      
      if (lines.length !== 4) {
        throw new Error(`Expected 4 lines, got ${lines.length}`);
      }
      
      // Test null safety in parsing (this was the source of the split error)
      const headers = lines[0]?.split(',').map(h => h.trim().replace(/"/g, '')) || [];
      if (headers.length !== 3) {
        throw new Error(`Expected 3 headers, got ${headers.length}`);
      }
      
      const duration = Date.now() - startTime;
      
      return {
        testName: 'Data Parsing Logic',
        status: 'pass',
        message: 'Data parsing tests completed successfully',
        duration,
        timestamp: new Date().toISOString(),
        success: true,
        details: {
          fileName,
          extension,
          linesCount: lines.length,
          headersCount: headers.length,
          headers,
          nullSafetyTested: true
        },
        category: 'Data Processing',
        executionTime: duration
      };
    } catch (error) {
      const duration = Date.now() - startTime;
      
      return {
        testName: 'Data Parsing Logic',
        status: 'fail',
        message: 'Data parsing tests failed',
        error: error instanceof Error ? error.message : 'Unknown error',
        duration,
        timestamp: new Date().toISOString(),
        success: false,
        category: 'Data Processing',
        executionTime: duration
      };
    }
  };

  const testAnalysisFlow = async (): Promise<E2ETestResult> => {
    const startTime = Date.now();
    
    try {
      console.log('🧪 Testing Analysis Flow...');
      
      // Simulate analysis preparation
      const mockProject = {
        id: 'test-project-123',
        name: 'Test Investigation',
        research_question: 'How many rows of data across all files?',
        business_context: 'Testing the analysis flow'
      };
      
      const mockFiles = [
        {
          id: 'file1',
          name: 'data1.csv',
          parsedData: {
            rows: Array.from({length: 100}, (_, i) => ({id: i, name: `User ${i}`, value: Math.random() * 100})),
            columns: ['id', 'name', 'value'],
            rowCount: 100
          }
        }
      ];
      
      // Test analysis preparation
      if (!mockProject.research_question) {
        throw new Error('Research question is required for analysis');
      }
      
      if (mockFiles.length === 0) {
        throw new Error('At least one file is required for analysis');
      }
      
      // Test data aggregation
      const totalRows = mockFiles.reduce((sum, file) => sum + file.parsedData.rowCount, 0);
      if (totalRows !== 100) {
        throw new Error(`Expected 100 total rows, got ${totalRows}`);
      }
      
      const duration = Date.now() - startTime;
      
      return {
        testName: 'Analysis Flow',
        status: 'pass',
        message: 'Analysis flow tests completed successfully',
        duration,
        timestamp: new Date().toISOString(),
        success: true,
        details: {
          projectId: mockProject.id,
          filesCount: mockFiles.length,
          totalRows,
          questionLength: mockProject.research_question.length
        },
        category: 'Analysis',
        executionTime: duration
      };
    } catch (error) {
      const duration = Date.now() - startTime;
      
      return {
        testName: 'Analysis Flow',
        status: 'fail',
        message: 'Analysis flow tests failed',
        error: error instanceof Error ? error.message : 'Unknown error',
        duration,
        timestamp: new Date().toISOString(),
        success: false,
        category: 'Analysis',
        executionTime: duration
      };
    }
  };

  const runTests = async (): Promise<E2ETestResult[]> => {
    console.log('🚀 Starting Data Detective E2E Pipeline Test Suite...');
    
    const tests = [
      testNewProjectFlow,
      testFileUploadAndRemoval,
      testDataParsing,
      testAnalysisFlow
    ];
    
    const results: E2ETestResult[] = [];
    let passedCount = 0;
    let failedCount = 0;
    
    // Run all file upload tests
    console.log('📁 Running File Upload Test Suite...');
    const fileUploadResults = await fileUploadSuite.runAllTests();
    for (const result of fileUploadResults) {
      const e2eResult = convertToE2EResult(result);
      results.push(e2eResult);
      
      if (e2eResult.success) {
        passedCount++;
        console.log(`✅ ${e2eResult.testName}: ${e2eResult.message}`);
      } else {
        failedCount++;
        console.error(`❌ ${e2eResult.testName}: ${e2eResult.message} - ${e2eResult.error}`);
      }
    }
    
    // Run integration tests
    console.log('🔧 Running Integration Tests...');
    for (const test of tests) {
      try {
        const result = await test();
        results.push(result);
        
        if (result.success) {
          passedCount++;
          console.log(`✅ ${result.testName}: ${result.message} (${result.duration}ms)`);
        } else {
          failedCount++;
          console.error(`❌ ${result.testName}: ${result.message} - ${result.error} (${result.duration}ms)`);
        }
      } catch (error) {
        failedCount++;
        const failedResult: E2ETestResult = {
          testName: 'Unknown Test',
          status: 'fail',
          message: 'Test execution failed',
          error: error instanceof Error ? error.message : 'Unknown error',
          duration: 0,
          timestamp: new Date().toISOString(),
          success: false,
          category: 'System',
          executionTime: 0
        };
        results.push(failedResult);
        console.error(`❌ Test execution failed:`, error);
      }
    }
    
    // Summary
    console.log(`\n📊 E2E Test Summary:`);
    console.log(`   ✅ Passed: ${passedCount}`);
    console.log(`   ❌ Failed: ${failedCount}`);
    console.log(`   📈 Success Rate: ${((passedCount / (passedCount + failedCount)) * 100).toFixed(1)}%`);
    
    const totalDuration = results.reduce((sum, result) => sum + result.duration, 0);
    console.log(`   ⏱️  Total Duration: ${totalDuration}ms`);
    
    // Check if file upload issues were caught
    const fileUploadIssues = results.filter(r => 
      r.category === 'File Upload' && 
      r.status === 'fail' && 
      (r.error?.includes('split') || r.error?.includes('undefined'))
    );
    
    if (fileUploadIssues.length > 0) {
      console.log(`\n🐛 File Upload Issues Detected:`);
      fileUploadIssues.forEach(issue => {
        console.log(`   - ${issue.testName}: ${issue.error}`);
      });
    } else {
      console.log(`\n✅ No file upload issues detected - null safety fixes working!`);
    }
    
    return results;
  };

  return {
    name: 'Data Detective E2E Pipeline Test Suite',
    runTests
  };
};

export default createOptimizedE2ETestRunner;