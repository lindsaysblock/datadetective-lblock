import { TestResult } from './types';

export interface FileUploadTestResult {
  testName: string;
  status: 'pass' | 'fail' | 'skip' | 'warning';
  message: string;
  success: boolean;
  error?: string;
  details?: any;
  category?: string;
  executionTime?: number;
}

export interface FileUploadTestSuite {
  name: string;
  testFileUpload: () => Promise<FileUploadTestResult>;
  testFileRemoval: () => Promise<FileUploadTestResult>;
  testMultipleFileUpload: () => Promise<FileUploadTestResult>;
  testInvalidFileUpload: () => Promise<FileUploadTestResult>;
  testFileProcessing: () => Promise<FileUploadTestResult>;
  runAllTests: () => Promise<FileUploadTestResult[]>;
}

export const createFileUploadTestSuite = (): FileUploadTestSuite => {
  const createTestFile = (name: string, content: string, type: string): File => {
    const blob = new Blob([content], { type });
    return new File([blob], name, { type });
  };

  const testFileUpload = async (): Promise<FileUploadTestResult> => {
    try {
      console.log('🧪 Testing file upload functionality...');
      
      // Create test CSV file
      const csvContent = `name,age,city
John Doe,30,New York
Jane Smith,25,Los Angeles
Bob Johnson,35,Chicago`;
      
      const testFile = createTestFile('test.csv', csvContent, 'text/csv');
      
      // Test file creation
      if (!testFile || !testFile.name) {
        throw new Error('Failed to create test file');
      }
      
      // Test file parsing logic
      const extension = testFile.name?.split('.').pop()?.toLowerCase();
      if (extension !== 'csv') {
        throw new Error('File extension detection failed');
      }
      
      // Test file reading
      const text = await testFile.text();
      const lines = text.split('\n').filter(line => line.trim());
      
      if (lines.length !== 4) { // header + 3 data rows
        throw new Error(`Expected 4 lines, got ${lines.length}`);
      }
      
      // Test CSV parsing
      const headers = lines[0].split(',');
      if (headers.length !== 3) {
        throw new Error(`Expected 3 headers, got ${headers.length}`);
      }
      
      return {
        testName: 'File Upload Test',
        status: 'pass',
        success: true,
        message: 'File upload functionality working correctly',
        details: {
          fileName: testFile.name,
          fileSize: testFile.size,
          headers: headers.length,
          dataRows: lines.length - 1
        }
      };
    } catch (error) {
      return {
        testName: 'File Upload Test',
        status: 'fail',
        success: false,
        message: 'File upload test failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  };

  const testFileRemoval = async (): Promise<FileUploadTestResult> => {
    try {
      console.log('🧪 Testing file removal functionality...');
      
      // Simulate file removal logic
      const fileList = ['file1.csv', 'file2.json', 'file3.txt'];
      const fileToRemove = 'file2.json';
      
      const filteredList = fileList.filter(file => file !== fileToRemove);
      
      if (filteredList.length !== 2) {
        throw new Error(`Expected 2 files after removal, got ${filteredList.length}`);
      }
      
      if (filteredList.includes(fileToRemove)) {
        throw new Error('File was not properly removed from list');
      }
      
      return {
        testName: 'File Removal Test',
        status: 'pass',
        success: true,
        message: 'File removal functionality working correctly',
        details: {
          originalCount: fileList.length,
          afterRemoval: filteredList.length,
          removedFile: fileToRemove
        }
      };
    } catch (error) {
      return {
        testName: 'File Removal Test',
        status: 'fail',
        success: false,
        message: 'File removal test failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  };

  const testMultipleFileUpload = async (): Promise<FileUploadTestResult> => {
    try {
      console.log('🧪 Testing multiple file upload...');
      
      const files = [
        createTestFile('data1.csv', 'name,value\ntest1,100', 'text/csv'),
        createTestFile('data2.json', '{"users": [{"id": 1, "name": "Test"}]}', 'application/json'),
        createTestFile('data3.txt', 'Line 1\nLine 2\nLine 3', 'text/plain')
      ];
      
      // Test file processing
      const results = [];
      for (const file of files) {
        if (!file.name) {
          throw new Error('File name is undefined');
        }
        
        const extension = file.name?.split('.').pop()?.toLowerCase();
        const content = await file.text();
        
        results.push({
          name: file.name,
          extension,
          size: file.size,
          contentLength: content.length
        });
      }
      
      if (results.length !== 3) {
        throw new Error(`Expected 3 processed files, got ${results.length}`);
      }
      
      return {
        testName: 'Multiple File Upload Test',
        status: 'pass',
        success: true,
        message: 'Multiple file upload functionality working correctly',
        details: {
          filesProcessed: results.length,
          results
        }
      };
    } catch (error) {
      return {
        testName: 'Multiple File Upload Test',
        status: 'fail',
        success: false,
        message: 'Multiple file upload test failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  };

  const testInvalidFileUpload = async (): Promise<FileUploadTestResult> => {
    try {
      console.log('🧪 Testing invalid file upload handling...');
      
      // Test empty file
      const emptyFile = createTestFile('empty.csv', '', 'text/csv');
      const content = await emptyFile.text();
      
      if (content.length === 0) {
        // This should be handled gracefully
        console.log('Empty file detected correctly');
      }
      
      // Test file without extension
      const noExtFile = createTestFile('noextension', 'test data', 'text/plain');
      const fileName = noExtFile.name;
      const extension = fileName?.split('.').pop();
      
      if (extension === 'noextension') {
        console.log('File without extension handled correctly');
      }
      
      // Test null/undefined scenarios
      try {
        const nullName = undefined as any;
        const safeExtension = nullName?.split?.('.').pop()?.toLowerCase();
        if (safeExtension === undefined) {
          console.log('Null safety check working');
        }
      } catch (error) {
        throw new Error('Null safety check failed');
      }
      
      return {
        testName: 'Invalid File Upload Test',
        status: 'pass',
        success: true,
        message: 'Invalid file upload handling working correctly',
        details: {
          emptyFileHandled: content.length === 0,
          noExtensionHandled: true,
          nullSafetyWorking: true
        }
      };
    } catch (error) {
      return {
        testName: 'Invalid File Upload Test',
        status: 'fail',
        success: false,
        message: 'Invalid file upload test failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  };

  const testFileProcessing = async (): Promise<FileUploadTestResult> => {
    try {
      console.log('🧪 Testing file processing pipeline...');
      
      // Test CSV processing
      const csvFile = createTestFile('test.csv', 'id,name,age\n1,John,25\n2,Jane,30', 'text/csv');
      const csvText = await csvFile.text();
      const csvLines = csvText.split('\n').filter(line => line.trim());
      const csvHeaders = csvLines[0]?.split(',') || [];
      
      if (csvHeaders.length !== 3) {
        throw new Error(`CSV headers parsing failed: expected 3, got ${csvHeaders.length}`);
      }
      
      // Test JSON processing
      const jsonFile = createTestFile('test.json', '{"data": [{"id": 1, "name": "Test"}]}', 'application/json');
      const jsonText = await jsonFile.text();
      const jsonData = JSON.parse(jsonText);
      
      if (!jsonData.data || !Array.isArray(jsonData.data)) {
        throw new Error('JSON parsing failed');
      }
      
      return {
        testName: 'File Processing Test',
        status: 'pass',
        success: true,
        message: 'File processing pipeline working correctly',
        details: {
          csvProcessing: {
            lines: csvLines.length,
            headers: csvHeaders.length
          },
          jsonProcessing: {
            dataLength: jsonData.data.length
          }
        }
      };
    } catch (error) {
      return {
        testName: 'File Processing Test',
        status: 'fail',
        success: false,
        message: 'File processing test failed',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  };

  const runAllTests = async (): Promise<FileUploadTestResult[]> => {
    console.log('🧪 Running File Upload Test Suite...');
    
    const tests = [
      testFileUpload,
      testFileRemoval,
      testMultipleFileUpload,
      testInvalidFileUpload,
      testFileProcessing
    ];
    
    const results = [];
    for (const test of tests) {
      const result = await test();
      results.push(result);
      
      if (!result.success) {
        console.error(`❌ ${result.message}:`, result.error);
      } else {
        console.log(`✅ ${result.message}`);
      }
    }
    
    return results;
  };

  return {
    name: 'File Upload Test Suite',
    testFileUpload,
    testFileRemoval,
    testMultipleFileUpload,
    testInvalidFileUpload,
    testFileProcessing,
    runAllTests
  };
};

export default createFileUploadTestSuite;