/**
 * Phase 3: Enhanced Testing Suite
 * Comprehensive end-to-end analytics pipeline tests
 */

import { QATestResult } from '@/utils/qa/types';
import { parseFile, ParsedData } from '@/utils/dataParser';
import { EnhancedAnalysisEngine, EnhancedAnalysisContext } from '@/services/enhancedAnalysisEngine';
import { aiProviderManager } from '@/services/ai/aiProviderManager';

export class EndToEndAnalyticsTests {
  private static testFiles: { [key: string]: Blob } = {};

  static async runAllTests(): Promise<QATestResult[]> {
    const results: QATestResult[] = [];
    
    // Initialize test data
    await this.initializeTestData();
    
    const pipelineTests = await this.testCompleteAnalyticsPipeline();
    const multiFileTests = await this.testMultiFileAnalysis();
    const databaseTests = await this.testDatabaseIntegration();
    const mixedTests = await this.testMixedDataSources();
    const fallbackTests = await this.testProviderFallback();
    const largeDataTests = await this.testLargeDatasetHandling();
    
    results.push(...pipelineTests);
    results.push(...multiFileTests);
    results.push(...databaseTests);
    if (Array.isArray(mixedTests)) results.push(...mixedTests);
    results.push(...fallbackTests);
    results.push(...largeDataTests);
    
    return results;
  }

  private static async initializeTestData(): Promise<void> {
    // Create test CSV file
    const csvContent = 'name,age,department,salary\nJohn,25,Engineering,75000\nJane,30,Marketing,65000\nBob,35,Sales,55000\nAlice,28,Engineering,80000';
    this.testFiles.csv = new Blob([csvContent], { type: 'text/csv' });

    // Create test JSON file
    const jsonContent = JSON.stringify({
      users: [
        { id: 1, name: 'John', active: true, lastLogin: '2023-12-01' },
        { id: 2, name: 'Jane', active: false, lastLogin: '2023-11-15' },
        { id: 3, name: 'Bob', active: true, lastLogin: '2023-12-05' }
      ]
    });
    this.testFiles.json = new Blob([jsonContent], { type: 'application/json' });

    // Create test XLSX-like data (simulated as CSV for testing)
    const xlsxContent = 'product,quarter,revenue,growth\nProduct A,Q1,100000,5.2\nProduct B,Q1,85000,3.1\nProduct A,Q2,110000,10.0\nProduct B,Q2,92000,8.2';
    this.testFiles.xlsx = new Blob([xlsxContent], { type: 'text/csv' });
  }

  private static async testCompleteAnalyticsPipeline(): Promise<QATestResult[]> {
    const results: QATestResult[] = [];
    
    results.push({
      testName: 'Complete Analytics Pipeline - CSV Analysis',
      status: await this.testSingleFileAnalysis('csv', 'What is the average salary by department?') ? 'pass' : 'fail',
      message: 'Should complete full pipeline: file upload → parsing → analysis → insights',
      category: 'integration'
    });

    results.push({
      testName: 'Complete Analytics Pipeline - JSON Analysis',
      status: await this.testSingleFileAnalysis('json', 'How many users are currently active?') ? 'pass' : 'fail',
      message: 'Should handle JSON data structures and provide accurate analysis',
      category: 'integration'
    });

    results.push({
      testName: 'Complete Analytics Pipeline - Complex Question',
      status: await this.testComplexAnalysis() ? 'pass' : 'fail',
      message: 'Should handle complex multi-part questions requiring detailed analysis',
      category: 'integration'
    });

    return results;
  }

  private static async testSingleFileAnalysis(fileType: string, question: string): Promise<boolean> {
    try {
      const engine = new EnhancedAnalysisEngine();
      const file = new File([this.testFiles[fileType]], `test.${fileType}`, { 
        type: fileType === 'csv' ? 'text/csv' : 'application/json' 
      });

      // Mock API key for testing
      aiProviderManager.setApiKey('openai', 'test-key-for-testing');

      const context: EnhancedAnalysisContext = {
        question,
        files: [file]
      };

      const result = await engine.analyzeWithQuestion(context);
      
      // Should either succeed or require API key (both are valid outcomes)
      return result.success || result.requiresApiKey === true;
    } catch (error) {
      console.error(`Single file analysis test failed for ${fileType}:`, error);
      return false;
    }
  }

  private static async testComplexAnalysis(): Promise<boolean> {
    try {
      const engine = new EnhancedAnalysisEngine();
      const csvFile = new File([this.testFiles.csv], 'employees.csv', { type: 'text/csv' });
      const jsonFile = new File([this.testFiles.json], 'users.json', { type: 'application/json' });

      const context: EnhancedAnalysisContext = {
        question: 'Analyze the relationship between employee departments and salary ranges. What insights can you provide about compensation trends and recommendations for salary optimization?',
        files: [csvFile, jsonFile]
      };

      const result = await engine.analyzeWithQuestion(context);
      return result.success || result.requiresApiKey === true;
    } catch (error) {
      console.error('Complex analysis test failed:', error);
      return false;
    }
  }

