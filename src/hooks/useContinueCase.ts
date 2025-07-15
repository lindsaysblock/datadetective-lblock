
import { useCallback } from 'react';
import { ParsedDataFile } from '@/types/data';
import { Dataset, EnhancedDatasetMetadata } from './useDatasetPersistence';

export const useContinueCase = () => {
  const reconstructAnalysisState = useCallback((dataset: Dataset) => {
    console.log('🔍 Reconstructing analysis state for dataset:', dataset.id);
    
    // Extract enhanced metadata if available
    const metadata = dataset.metadata as EnhancedDatasetMetadata;
    
    if (metadata && metadata.analysisReady && metadata.parsedData) {
      console.log('✅ Using enhanced metadata for reconstruction');
      
      return {
        researchQuestion: metadata.researchQuestion || '',
        additionalContext: metadata.additionalContext || '',
        parsedData: metadata.parsedData,
        projectName: metadata.projectName || dataset.name,
        step: 4 // Go directly to analysis step
      };
    }
    
    // Fallback to legacy reconstruction if enhanced metadata is not available
    console.log('⚠️ Using legacy metadata reconstruction');
    
    const legacyParsedData: ParsedDataFile[] = [{
      id: dataset.id,
      name: dataset.original_filename,
      columns: Array.isArray(dataset.metadata?.columns) ? dataset.metadata.columns.length : 0,
      rows: dataset.metadata?.totalRows || dataset.summary?.totalRows || 0,
      rowCount: dataset.metadata?.totalRows || dataset.summary?.totalRows || 0,
      preview: Array.isArray(dataset.metadata?.sample_rows) ? dataset.metadata.sample_rows : [],
      data: Array.isArray(dataset.metadata?.sample_rows) ? dataset.metadata.sample_rows : [],
      columnInfo: Array.isArray(dataset.metadata?.columns) ? dataset.metadata.columns.map((col: any) => ({
        name: col.name || col,
        type: col.type || 'string',
        samples: col.samples || []
      })) : [],
      summary: {
        totalRows: dataset.metadata?.totalRows || dataset.summary?.totalRows || 0,
        totalColumns: Array.isArray(dataset.metadata?.columns) ? dataset.metadata.columns.length : 0,
        possibleUserIdColumns: dataset.summary?.possibleUserIdColumns || [],
        possibleEventColumns: dataset.summary?.possibleEventColumns || [],
        possibleTimestampColumns: dataset.summary?.possibleTimestampColumns || []
      }
    }];
    
    return {
      researchQuestion: dataset.summary?.researchQuestion || '',
      additionalContext: dataset.summary?.description || dataset.summary?.additionalContext || '',
      parsedData: legacyParsedData,
      projectName: dataset.summary?.projectName || dataset.name,
      step: 4
    };
  }, []);

  const createMockFilesFromParsedData = useCallback((parsedData: ParsedDataFile[]) => {
    console.log('🔧 Creating mock files for continue case analysis...');
    
    return parsedData.map(data => {
      const columnHeaders = data.columnInfo?.map(col => col.name) || [];
      const sampleRows = data.preview || data.data || [];
      
      console.log('📊 Processing file:', {
        name: data.name,
        columns: columnHeaders.length,
        sampleRows: sampleRows.length,
        totalRows: data.rowCount
      });
      
      // Create comprehensive CSV content with realistic data
      const csvRows = [columnHeaders.join(',')];
      
      // Use actual data rows if available
      if (sampleRows.length > 0) {
        // Process existing sample rows
        sampleRows.forEach(row => {
          const csvRow = columnHeaders.map(header => {
            const value = row[header];
            // Handle different data types properly
            if (value === null || value === undefined) return '';
            if (typeof value === 'string' && value.includes(',')) return `"${value.replace(/"/g, '""')}"`;
            return String(value);
          }).join(',');
          csvRows.push(csvRow);
        });
        
        // Generate additional rows if we need more data for analysis
        const neededRows = Math.max(50, Math.min(100, data.rowCount || 50)) - sampleRows.length;
        if (neededRows > 0) {
          console.log(`📈 Generating ${neededRows} additional rows for robust analysis`);
          
          for (let i = 0; i < neededRows; i++) {
            const syntheticRow = columnHeaders.map((header, colIndex) => {
              const columnInfo = data.columnInfo?.[colIndex];
              const samples = columnInfo?.samples || [];
              
              // Generate realistic data based on column type and samples
              if (samples.length > 0) {
                // Use existing samples as basis
                const sample = samples[Math.floor(Math.random() * samples.length)];
                if (typeof sample === 'number') {
                  return String(sample + Math.floor(Math.random() * 100) - 50);
                } else if (typeof sample === 'string') {
                  return sample.includes(',') ? `"${sample}_${i}"` : `${sample}_${i}`;
                }
                return String(sample);
              }
              
              // Generate based on column type
              switch (columnInfo?.type) {
                case 'number':
                  return String(Math.floor(Math.random() * 1000) + 1);
                case 'date':
                  const date = new Date();
                  date.setDate(date.getDate() - Math.floor(Math.random() * 365));
                  return date.toISOString().split('T')[0];
                default:
                  return header.includes(',') ? `"sample_${colIndex}_${i}"` : `sample_${colIndex}_${i}`;
              }
            }).join(',');
            
            csvRows.push(syntheticRow);
          }
        }
      } else {
        // Create completely synthetic data if no sample data exists
        console.log('🎭 Creating synthetic data - no sample data available');
        const rowCount = Math.max(20, Math.min(100, data.rowCount || 50));
        
        for (let i = 0; i < rowCount; i++) {
          const syntheticRow = columnHeaders.map((header, colIndex) => {
            // Generate realistic data based on column name patterns
            if (header.toLowerCase().includes('id')) {
              return String(i + 1);
            } else if (header.toLowerCase().includes('name')) {
              return `"Sample ${header} ${i + 1}"`;
            } else if (header.toLowerCase().includes('date') || header.toLowerCase().includes('time')) {
              const date = new Date();
              date.setDate(date.getDate() - Math.floor(Math.random() * 365));
              return date.toISOString().split('T')[0];
            } else if (header.toLowerCase().includes('amount') || header.toLowerCase().includes('value') || header.toLowerCase().includes('price')) {
              return String((Math.random() * 1000).toFixed(2));
            } else {
              return `"${header}_value_${i + 1}"`;
            }
          }).join(',');
          
          csvRows.push(syntheticRow);
        }
      }
      
      const csvContent = csvRows.join('\n');
      
      console.log('✅ Created mock file:', {
        filename: data.name,
        size: csvContent.length,
        rows: csvRows.length - 1, // Subtract header row
        columns: columnHeaders.length,
        sampleContent: csvContent.substring(0, 200) + '...'
      });
      
      // Create a proper File object with the CSV content
      const file = new File([csvContent], data.name, { 
        type: 'text/csv',
        lastModified: Date.now()
      });
      
      // Add custom properties to help with analysis
      (file as any).parsedData = data;
      (file as any).isReconstructed = true;
      
      return file;
    });
  }, []);

  return {
    reconstructAnalysisState,
    createMockFilesFromParsedData
  };
};
