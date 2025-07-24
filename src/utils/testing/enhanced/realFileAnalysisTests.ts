/**
 * Real File Upload and Analysis Tests
 * Comprehensive testing of actual file processing and analysis functionality
 */

import { supabase } from '@/integrations/supabase/client';
import { UnitTestResult } from '../types';
import { AnalysisCoordinator } from '@/services/analysis/analysisCoordinator';
import { DataAnalysisContext } from '@/types/data';

export interface FileAnalysisTestScenario {
  name: string;
  description: string;
  fileType: 'csv' | 'json' | 'excel';
  fileSize: 'small' | 'medium' | 'large';
  complexity: 'simple' | 'complex';
  expectedColumns: number;
  expectedRows: number;
  analysisType: string;
}

export class RealFileAnalysisTests {
  private uploadedFiles: string[] = [];
  private createdProjects: string[] = [];

  private readonly testScenarios: FileAnalysisTestScenario[] = [
    {
      name: 'Small CSV User Behavior Analysis',
      description: 'Process small CSV file with user behavior data',
      fileType: 'csv',
      fileSize: 'small',
      complexity: 'simple',
      expectedColumns: 5,
      expectedRows: 100,
      analysisType: 'user_behavior'
    },
    {
      name: 'Medium CSV Sales Data Analysis',
      description: 'Process medium-sized CSV with sales transactions',
      fileType: 'csv',
      fileSize: 'medium',
      complexity: 'complex',
      expectedColumns: 12,
      expectedRows: 5000,
      analysisType: 'sales_analysis'
    },
    {
      name: 'Large CSV Performance Dataset',
      description: 'Process large CSV file with performance metrics',
      fileType: 'csv',
      fileSize: 'large',
      complexity: 'complex',
      expectedColumns: 20,
      expectedRows: 25000,
      analysisType: 'performance_metrics'
    },
    {
      name: 'JSON API Response Analysis',
      description: 'Process JSON file containing API response data',
      fileType: 'json',
      fileSize: 'medium',
      complexity: 'complex',
      expectedColumns: 8,
      expectedRows: 1000,
      analysisType: 'api_analytics'
    },
    {
      name: 'Nested JSON User Events',
      description: 'Process complex nested JSON with user event data',
      fileType: 'json',
      fileSize: 'small',
      complexity: 'complex',
      expectedColumns: 15,
      expectedRows: 500,
      analysisType: 'event_tracking'
    },
    {
      name: 'Multi-Column CSV Financial Data',
      description: 'Process CSV with financial time series data',
      fileType: 'csv',
      fileSize: 'medium',
      complexity: 'complex',
      expectedColumns: 25,
      expectedRows: 10000,
      analysisType: 'financial_analysis'
    },
    {
      name: 'Real-time Data Stream CSV',
      description: 'Process CSV simulating real-time data stream',
      fileType: 'csv',
      fileSize: 'large',
      complexity: 'simple',
      expectedColumns: 6,
      expectedRows: 50000,
      analysisType: 'streaming_data'
    },
    {
      name: 'E-commerce Transaction JSON',
      description: 'Process JSON with e-commerce transaction data',
      fileType: 'json',
      fileSize: 'medium',
      complexity: 'complex',
      expectedColumns: 18,
      expectedRows: 2500,
      analysisType: 'ecommerce_analysis'
    }
  ];

