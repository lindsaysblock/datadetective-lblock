
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface ProcessDatasetRequest {
  datasetId: string;
  processingType: 'quality' | 'insights' | 'visualization' | 'full';
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

    const { datasetId, processingType }: ProcessDatasetRequest = await req.json();

    console.log(`Processing dataset ${datasetId} with type: ${processingType}`);

    // Get dataset from database
    const { data: dataset, error: datasetError } = await supabase
      .from('datasets')
      .select('*')
      .eq('id', datasetId)
      .single();

    if (datasetError || !dataset) {
      throw new Error('Dataset not found');
    }

    // Get file from storage if exists
    let fileData = null;
    if (dataset.storage_path) {
      const { data, error } = await supabase.storage
        .from('datasets')
        .download(dataset.storage_path);
      
      if (!error) {
        fileData = await data.text();
      }
    }

    // Process based on type
    const results = [];
    
    if (processingType === 'quality' || processingType === 'full') {
      // Data quality analysis
      const qualityScore = calculateDataQuality(dataset.metadata, fileData);
      results.push({
        type: 'insight',
        title: 'Data Quality Assessment',
        description: `Overall data quality score: ${qualityScore.score}%`,
        data: qualityScore,
        confidence: qualityScore.score > 80 ? 'high' : qualityScore.score > 60 ? 'medium' : 'low'
      });
    }

    if (processingType === 'insights' || processingType === 'full') {
      // Generate insights
      const insights = generateDataInsights(dataset.metadata, dataset.summary);
      insights.forEach(insight => {
        results.push({
          type: 'insight',
          title: insight.title,
          description: insight.description,
          data: insight.data,
          confidence: insight.confidence
        });
      });
    }

    if (processingType === 'visualization' || processingType === 'full') {
      // Generate visualization recommendations
      const vizRecommendations = generateVisualizationRecommendations(dataset.metadata);
      results.push({
        type: 'visualization',
        title: 'Recommended Visualizations',
        description: 'AI-generated visualization recommendations for your data',
        data: vizRecommendations,
        confidence: 'high'
      });
    }

    // Save results to database
    for (const result of results) {
      await supabase
        .from('analysis_results')
        .insert({
          dataset_id: datasetId,
          user_id: dataset.user_id,
          ...result
        });
    }

    console.log(`Processed ${results.length} analysis results for dataset ${datasetId}`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        resultsCount: results.length,
        message: `Generated ${results.length} analysis results`
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Error processing dataset:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Failed to process dataset' 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});

function calculateDataQuality(metadata: any, fileData: string | null) {
  let score = 100;
  const issues = [];

  if (!metadata || !metadata.columns) {
    return { score: 0, issues: ['No metadata available'] };
  }

  // Check for missing values
  const columns = metadata.columns;
  let totalCells = 0;
  let missingCells = 0;

  columns.forEach((col: any) => {
    if (col.samples) {
      totalCells += col.samples.length;
      missingCells += col.samples.filter((val: any) => 
        val === null || val === undefined || val === ''
      ).length;
    }
  });

  const missingPercentage = totalCells > 0 ? (missingCells / totalCells) * 100 : 0;
  if (missingPercentage > 20) {
    score -= 30;
    issues.push(`High missing data rate: ${missingPercentage.toFixed(1)}%`);
  } else if (missingPercentage > 10) {
    score -= 15;
    issues.push(`Moderate missing data rate: ${missingPercentage.toFixed(1)}%`);
  }

  // Check for duplicate column names
  const columnNames = columns.map((col: any) => col.name);
  const uniqueNames = new Set(columnNames);
  if (uniqueNames.size !== columnNames.length) {
    score -= 20;
    issues.push('Duplicate column names detected');
  }

  // Check for data type consistency
  columns.forEach((col: any) => {
    if (col.samples && col.samples.length > 1) {
      const types = col.samples.map((val: any) => typeof val);
      const uniqueTypes = new Set(types);
      if (uniqueTypes.size > 2) { // Allow for null/undefined
        score -= 10;
        issues.push(`Inconsistent data types in column: ${col.name}`);
      }
    }
  });

  return {
    score: Math.max(0, score),
    issues,
    missingDataPercentage: missingPercentage,
    totalColumns: columns.length,
    totalRows: metadata.sample_rows?.length || 0
  };
}

function generateDataInsights(metadata: any, summary: any) {
  const insights = [];

  if (summary.totalRows && summary.totalColumns) {
    insights.push({
      title: 'Dataset Overview',
      description: `Your dataset contains ${summary.totalRows} rows and ${summary.totalColumns} columns, providing ${summary.totalRows > 1000 ? 'excellent' : summary.totalRows > 100 ? 'good' : 'limited'} statistical power for analysis.`,
      data: {
        rows: summary.totalRows,
        columns: summary.totalColumns,
        statisticalPower: summary.totalRows > 1000 ? 'high' : summary.totalRows > 100 ? 'medium' : 'low'
      },
      confidence: 'high'
    });
  }

  if (summary.possibleUserIdColumns && summary.possibleUserIdColumns.length > 0) {
    insights.push({
      title: 'User Identification Analysis',
      description: `Found ${summary.possibleUserIdColumns.length} potential user identifier column(s). This enables user-level analysis and cohort studies.`,
      data: {
        userIdColumns: summary.possibleUserIdColumns,
        analysisCapabilities: ['user behavior tracking', 'cohort analysis', 'personalization']
      },
      confidence: 'medium'
    });
  }

  if (metadata.columns) {
    const numericColumns = metadata.columns.filter((col: any) => 
      col.type === 'number' || col.samples?.some((val: any) => typeof val === 'number')
    );
    
    if (numericColumns.length > 0) {
      insights.push({
        title: 'Quantitative Analysis Opportunities',
        description: `Identified ${numericColumns.length} numeric columns suitable for statistical analysis, correlation studies, and trend analysis.`,
        data: {
          numericColumns: numericColumns.map((col: any) => col.name),
          analysisTypes: ['correlation', 'regression', 'trend analysis', 'forecasting']
        },
        confidence: 'high'
      });
    }
  }

  return insights;
}

function generateVisualizationRecommendations(metadata: any) {
  const recommendations = [];

  if (!metadata.columns) return recommendations;

  const numericCols = metadata.columns.filter((col: any) => 
    col.type === 'number' || col.samples?.some((val: any) => typeof val === 'number')
  );
  
  const categoricalCols = metadata.columns.filter((col: any) => 
    col.type === 'string' || col.samples?.some((val: any) => typeof val === 'string')
  );

  if (numericCols.length >= 2) {
    recommendations.push({
      type: 'scatter',
      title: 'Correlation Analysis',
      description: 'Scatter plot to explore relationships between numeric variables',
      suggestedColumns: {
        x: numericCols[0].name,
        y: numericCols[1].name
      },
      priority: 'high'
    });
  }

  if (categoricalCols.length >= 1 && numericCols.length >= 1) {
    recommendations.push({
      type: 'bar',
      title: 'Category Comparison',
      description: 'Bar chart to compare values across categories',
      suggestedColumns: {
        category: categoricalCols[0].name,
        value: numericCols[0].name
      },
      priority: 'high'
    });
  }

  if (numericCols.length >= 1) {
    recommendations.push({
      type: 'histogram',
      title: 'Distribution Analysis',
      description: 'Histogram to understand data distribution',
      suggestedColumns: {
        value: numericCols[0].name
      },
      priority: 'medium'
    });
  }

  return recommendations;
}
