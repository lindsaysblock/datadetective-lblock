
import { AnalysisResult } from '../analysis/types';
import { ParsedData } from '../dataParser';

interface ExportConfig {
  format: 'json' | 'csv' | 'xlsx' | 'pdf';
  includeCharts: boolean;
  includeRawData: boolean;
  compression: boolean;
}

interface AnalyticsExport {
  version: string;
  timestamp: string;
  metadata: {
    source: string;
    analyst: string;
    description: string;
  };
  data: ParsedData;
  results: AnalysisResult[];
  config: ExportConfig;
}

export class AnalyticsExportImport {
  private readonly version = '1.0.0';

  async exportAnalytics(
    data: ParsedData,
    results: AnalysisResult[],
    config: Partial<ExportConfig> = {}
  ): Promise<Blob> {
    const exportConfig: ExportConfig = {
      format: 'json',
      includeCharts: true,
      includeRawData: true,
      compression: false,
      ...config
    };

    const exportData: AnalyticsExport = {
      version: this.version,
      timestamp: new Date().toISOString(),
      metadata: {
        source: 'Analytics Engine',
        analyst: 'System',
        description: 'Automated analytics export'
      },
      data: exportConfig.includeRawData ? data : this.createDataSummary(data),
      results,
      config: exportConfig
    };

    switch (exportConfig.format) {
      case 'json':
        return this.exportAsJSON(exportData);
      case 'csv':
        return this.exportAsCSV(exportData);
      case 'xlsx':
        return this.exportAsExcel(exportData);
      case 'pdf':
        return this.exportAsPDF(exportData);
      default:
        throw new Error(`Unsupported export format: ${exportConfig.format}`);
    }
  }

  async importAnalytics(file: File): Promise<{
    data: ParsedData;
    results: AnalysisResult[];
    metadata: any;
  }> {
    const extension = file.name?.split('.').pop()?.toLowerCase();
    
    switch (extension) {
      case 'json':
        return this.importFromJSON(file);
      case 'csv':
        return this.importFromCSV(file);
      case 'xlsx':
        return this.importFromExcel(file);
      default:
        throw new Error(`Unsupported import format: ${extension}`);
    }
  }

  private async exportAsJSON(data: AnalyticsExport): Promise<Blob> {
    const jsonString = JSON.stringify(data, null, 2);
    return new Blob([jsonString], { type: 'application/json' });
  }

  private async exportAsCSV(data: AnalyticsExport): Promise<Blob> {
    const csvLines: string[] = [];
    
    // Export results as CSV
    if (data.results.length > 0) {
      const headers = ['ID', 'Title', 'Description', 'Value', 'Confidence', 'Insight'];
      csvLines.push(headers.join(','));
      
      data.results.forEach(result => {
        const row = [
          result.id,
          `"${result.title.replace(/"/g, '""')}"`,
          `"${result.description.replace(/"/g, '""')}"`,
          result.value?.toString() || '',
          result.confidence,
          `"${result.insight.replace(/"/g, '""')}"`
        ];
        csvLines.push(row.join(','));
      });
    }
    
    return new Blob([csvLines.join('\n')], { type: 'text/csv' });
  }

  private async exportAsExcel(data: AnalyticsExport): Promise<Blob> {
    // Simplified Excel export - in real implementation, use a library like xlsx
    const workbookData = {
      worksheets: [
        {
          name: 'Analysis Results',
          data: data.results.map(result => ({
            ID: result.id,
            Title: result.title,
            Description: result.description,
            Value: result.value,
            Confidence: result.confidence,
            Insight: result.insight
          }))
        },
        {
          name: 'Data Summary',
          data: [{
            'Total Rows': data.data.rowCount,
            'Total Columns': data.data.columns.length,
            'File Size': data.data.fileSize,
            'Export Date': data.timestamp
          }]
        }
      ]
    };
    
    const excelString = JSON.stringify(workbookData);
    return new Blob([excelString], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  }

  private async exportAsPDF(data: AnalyticsExport): Promise<Blob> {
    // Simplified PDF export - in real implementation, use a PDF library
    const pdfContent = this.generatePDFContent(data);
    return new Blob([pdfContent], { type: 'application/pdf' });
  }

  private generatePDFContent(data: AnalyticsExport): string {
    return `
Analytics Report
Generated: ${data.timestamp}
Version: ${data.version}

Data Summary:
- Total Rows: ${data.data.rowCount}
- Total Columns: ${data.data.columns.length}
- File Size: ${data.data.fileSize} bytes

Analysis Results:
${data.results.map(result => `
${result.title}
${result.description}
Confidence: ${result.confidence}
${result.insight}
`).join('\n')}
    `.trim();
  }

  private async importFromJSON(file: File): Promise<any> {
    const text = await file.text();
    const importedData: AnalyticsExport = JSON.parse(text);
    
    this.validateImportData(importedData);
    
    return {
      data: importedData.data,
      results: importedData.results,
      metadata: importedData.metadata
    };
  }

  private async importFromCSV(file: File): Promise<any> {
    const text = await file.text();
    const lines = text.split('\n');
    const headers = lines[0].split(',');
    
    const results: AnalysisResult[] = lines.slice(1)
      .filter(line => line.trim())
      .map((line, index) => {
        const values = line.split(',');
        return {
          id: values[0] || `imported_${index}`,
          title: values[1]?.replace(/"/g, '') || 'Imported Result',
          description: values[2]?.replace(/"/g, '') || '',
          value: values[3] ? parseFloat(values[3]) : 0,
          confidence: (values[4] as 'high' | 'medium' | 'low') || 'medium',
          insight: values[5]?.replace(/"/g, '') || ''
        };
      });
    
    return {
      data: this.createEmptyDataSet(),
      results,
      metadata: { source: 'CSV Import', timestamp: new Date().toISOString() }
    };
  }

  private async importFromExcel(file: File): Promise<any> {
    // Simplified Excel import - in real implementation, use xlsx library
    const text = await file.text();
    
    try {
      const data = JSON.parse(text);
      return {
        data: this.createEmptyDataSet(),
        results: data.worksheets?.[0]?.data || [],
        metadata: { source: 'Excel Import', timestamp: new Date().toISOString() }
      };
    } catch (error) {
      throw new Error('Invalid Excel file format');
    }
  }

  private validateImportData(data: AnalyticsExport): void {
    if (!data.version || !data.results || !Array.isArray(data.results)) {
      throw new Error('Invalid analytics export format');
    }
    
    if (data.version !== this.version) {
      console.warn(`Version mismatch: expected ${this.version}, got ${data.version}`);
    }
  }

  private createDataSummary(data: ParsedData): ParsedData {
    return {
      columns: data.columns,
      rows: [], // Don't include raw data in summary
      rowCount: data.rowCount,
      fileSize: data.fileSize,
      summary: data.summary
    };
  }

  private createEmptyDataSet(): ParsedData {
    return {
      columns: [],
      rows: [],
      rowCount: 0,
      fileSize: 0,
      summary: { totalRows: 0, totalColumns: 0 }
    };
  }

  downloadBlob(blob: Blob, filename: string): void {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}
