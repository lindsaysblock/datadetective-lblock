
import { useCallback } from 'react';
import { ParsedDataFile } from '@/types/data';
import { Dataset, EnhancedDatasetMetadata } from './useDatasetPersistence';

export const useContinueCase = () => {
  const reconstructAnalysisState = useCallback((dataset: Dataset) => {
    console.log('Reconstructing analysis state for dataset:', dataset.id);
    
    // Extract enhanced metadata if available
    const metadata = dataset.metadata as EnhancedDatasetMetadata;
    
    if (metadata && metadata.analysisReady && metadata.parsedData) {
      console.log('Using enhanced metadata for reconstruction');
      
      return {
        researchQuestion: metadata.researchQuestion || '',
        additionalContext: metadata.additionalContext || '',
        parsedData: metadata.parsedData,
        projectName: metadata.projectName || dataset.name,
        step: 4 // Go directly to analysis step
      };
    }
    
    // Fallback to legacy reconstruction if enhanced metadata is not available
    console.log('Using legacy metadata reconstruction');
    
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
    return parsedData.map(data => {
      const columnHeaders = data.columnInfo?.map(col => col.name) || [];
      const sampleRows = data.preview || data.data || [];
      
      // Create proper CSV content with sufficient data for analysis
      const csvRows = [columnHeaders.join(',')];
      
      // Use actual data rows if available, otherwise create sample rows
      if (sampleRows.length > 0) {
        csvRows.push(...sampleRows.slice(0, Math.min(100, sampleRows.length)).map(row => 
          columnHeaders.map(header => {
            const value = row[header];
            // Handle different data types and ensure no undefined values
            if (value === null || value === undefined) return '';
            if (typeof value === 'string' && value.includes(',')) return `"${value}"`;
            return String(value);
          }).join(',')
        ));
      } else {
        // Create minimal sample data if no actual data exists
        for (let i = 0; i < Math.min(10, data.rowCount || 10); i++) {
          csvRows.push(columnHeaders.map((header, index) => `sample_${index}_${i}`).join(','));
        }
      }
      
      const csvContent = csvRows.join('\n');
      console.log('Created mock file for continue case:', {
        filename: data.name,
        size: csvContent.length,
        rows: csvRows.length - 1,
        columns: columnHeaders.length
      });
      
      return new File([csvContent], data.name, { type: 'text/csv' });
    });
  }, []);

  return {
    reconstructAnalysisState,
    createMockFilesFromParsedData
  };
};
