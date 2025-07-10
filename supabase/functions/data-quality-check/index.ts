
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface QualityCheckRequest {
  datasetId: string;
  checks: string[]; // 'completeness', 'consistency', 'accuracy', 'validity'
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

    const { datasetId, checks }: QualityCheckRequest = await req.json();

    console.log(`Running quality checks for dataset ${datasetId}: ${checks.join(', ')}`);

    // Get dataset
    const { data: dataset, error: datasetError } = await supabase
      .from('datasets')
      .select('*')
      .eq('id', datasetId)
      .single();

    if (datasetError || !dataset) {
      throw new Error('Dataset not found');
    }

    const results: any = {
      datasetId,
      timestamp: new Date().toISOString(),
      overallScore: 0,
      checks: {}
    };

    let totalScore = 0;
    let checkCount = 0;

    // Run completeness check
    if (checks.includes('completeness')) {
      const completenessResult = await runCompletenessCheck(dataset);
      results.checks.completeness = completenessResult;
      totalScore += completenessResult.score;
      checkCount++;
    }

    // Run consistency check
    if (checks.includes('consistency')) {
      const consistencyResult = await runConsistencyCheck(dataset);
      results.checks.consistency = consistencyResult;
      totalScore += consistencyResult.score;
      checkCount++;
    }

    // Run accuracy check
    if (checks.includes('accuracy')) {
      const accuracyResult = await runAccuracyCheck(dataset);
      results.checks.accuracy = accuracyResult;
      totalScore += accuracyResult.score;
      checkCount++;
    }

    // Run validity check
    if (checks.includes('validity')) {
      const validityResult = await runValidityCheck(dataset);
      results.checks.validity = validityResult;
      totalScore += validityResult.score;
      checkCount++;
    }

    results.overallScore = checkCount > 0 ? Math.round(totalScore / checkCount) : 0;

    // Save quality report
    await supabase
      .from('analysis_results')
      .insert({
        dataset_id: datasetId,
        user_id: dataset.user_id,
        type: 'insight',
        title: 'Data Quality Report',
        description: `Comprehensive data quality analysis with overall score: ${results.overallScore}%`,
        data: results,
        confidence: results.overallScore > 80 ? 'high' : results.overallScore > 60 ? 'medium' : 'low'
      });

    console.log(`Quality check completed for dataset ${datasetId}, overall score: ${results.overallScore}%`);

    return new Response(
      JSON.stringify(results),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Error running quality checks:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Failed to run quality checks' 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});

async function runCompletenessCheck(dataset: any) {
  const metadata = dataset.metadata;
  if (!metadata || !metadata.columns) {
    return { score: 0, issues: ['No column metadata available'], details: {} };
  }

  let totalCells = 0;
  let missingCells = 0;
  const columnCompleteness: any = {};

  metadata.columns.forEach((col: any) => {
    if (col.samples) {
      const colTotal = col.samples.length;
      const colMissing = col.samples.filter((val: any) => 
        val === null || val === undefined || val === '' || val === 'N/A'
      ).length;
      
      totalCells += colTotal;
      missingCells += colMissing;
      
      columnCompleteness[col.name] = {
        total: colTotal,
        missing: colMissing,
        completeness: colTotal > 0 ? ((colTotal - colMissing) / colTotal) * 100 : 0
      };
    }
  });

  const overallCompleteness = totalCells > 0 ? ((totalCells - missingCells) / totalCells) * 100 : 0;
  const score = Math.max(0, overallCompleteness);

  const issues = [];
  if (score < 70) {
    issues.push('High missing data rate detected');
  }
  if (score < 90) {
    const incompleteCols = Object.entries(columnCompleteness)
      .filter(([_, data]: [string, any]) => data.completeness < 90)
      .map(([name, _]) => name);
    if (incompleteCols.length > 0) {
      issues.push(`Incomplete columns: ${incompleteCols.join(', ')}`);
    }
  }

  return {
    score: Math.round(score),
    issues,
    details: {
      overallCompleteness,
      columnCompleteness,
      totalCells,
      missingCells
    }
  };
}

async function runConsistencyCheck(dataset: any) {
  const metadata = dataset.metadata;
  if (!metadata || !metadata.columns) {
    return { score: 0, issues: ['No column metadata available'], details: {} };
  }

  let score = 100;
  const issues = [];
  const details: any = {};

  // Check for data type consistency
  metadata.columns.forEach((col: any) => {
    if (col.samples && col.samples.length > 1) {
      const types = col.samples
        .filter((val: any) => val !== null && val !== undefined && val !== '')
        .map((val: any) => typeof val);
      
      const uniqueTypes = new Set(types);
      if (uniqueTypes.size > 1) {
        score -= 10;
        issues.push(`Inconsistent data types in column: ${col.name}`);
        details[col.name] = {
          issue: 'type_inconsistency',
          types: Array.from(uniqueTypes)
        };
      }
    }
  });

  // Check for naming consistency
  const columnNames = metadata.columns.map((col: any) => col.name);
  const hasInconsistentNaming = columnNames.some((name: string) => 
    name !== name.toLowerCase() || name.includes(' ')
  );
  
  if (hasInconsistentNaming) {
    score -= 15;
    issues.push('Inconsistent column naming conventions');
    details.naming = {
      issue: 'inconsistent_naming',
      suggestion: 'Use lowercase with underscores'
    };
  }

  return {
    score: Math.max(0, score),
    issues,
    details
  };
}

async function runAccuracyCheck(dataset: any) {
  const metadata = dataset.metadata;
  if (!metadata || !metadata.columns) {
    return { score: 80, issues: ['Limited accuracy validation without external reference'], details: {} };
  }

  let score = 90; // Start with high score, deduct for issues
  const issues = [];
  const details: any = {};

  // Check for obvious inaccuracies
  metadata.columns.forEach((col: any) => {
    if (col.samples) {
      const samples = col.samples.filter((val: any) => val !== null && val !== undefined && val !== '');
      
      // Check for negative values in presumably positive fields
      if (col.name.toLowerCase().includes('age') || col.name.toLowerCase().includes('count')) {
        const negativeValues = samples.filter((val: any) => typeof val === 'number' && val < 0);
        if (negativeValues.length > 0) {
          score -= 15;
          issues.push(`Negative values in ${col.name} field`);
          details[col.name] = { issue: 'negative_values', count: negativeValues.length };
        }
      }

      // Check for extreme outliers (basic check)
      if (typeof samples[0] === 'number') {
        const numbers = samples.filter((val: any) => typeof val === 'number');
        if (numbers.length > 3) {
          const mean = numbers.reduce((a: number, b: number) => a + b, 0) / numbers.length;
          const stdDev = Math.sqrt(
            numbers.reduce((acc: number, val: number) => acc + Math.pow(val - mean, 2), 0) / numbers.length
          );
          
          const outliers = numbers.filter((val: number) => Math.abs(val - mean) > 3 * stdDev);
          if (outliers.length > numbers.length * 0.1) { // More than 10% outliers
            score -= 10;
            issues.push(`Potential outliers detected in ${col.name}`);
            details[col.name] = { issue: 'outliers', count: outliers.length };
          }
        }
      }
    }
  });

  return {
    score: Math.max(0, score),
    issues,
    details
  };
}

async function runValidityCheck(dataset: any) {
  const metadata = dataset.metadata;
  if (!metadata || !metadata.columns) {
    return { score: 0, issues: ['No column metadata available'], details: {} };
  }

  let score = 100;
  const issues = [];
  const details: any = {};

  metadata.columns.forEach((col: any) => {
    if (col.samples) {
      const samples = col.samples.filter((val: any) => val !== null && val !== undefined && val !== '');
      
      // Email validation
      if (col.name.toLowerCase().includes('email')) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const invalidEmails = samples.filter((val: any) => 
          typeof val === 'string' && !emailRegex.test(val)
        );
        if (invalidEmails.length > 0) {
          score -= 20;
          issues.push(`Invalid email format in ${col.name}`);
          details[col.name] = { issue: 'invalid_email', count: invalidEmails.length };
        }
      }

      // Date validation
      if (col.name.toLowerCase().includes('date') || col.name.toLowerCase().includes('time')) {
        const invalidDates = samples.filter((val: any) => {
          if (typeof val === 'string') {
            const date = new Date(val);
            return isNaN(date.getTime());
          }
          return false;
        });
        if (invalidDates.length > 0) {
          score -= 15;
          issues.push(`Invalid date format in ${col.name}`);
          details[col.name] = { issue: 'invalid_date', count: invalidDates.length };
        }
      }

      // Phone number validation (basic)
      if (col.name.toLowerCase().includes('phone')) {
        const phoneRegex = /^[\+]?[\d\s\-\(\)]{10,}$/;
        const invalidPhones = samples.filter((val: any) => 
          typeof val === 'string' && !phoneRegex.test(val)
        );
        if (invalidPhones.length > 0) {
          score -= 10;
          issues.push(`Invalid phone format in ${col.name}`);
          details[col.name] = { issue: 'invalid_phone', count: invalidPhones.length };
        }
      }
    }
  });

  return {
    score: Math.max(0, score),
    issues,
    details
  };
}
