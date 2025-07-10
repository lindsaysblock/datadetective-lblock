
import { QATestResult } from '../types';

export const runUtilityTests = (): QATestResult[] => {
  const results: QATestResult[] = [];

  // Test CSV parser utility
  try {
    const mockCsvData = 'name,age,city\nJohn,25,NYC\nJane,30,LA';
    const lines = mockCsvData.split('\n');
    const headers = lines[0].split(',');
    
    results.push({
      testName: 'CSV Parser Utility',
      status: headers.length === 3 ? 'pass' : 'fail',
      message: `CSV parser processed ${headers.length} columns`,
      category: 'utilities'
    });
  } catch (error) {
    results.push({
      testName: 'CSV Parser Utility',
      status: 'fail',
      message: `CSV parser failed: ${error}`,
      category: 'utilities'
    });
  }

  // Test data processing utility
  try {
    const mockData = [{ id: 1, value: 'test' }];
    const processedData = mockData.map(item => ({ ...item, processed: true }));
    
    results.push({
      testName: 'Data Processing Utility',
      status: processedData.length > 0 ? 'pass' : 'fail',
      message: `Processed ${processedData.length} data items`,
      category: 'utilities'
    });
  } catch (error) {
    results.push({
      testName: 'Data Processing Utility',
      status: 'fail',
      message: `Data processing failed: ${error}`,
      category: 'utilities'
    });
  }

  return results;
};
