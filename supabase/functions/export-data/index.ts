
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ExportRequest {
  datasetId: string;
  format: 'csv' | 'json' | 'excel';
  includeAnalysis?: boolean;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { datasetId, format, includeAnalysis }: ExportRequest = await req.json();

    console.log(`Exporting dataset ${datasetId} in format: ${format}`);

    // Get dataset
    const { data: dataset, error: datasetError } = await supabase
      .from('datasets')
      .select('*')
      .eq('id', datasetId)
      .single();

    if (datasetError || !dataset) {
      throw new Error('Dataset not found');
    }

    // Get original file data
    let exportData = '';
    let fileName = `${dataset.name}_export`;
    let contentType = 'text/plain';

    if (dataset.storage_path) {
      const { data: fileData, error } = await supabase.storage
        .from('datasets')
        .download(dataset.storage_path);
      
      if (error) {
        throw new Error('Failed to download original file');
      }

      const originalData = await fileData.text();

      switch (format) {
        case 'csv':
          exportData = originalData;
          fileName += '.csv';
          contentType = 'text/csv';
          break;
        
        case 'json':
          // Convert CSV to JSON if needed
          exportData = convertToJSON(originalData, dataset.metadata);
          fileName += '.json';
          contentType = 'application/json';
          break;
        
        case 'excel':
          // For now, export as CSV with Excel-compatible format
          exportData = originalData;
          fileName += '.csv';
          contentType = 'text/csv';
          break;
      }
    } else {
      // Use metadata if no storage path
      exportData = JSON.stringify({
        metadata: dataset.metadata,
        summary: dataset.summary
      }, null, 2);
      fileName += '.json';
      contentType = 'application/json';
    }

    // Include analysis results if requested
    if (includeAnalysis) {
      const { data: analysisResults } = await supabase
        .from('analysis_results')
        .select('*')
        .eq('dataset_id', datasetId);

      if (analysisResults && analysisResults.length > 0) {
        const analysisData = {
          dataset: {
            name: dataset.name,
            summary: dataset.summary
          },
          analysis_results: analysisResults,
          exported_at: new Date().toISOString()
        };

        if (format === 'json') {
          const originalJson = JSON.parse(exportData);
          exportData = JSON.stringify({
            ...originalJson,
            analysis: analysisData
          }, null, 2);
        } else {
          // Append analysis as comments for CSV
          exportData += '\n\n# Analysis Results\n';
          exportData += `# Generated: ${analysisData.exported_at}\n`;
          analysisResults.forEach(result => {
            exportData += `# ${result.type}: ${result.title}\n`;
            exportData += `# ${result.description}\n`;
          });
        }
      }
    }

    // Log the export
    console.log(`Export completed for dataset ${datasetId}, size: ${exportData.length} bytes`);

    return new Response(exportData, {
      headers: {
        ...corsHeaders,
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${fileName}"`,
      },
    });

  } catch (error) {
    console.error('Error exporting data:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Failed to export data' 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});

function convertToJSON(csvData: string, metadata: any) {
  const lines = csvData.split('\n').filter(line => line.trim());
  if (lines.length === 0) return JSON.stringify([]);

  const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
  const rows = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
    const row: any = {};
    
    headers.forEach((header, index) => {
      const value = values[index] || '';
      // Try to parse as number if possible
      const numValue = parseFloat(value);
      row[header] = !isNaN(numValue) && value !== '' ? numValue : value;
    });
    
    rows.push(row);
  }

  return JSON.stringify({
    metadata,
    data: rows
  }, null, 2);
}