  async runAllFileAnalysisTests(): Promise<UnitTestResult[]> {
    console.log('📁 Starting comprehensive file analysis tests');
    
    const results: UnitTestResult[] = [];
    
    for (const scenario of this.testScenarios) {
      console.log(`📊 Testing: ${scenario.name}`);
      const result = await this.executeFileAnalysisTest(scenario);
      results.push(result);
      
      // Brief pause between tests
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    // Cleanup
    await this.cleanupTestData();
    
    console.log(`✅ Completed ${results.length} file analysis tests`);
    return results;
  }

  async runCriticalFileTests(): Promise<UnitTestResult[]> {
    const criticalTests = this.testScenarios.filter(test => 
      test.fileSize !== 'large' && 
      test.complexity === 'simple'
    ).slice(0, 3);

    console.log(`📋 Running ${criticalTests.length} critical file analysis tests`);
    
    const results: UnitTestResult[] = [];
    
    for (const scenario of criticalTests) {
      const result = await this.executeFileAnalysisTest(scenario);
      results.push(result);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    return results;
  }

  private async executeFileAnalysisTest(scenario: FileAnalysisTestScenario): Promise<UnitTestResult> {
    const startTime = performance.now();
    
    try {
      let success = true;
      const errors: string[] = [];

      // Step 1: Generate test file
      const fileData = await this.generateTestFile(scenario);
      if (!fileData) {
        errors.push('Failed to generate test file');
        success = false;
      }

      // Step 2: Upload file to Supabase storage
      let uploadPath = '';
      if (success && fileData) {
        uploadPath = await this.uploadTestFile(fileData, scenario);
        if (!uploadPath) {
          errors.push('Failed to upload file to storage');
          success = false;
        }
      }

      // Step 3: Process file and extract data
      let parsedData = null;
      if (success && uploadPath) {
        parsedData = await this.processUploadedFile(uploadPath, scenario);
        if (!parsedData) {
          errors.push('Failed to process uploaded file');
          success = false;
        }
      }

      // Step 4: Create project and analysis session
      let projectId = '';
      if (success && parsedData) {
        projectId = await this.createTestProject(scenario);
        if (!projectId) {
          errors.push('Failed to create test project');
          success = false;
        }
      }

      // Step 5: Run actual analysis
      let analysisResult = null;
      if (success && parsedData && projectId) {
        analysisResult = await this.runRealAnalysis(parsedData, scenario, projectId);
        if (!analysisResult) {
          errors.push('Failed to complete analysis');
          success = false;
        }
      }

      // Step 6: Validate analysis results
      if (success && analysisResult) {
        const validationResult = await this.validateAnalysisResults(analysisResult, scenario);
        if (!validationResult) {
          errors.push('Analysis results validation failed');
          success = false;
        }
      }

      const duration = performance.now() - startTime;

      return {
        testName: scenario.name,
        status: success ? 'pass' : 'fail',
        duration,
        message: success ? 
          `Successfully processed ${scenario.fileType.toUpperCase()} file with ${scenario.expectedRows} rows and completed ${scenario.analysisType} analysis` :
          `Failed: ${errors.join(', ')}`,
        assertions: 6, // Number of test steps
        passedAssertions: success ? 6 : Math.max(0, 6 - errors.length),
        category: 'file-analysis'
      };
    } catch (error) {
      const duration = performance.now() - startTime;
      
      return {
        testName: scenario.name,
        status: 'fail',
        duration,
        error: error instanceof Error ? error.message : 'Unknown error',
        message: `File analysis test failed: ${scenario.description}`,
        assertions: 6,
        passedAssertions: 0,
        category: 'file-analysis'
      };
    }
  }

  private async generateTestFile(scenario: FileAnalysisTestScenario): Promise<Blob | null> {
    try {
      switch (scenario.fileType) {
        case 'csv':
          return this.generateTestCSV(scenario);
        case 'json':
          return this.generateTestJSON(scenario);
        default:
          return null;
      }
    } catch (error) {
      console.error('Error generating test file:', error);
      return null;
    }
  }

  private generateTestCSV(scenario: FileAnalysisTestScenario): Blob {
    const headers = this.getCSVHeaders(scenario.analysisType, scenario.expectedColumns);
    const rows = this.generateCSVRows(scenario.analysisType, scenario.expectedRows, headers);
    
    const csvContent = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
    
    return new Blob([csvContent], { type: 'text/csv' });
  }

  private generateTestJSON(scenario: FileAnalysisTestScenario): Blob {
    const data = this.generateJSONData(scenario.analysisType, scenario.expectedRows, scenario.expectedColumns);
    
    return new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  }

  private getCSVHeaders(analysisType: string, columnCount: number): string[] {
    const baseHeaders = ['id', 'timestamp', 'user_id'];
    
    switch (analysisType) {
      case 'user_behavior':
        return [...baseHeaders, 'action', 'page_url', 'session_duration', 'device_type'];
      case 'sales_analysis':
        return [...baseHeaders, 'product_id', 'quantity', 'price', 'discount', 'total', 'payment_method', 'customer_segment', 'region', 'category'];
      case 'performance_metrics':
        return [...baseHeaders, 'cpu_usage', 'memory_usage', 'disk_io', 'network_latency', 'response_time', 'error_rate', 'throughput', 'concurrent_users', 'cache_hit_rate', 'db_connections', 'queue_length', 'gc_time', 'heap_size', 'uptime', 'load_average', 'bandwidth_usage'];
      case 'api_analytics':
        return [...baseHeaders, 'endpoint', 'method', 'status_code', 'response_time', 'payload_size'];
      case 'event_tracking':
        return [...baseHeaders, 'event_type', 'event_category', 'event_label', 'event_value', 'source', 'medium', 'campaign', 'content', 'term', 'browser', 'os', 'screen_resolution'];
      case 'financial_analysis':
        return [...baseHeaders, 'account_id', 'transaction_type', 'amount', 'currency', 'fee', 'exchange_rate', 'balance_before', 'balance_after', 'category', 'subcategory', 'merchant', 'description', 'risk_score', 'compliance_flag', 'settlement_date', 'reference_number', 'channel', 'location', 'card_type', 'authorization_code', 'processor_response'];
      case 'streaming_data':
        return [...baseHeaders, 'sensor_id', 'value', 'quality'];
      case 'ecommerce_analysis':
        return [...baseHeaders, 'session_id', 'product_id', 'product_name', 'category', 'subcategory', 'brand', 'price', 'quantity', 'discount_amount', 'total_amount', 'payment_method', 'shipping_method', 'country', 'state', 'city', 'postal_code', 'referrer'];
      default:
        return [...baseHeaders, ...Array.from({ length: columnCount - 3 }, (_, i) => `column_${i + 4}`)];
    }
  }

  private generateCSVRows(analysisType: string, rowCount: number, headers: string[]): string[][] {
    const rows: string[][] = [];
    
    for (let i = 0; i < rowCount; i++) {
      const row: string[] = [];
      
      for (const header of headers) {
        switch (header) {
          case 'id':
            row.push((i + 1).toString());
            break;
          case 'timestamp':
            row.push(new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString());
            break;
          case 'user_id':
            row.push(`user_${Math.floor(Math.random() * 1000) + 1}`);
            break;
          case 'action':
            row.push(['click', 'view', 'scroll', 'hover', 'submit'][Math.floor(Math.random() * 5)]);
            break;
          case 'page_url':
            row.push(`/page/${Math.floor(Math.random() * 20) + 1}`);
            break;
          case 'price':
          case 'amount':
          case 'total':
          case 'total_amount':
            row.push((Math.random() * 1000 + 10).toFixed(2));
            break;
          case 'quantity':
            row.push((Math.floor(Math.random() * 10) + 1).toString());
            break;
          case 'cpu_usage':
          case 'memory_usage':
          case 'error_rate':
            row.push((Math.random() * 100).toFixed(2));
            break;
          case 'response_time':
          case 'network_latency':
            row.push((Math.floor(Math.random() * 1000 + 50)).toString());
            break;
          case 'status_code':
            row.push(['200', '201', '400', '404', '500'][Math.floor(Math.random() * 5)]);
            break;
          case 'method':
            row.push(['GET', 'POST', 'PUT', 'DELETE'][Math.floor(Math.random() * 4)]);
            break;
          case 'event_type':
            row.push(['pageview', 'click', 'form_submit', 'video_play'][Math.floor(Math.random() * 4)]);
            break;
          case 'value':
            row.push((Math.random() * 100).toFixed(3));
            break;
          default:
            row.push(`value_${Math.floor(Math.random() * 100)}`);
        }
      }
      
      rows.push(row);
    }
    
    return rows;
  }

  private generateJSONData(analysisType: string, rowCount: number, columnCount: number): any[] {
    const data: any[] = [];
    
    for (let i = 0; i < rowCount; i++) {
      const item: any = {
        id: i + 1,
        timestamp: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
        user_id: `user_${Math.floor(Math.random() * 1000) + 1}`
      };

      switch (analysisType) {
        case 'api_analytics':
          item.endpoint = `/api/v1/endpoint_${Math.floor(Math.random() * 20) + 1}`;
          item.method = ['GET', 'POST', 'PUT', 'DELETE'][Math.floor(Math.random() * 4)];
          item.status_code = [200, 201, 400, 404, 500][Math.floor(Math.random() * 5)];
          item.response_time = Math.floor(Math.random() * 1000 + 50);
          item.payload_size = Math.floor(Math.random() * 10000 + 100);
          break;
        case 'event_tracking':
          item.event = {
            type: ['pageview', 'click', 'form_submit', 'video_play'][Math.floor(Math.random() * 4)],
            category: 'user_interaction',
            label: `action_${Math.floor(Math.random() * 10) + 1}`,
            value: Math.floor(Math.random() * 100),
            properties: {
              source: 'organic',
              medium: 'web',
              campaign: `campaign_${Math.floor(Math.random() * 5) + 1}`,
              browser: ['Chrome', 'Firefox', 'Safari', 'Edge'][Math.floor(Math.random() * 4)],
              os: ['Windows', 'macOS', 'Linux', 'iOS', 'Android'][Math.floor(Math.random() * 5)]
            }
          };
          break;
        case 'ecommerce_analysis':
          item.session_id = `session_${Math.random().toString(36).substr(2, 9)}`;
          item.product = {
            id: `prod_${Math.floor(Math.random() * 1000) + 1}`,
            name: `Product ${Math.floor(Math.random() * 100) + 1}`,
            category: ['Electronics', 'Clothing', 'Books', 'Home'][Math.floor(Math.random() * 4)],
            price: parseFloat((Math.random() * 500 + 10).toFixed(2))
          };
          item.transaction = {
            quantity: Math.floor(Math.random() * 5) + 1,
            total: parseFloat((Math.random() * 1000 + 50).toFixed(2)),
            payment_method: ['credit_card', 'paypal', 'apple_pay'][Math.floor(Math.random() * 3)]
          };
          break;
        default:
          // Add generic properties
          for (let j = 3; j < columnCount; j++) {
            item[`property_${j}`] = `value_${Math.floor(Math.random() * 100)}`;
          }
      }
      
      data.push(item);
    }
    
    return data;
  }

  private async uploadTestFile(fileData: Blob, scenario: FileAnalysisTestScenario): Promise<string> {
    try {
      const fileName = `test-${scenario.analysisType}-${Date.now()}.${scenario.fileType}`;
      const filePath = `test-uploads/${fileName}`;

      const { data, error } = await supabase.storage
        .from('datasets')
        .upload(filePath, fileData);

      if (error) {
        console.error('File upload error:', error);
        return '';
      }

      this.uploadedFiles.push(filePath);
      return filePath;
    } catch (error) {
      console.error('Error uploading test file:', error);
      return '';
    }
  }

  private async processUploadedFile(uploadPath: string, scenario: FileAnalysisTestScenario): Promise<any> {
    try {
      // Download the file from storage
      const { data, error } = await supabase.storage
        .from('datasets')
        .download(uploadPath);

      if (error || !data) {
        console.error('File download error:', error);
        return null;
      }

      // Process based on file type
      const text = await data.text();
      
      if (scenario.fileType === 'csv') {
        return this.parseCSVContent(text);
      } else if (scenario.fileType === 'json') {
        return JSON.parse(text);
      }

      return null;
    } catch (error) {
      console.error('Error processing uploaded file:', error);
      return null;
    }
  }

  private parseCSVContent(csvText: string): any {
    const lines = csvText.trim().split('\n');
    const headers = lines[0].split(',');
    const rows = lines.slice(1).map(line => {
      const values = line.split(',');
      const row: any = {};
      headers.forEach((header, index) => {
        row[header] = values[index] || '';
      });
      return row;
    });

    return {
      headers,
      data: rows,
      rowCount: rows.length,
      columns: headers.length
    };
  }

  private async createTestProject(scenario: FileAnalysisTestScenario): Promise<string> {
    try {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        console.error('No authenticated user for project creation');
        return '';
      }

      const { data, error } = await supabase
        .from('projects')
        .insert({
          name: `Test Project - ${scenario.name}`,
          research_question: `Analyze ${scenario.analysisType} patterns and trends`,
          business_context: `Test analysis for ${scenario.description}`,
          user_id: user.id,
          mode: 'professional'
        })
        .select()
        .single();

      if (error) {
        console.error('Project creation error:', error);
        return '';
      }

      this.createdProjects.push(data.id);
      return data.id;
    } catch (error) {
      console.error('Error creating test project:', error);
      return '';
    }
  }

  private async runRealAnalysis(parsedData: any, scenario: FileAnalysisTestScenario, projectId: string): Promise<any> {
    try {
      const analysisContext: DataAnalysisContext = {
        researchQuestion: `Analyze ${scenario.analysisType} patterns and provide insights`,
        additionalContext: `This is a test analysis for ${scenario.description}`,
        parsedData: [{
          id: projectId,
          name: `test-${scenario.analysisType}`,
          rows: scenario.expectedRows,
          columns: scenario.expectedColumns,
          rowCount: scenario.expectedRows,
          data: Array.isArray(parsedData) ? parsedData : parsedData.data || []
        }],
        educationalMode: false
      };

      // Use the real analysis coordinator
      const result = await AnalysisCoordinator.executeAnalysis(analysisContext);
      
      return result;
    } catch (error) {
      console.error('Error running real analysis:', error);
      return null;
    }
  }

  private async validateAnalysisResults(analysisResult: any, scenario: FileAnalysisTestScenario): Promise<boolean> {
    try {
      // Validate that analysis results contain expected components
      const hasInsights = analysisResult.insights && analysisResult.insights.length > 0;
      const hasRecommendations = analysisResult.recommendations && analysisResult.recommendations.length > 0;
      const hasResults = analysisResult.results && analysisResult.results.length > 0;
      const hasConfidence = analysisResult.confidence && ['high', 'medium', 'low'].includes(analysisResult.confidence);

      // Validate that results are relevant to the analysis type
      const insightsText = analysisResult.insights.join(' ').toLowerCase();
      const analysisTypeKeywords = scenario.analysisType.replace('_', ' ').toLowerCase();
      const hasRelevantContent = insightsText.includes(analysisTypeKeywords.split(' ')[0]);

      return hasInsights && hasRecommendations && hasResults && hasConfidence && hasRelevantContent;
    } catch (error) {
      console.error('Error validating analysis results:', error);
      return false;
    }
  }

  private async cleanupTestData(): Promise<void> {
    try {
      // Clean up uploaded files
      for (const filePath of this.uploadedFiles) {
        await supabase.storage
          .from('datasets')
          .remove([filePath]);
      }

      // Clean up created projects
      if (this.createdProjects.length > 0) {
        await supabase
          .from('projects')
          .delete()
          .in('id', this.createdProjects);
      }

      this.uploadedFiles = [];
      this.createdProjects = [];
    } catch (error) {
      console.error('Cleanup error:', error);
    }
  }

  getTestScenarios(): FileAnalysisTestScenario[] {
    return [...this.testScenarios];
  }
}