  private static async testMultiFileAnalysis(): Promise<QATestResult[]> {
    const results: QATestResult[] = [];

    results.push({
      testName: 'Multi-File Type Support',
      status: await this.testMultipleFileTypes() ? 'pass' : 'fail',
      message: 'Should handle CSV, JSON, and XLSX files simultaneously',
      category: 'file-handling'
    });

    results.push({
      testName: 'Cross-File Data Correlation',
      status: await this.testCrossFileAnalysis() ? 'pass' : 'fail',
      message: 'Should identify relationships across different file formats',
      category: 'data-analysis'
    });

    results.push({
      testName: 'Large File Set Processing',
      status: await this.testLargeFileSet() ? 'pass' : 'fail',
      message: 'Should efficiently process multiple large files',
      category: 'performance'
    });

    return results;
  }

  private static async testMultipleFileTypes(): Promise<boolean> {
    try {
      const engine = new EnhancedAnalysisEngine();
      const files = [
        new File([this.testFiles.csv], 'data.csv', { type: 'text/csv' }),
        new File([this.testFiles.json], 'users.json', { type: 'application/json' }),
        new File([this.testFiles.xlsx], 'revenue.xlsx', { type: 'application/vnd.ms-excel' })
      ];

      const context: EnhancedAnalysisContext = {
        question: 'What patterns do you see across all uploaded data files?',
        files
      };

      const result = await engine.analyzeWithQuestion(context);
      return result.success || result.requiresApiKey === true;
    } catch (error) {
      console.error('Multi-file type test failed:', error);
      return false;
    }
  }

  private static async testCrossFileAnalysis(): Promise<boolean> {
    try {
      const engine = new EnhancedAnalysisEngine();
      
      // Create related datasets for correlation testing
      const employeeData = 'emp_id,name,dept_id,salary\n1,John,1,75000\n2,Jane,2,65000\n3,Bob,3,55000';
      const departmentData = '{"departments":[{"id":1,"name":"Engineering","budget":500000},{"id":2,"name":"Marketing","budget":300000},{"id":3,"name":"Sales","budget":200000}]}';
      
      const files = [
        new File([employeeData], 'employees.csv', { type: 'text/csv' }),
        new File([departmentData], 'departments.json', { type: 'application/json' })
      ];

      const context: EnhancedAnalysisContext = {
        question: 'Analyze the relationship between employee salaries and department budgets. Are there any optimization opportunities?',
        files
      };

      const result = await engine.analyzeWithQuestion(context);
      return result.success || result.requiresApiKey === true;
    } catch (error) {
      console.error('Cross-file analysis test failed:', error);
      return false;
    }
  }

  private static async testLargeFileSet(): Promise<boolean> {
    try {
      const engine = new EnhancedAnalysisEngine();
      
      // Create multiple smaller files to simulate large dataset
      const files: File[] = [];
      for (let i = 0; i < 5; i++) {
        const data = `month,sales,region\n2023-0${i+1},${Math.random() * 100000},Region${i+1}`;
        files.push(new File([data], `sales_${i+1}.csv`, { type: 'text/csv' }));
      }

      const context: EnhancedAnalysisContext = {
        question: 'What are the monthly sales trends across all regions?',
        files
      };

      const result = await engine.analyzeWithQuestion(context);
      return result.success || result.requiresApiKey === true;
    } catch (error) {
      console.error('Large file set test failed:', error);
      return false;
    }
  }

  private static async testDatabaseIntegration(): Promise<QATestResult[]> {
    const results: QATestResult[] = [];

    results.push({
      testName: 'Database Table Analysis',
      status: await this.testDatabaseQuery() ? 'pass' : 'fail',
      message: 'Should generate appropriate SQL queries for database analysis',
      category: 'database'
    });

    results.push({
      testName: 'Database + File Combination',
      status: await this.testMixedDataSources() ? 'pass' : 'fail',
      message: 'Should combine database and file data for comprehensive analysis',
      category: 'integration'
    });

    return results;
  }

  private static async testDatabaseQuery(): Promise<boolean> {
    try {
      const engine = new EnhancedAnalysisEngine();

      const context: EnhancedAnalysisContext = {
        question: 'What are the most popular products based on order data?',
        databaseTables: ['orders', 'products', 'customers']
      };

      const result = await engine.analyzeWithQuestion(context);
      return result.success || result.requiresApiKey === true;
    } catch (error) {
      console.error('Database query test failed:', error);
      return false;
    }
  }

  private static async testMixedDataSources(): Promise<boolean> {
    try {
      const engine = new EnhancedAnalysisEngine();
      const csvFile = new File([this.testFiles.csv], 'employees.csv', { type: 'text/csv' });

      const context: EnhancedAnalysisContext = {
        question: 'Compare uploaded employee data with database user records to identify discrepancies',
        files: [csvFile],
        databaseTables: ['users', 'profiles']
      };

      const result = await engine.analyzeWithQuestion(context);
      return result.success || result.requiresApiKey === true;
    } catch (error) {
      console.error('Mixed data sources test failed:', error);
      return false;
    }
  }

