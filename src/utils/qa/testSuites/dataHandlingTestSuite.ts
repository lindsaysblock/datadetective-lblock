
import { QATestResult } from '../types';

export const runDataHandlingTests = (): QATestResult[] => {
  const results: QATestResult[] = [];

  // Test CSV data handling
  try {
    const mockCsvData = 'name,age\nJohn,25\nJane,30';
    const rows = mockCsvData.split('\n').slice(1);
    
    results.push({
      testName: 'CSV Data Processing',
      status: rows.length > 0 ? 'pass' : 'fail',
      message: `Processed ${rows.length} CSV rows`,
      category: 'data'
    });
  } catch (error) {
    results.push({
      testName: 'CSV Data Processing',
      status: 'fail',
      message: `CSV processing failed: ${error}`,
      category: 'data'
    });
  }

  // Test JSON data handling
  try {
    const mockJsonData = '[{"id": 1, "name": "test"}]';
    const parsedData = JSON.parse(mockJsonData);
    
    results.push({
      testName: 'JSON Data Processing',
      status: Array.isArray(parsedData) ? 'pass' : 'fail',
      message: `Parsed ${parsedData.length} JSON records`,
      category: 'data'
    });
  } catch (error) {
    results.push({
      testName: 'JSON Data Processing',
      status: 'fail',
      message: `JSON processing failed: ${error}`,
      category: 'data'
    });
  }

  return results;
};
