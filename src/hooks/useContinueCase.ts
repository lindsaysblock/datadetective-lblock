
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
    
    // Fallback to legacy reconstruction with better error handling
    console.log('⚠️ Using legacy metadata reconstruction');
    
    // Validate basic data structure
    if (!dataset.summary && !dataset.metadata) {
      console.error('❌ No metadata or summary found in dataset');
      throw new Error('Dataset missing required metadata for reconstruction');
    }
    
    // Extract column information more safely
    const columns = Array.isArray(dataset.metadata?.columns) 
      ? dataset.metadata.columns 
      : [];
    
    const sampleRows = Array.isArray(dataset.metadata?.sample_rows) 
      ? dataset.metadata.sample_rows 
      : [];
    
    const totalRows = dataset.metadata?.totalRows || dataset.summary?.totalRows || sampleRows.length;
    
    const legacyParsedData: ParsedDataFile[] = [{
      id: dataset.id,
      name: dataset.original_filename,
      columns: columns.length,
      rows: totalRows,
      rowCount: totalRows,
      preview: sampleRows.slice(0, 10), // Limit preview to first 10 rows
      data: sampleRows,
      columnInfo: columns.map((col: any) => ({
        name: typeof col === 'string' ? col : col.name || `column_${Math.random()}`,
        type: typeof col === 'object' && col.type ? col.type : 'string',
        samples: typeof col === 'object' && col.samples ? col.samples.slice(0, 5) : []
      })),
      summary: {
        totalRows,
        totalColumns: columns.length,
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

  const createMockFilesFromParsedData = useCallback((parsedData: ParsedDataFile[], originalFileSize?: number) => {
    console.log('🔧 Creating mock files for continue case analysis...');
    
    return parsedData.map(data => {
      console.log('📊 Processing continue case file:', {
        name: data.name,
        columns: data.columnInfo?.length || 0,
        dataRows: data.data?.length || 0,
        totalRows: data.rowCount,
        originalFileSize
      });
      
      // Validate that we have the necessary data
      if (!data.columnInfo || data.columnInfo.length === 0) {
        console.error('❌ No column information available for:', data.name);
        throw new Error(`No column information available for ${data.name}`);
      }
      
      const columnHeaders = data.columnInfo.map(col => col.name);
      const existingRows = data.data || data.preview || [];
      
      // Create CSV content with proper escaping
      const csvRows = [columnHeaders.join(',')];
      
      // Use existing data rows if available
      if (existingRows.length > 0) {
        existingRows.forEach(row => {
          const csvRow = columnHeaders.map(header => {
            const value = row[header];
            if (value === null || value === undefined) return '';
            
            // Proper CSV escaping
            const stringValue = String(value);
            if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
              return `"${stringValue.replace(/"/g, '""')}"`;
            }
            return stringValue;
          }).join(',');
          csvRows.push(csvRow);
        });
      }
      
      // Generate additional sample rows to have meaningful data for analysis
      const minRows = Math.max(existingRows.length, 50); // Ensure we have at least 50 rows for analysis
      if (existingRows.length < minRows) {
        const neededRows = minRows - existingRows.length;
        console.log(`📈 Generating ${neededRows} additional sample rows for analysis`);
        
        for (let i = 0; i < neededRows; i++) {
          const syntheticRow = columnHeaders.map((header, colIndex) => {
            const columnInfo = data.columnInfo?.[colIndex];
            const samples = columnInfo?.samples || [];
            
            // Use samples if available, otherwise generate based on column name/type
            if (samples.length > 0) {
              const sample = samples[Math.floor(Math.random() * samples.length)];
              if (typeof sample === 'number') {
                return String(sample + Math.floor(Math.random() * 10) - 5);
              } else if (typeof sample === 'string') {
                return sample.includes(',') ? `"${sample}_${i}"` : `${sample}_${i}`;
              }
              return String(sample);
            }
            
            // Generate based on column name patterns
            const lowerHeader = header.toLowerCase();
            if (lowerHeader.includes('id')) {
              return String(1000 + i);
            } else if (lowerHeader.includes('name') || lowerHeader.includes('title')) {
              return `"Sample ${header} ${i + 1}"`;
            } else if (lowerHeader.includes('date') || lowerHeader.includes('time')) {
              const date = new Date();
              date.setDate(date.getDate() - Math.floor(Math.random() * 365));
              return date.toISOString().split('T')[0];
            } else if (lowerHeader.includes('amount') || lowerHeader.includes('value') || lowerHeader.includes('price')) {
              return String((Math.random() * 1000).toFixed(2));
            } else {
              return `"${header}_value_${i + 1}"`;
            }
          }).join(',');
          
          csvRows.push(syntheticRow);
        }
      }
      
      const csvContent = csvRows.join('\n');
      
      // Calculate a realistic file size based on content
      const calculatedSize = new Blob([csvContent]).size;
      const finalSize = originalFileSize || calculatedSize;
      
      console.log('✅ Created continue case file:', {
        filename: data.name,
        contentSize: calculatedSize,
        reportedSize: finalSize,
        totalRows: csvRows.length - 1,
        columns: columnHeaders.length
      });
      
      // Create a File object that mimics a real uploaded file with proper size
      const file = new File([csvContent], data.name, { 
        type: 'text/csv',
        lastModified: Date.now()
      });
      
      // Override the size property to show the original file size
      Object.defineProperty(file, 'size', {
        value: finalSize,
        writable: false
      });
      
      // Add metadata to help the data pipeline
      (file as any).parsedData = data;
      (file as any).isReconstructed = true;
      (file as any).originalDataset = true;
      (file as any).originalSize = finalSize;
      
      return file;
    });
  }, []);

  return {
    reconstructAnalysisState,
    createMockFilesFromParsedData
  };
};