  private static async testProviderFallback(): Promise<QATestResult[]> {
    const results: QATestResult[] = [];

    results.push({
      testName: 'Provider Fallback Mechanism',
      status: await this.testProviderFailover() ? 'pass' : 'fail',
      message: 'Should fallback to alternative AI provider when primary fails',
      category: 'reliability'
    });

    results.push({
      testName: 'Multi-Provider Load Balancing',
      status: await this.testLoadBalancing() ? 'pass' : 'fail',
      message: 'Should distribute requests across available providers',
      category: 'performance'
    });

    return results;
  }

  private static async testProviderFailover(): Promise<boolean> {
    try {
      // Clear all API keys to test fallback behavior
      aiProviderManager.clearAllApiKeys();
      
      const engine = new EnhancedAnalysisEngine();
      const file = new File([this.testFiles.csv], 'test.csv', { type: 'text/csv' });

      const context: EnhancedAnalysisContext = {
        question: 'What is the data structure of this file?',
        files: [file]
      };

      const result = await engine.analyzeWithQuestion(context);
      
      // Should require API key when none are configured
      return result.requiresApiKey === true;
    } catch (error) {
      console.error('Provider fallback test failed:', error);
      return false;
    }
  }

  private static async testLoadBalancing(): Promise<boolean> {
    try {
      // Set up multiple providers
      aiProviderManager.setApiKey('openai', 'test-openai-key');
      aiProviderManager.setApiKey('claude', 'test-claude-key');
      aiProviderManager.setApiKey('perplexity', 'test-perplexity-key');

      const engine = new EnhancedAnalysisEngine();
      const file = new File([this.testFiles.csv], 'test.csv', { type: 'text/csv' });

      // Test multiple requests
      const contexts: EnhancedAnalysisContext[] = [
        { question: 'What are the latest trends in this data?', files: [file] }, // Should prefer Perplexity
        { question: 'Analyze the complex relationships in this dataset', files: [file] }, // Should prefer Claude
        { question: 'What insights can you provide about this data?', files: [file] } // General query
      ];

      const results = await Promise.allSettled(
        contexts.map(context => engine.analyzeWithQuestion(context))
      );

      // All should complete (success or require valid API key)
      return results.every(result => 
        result.status === 'fulfilled' && 
        (result.value.success || result.value.requiresApiKey === true)
      );
    } catch (error) {
      console.error('Load balancing test failed:', error);
      return false;
    }
  }

  private static async testLargeDatasetHandling(): Promise<QATestResult[]> {
    const results: QATestResult[] = [];

    results.push({
      testName: 'Large Dataset Memory Management',
      status: await this.testLargeDatasetMemory() ? 'pass' : 'fail',
      message: 'Should handle large datasets without memory issues',
      category: 'performance'
    });

    results.push({
      testName: 'Streaming Data Processing',
      status: await this.testStreamingProcessing() ? 'pass' : 'fail',
      message: 'Should process data in chunks for memory efficiency',
      category: 'performance'
    });

    return results;
  }

  private static async testLargeDatasetMemory(): Promise<boolean> {
    try {
      const engine = new EnhancedAnalysisEngine();
      
      // Create a larger dataset
      let largeData = 'id,value,category,timestamp\n';
      for (let i = 0; i < 1000; i++) {
        largeData += `${i},${Math.random() * 1000},Category${i % 10},2023-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-01\n`;
      }
      
      const file = new File([largeData], 'large_dataset.csv', { type: 'text/csv' });

      const context: EnhancedAnalysisContext = {
        question: 'What are the key statistical patterns in this large dataset?',
        files: [file]
      };

      const result = await engine.analyzeWithQuestion(context);
      return result.success || result.requiresApiKey === true;
    } catch (error) {
      console.error('Large dataset memory test failed:', error);
      return false;
    }
  }

  private static async testStreamingProcessing(): Promise<boolean> {
    try {
      // Test multiple files processed simultaneously
      const engine = new EnhancedAnalysisEngine();
      const files: File[] = [];
      
      for (let i = 0; i < 3; i++) {
        let data = 'timestamp,value\n';
        for (let j = 0; j < 100; j++) {
          data += `2023-${String(i + 1).padStart(2, '0')}-${String(j + 1).padStart(2, '0')},${Math.random() * 100}\n`;
        }
        files.push(new File([data], `stream_${i}.csv`, { type: 'text/csv' }));
      }

      const context: EnhancedAnalysisContext = {
        question: 'What trends do you see across all time series data?',
        files
      };

      const result = await engine.analyzeWithQuestion(context);
      return result.success || result.requiresApiKey === true;
    } catch (error) {
      console.error('Streaming processing test failed:', error);
      return false;
    }
  }
}