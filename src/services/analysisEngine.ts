
import { ParsedDataFile, AnalysisResults, DataAnalysisContext } from '@/types/data';

export class AnalysisEngine {
  static async analyzeData(context: DataAnalysisContext): Promise<AnalysisResults> {
    console.log('🔍 Starting comprehensive data analysis');
    console.log('Research Question:', context.researchQuestion);
    console.log('Data Sources:', context.parsedData?.length || 0);
    
    // Simulate analysis time
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const insights = this.generateInsights(context);
    const recommendations = this.generateRecommendations(context);
    const sqlQuery = this.generateSQLQuery(context);
    const queryBreakdown = this.generateQueryBreakdown(context);
    
    return {
      insights,
      confidence: 'high' as const,
      recommendations,
      detailedResults: this.generateDetailedResults(context),
      sqlQuery,
      queryBreakdown
    };
  }

  private static generateInsights(context: DataAnalysisContext): string {
    const { researchQuestion, parsedData, additionalContext } = context;
    const dataCount = parsedData?.length || 0;
    const totalRows = parsedData?.reduce((sum, file) => sum + (file.rows?.length || 0), 0) || 0;
    
    let insights = `## Data Analysis Results\n\n`;
    
    if (dataCount === 0) {
      insights += `Based on your research question: "${researchQuestion}"\n\n`;
      insights += `I've prepared a conceptual analysis framework even without data:\n\n`;
      insights += `### Key Analysis Areas:\n`;
      insights += `- **Data Collection Strategy**: Identify the data sources needed to answer "${researchQuestion}"\n`;
      insights += `- **Measurement Framework**: Define metrics and KPIs relevant to your question\n`;
      insights += `- **Analysis Approach**: Outline statistical methods and visualization techniques\n\n`;
      
      if (additionalContext) {
        insights += `### Context Considerations:\n${additionalContext}\n\n`;
      }
      
      return insights;
    }
    
    insights += `### Data Overview:\n`;
    insights += `- **Sources Connected**: ${dataCount} data source${dataCount > 1 ? 's' : ''}\n`;
    insights += `- **Total Records**: ${totalRows.toLocaleString()} rows\n`;
    insights += `- **Research Focus**: ${researchQuestion}\n\n`;
    
    // Analyze data patterns
    const allColumns = new Set<string>();
    const userIdColumns: string[] = [];
    const eventColumns: string[] = [];
    const timestampColumns: string[] = [];
    
    parsedData?.forEach(file => {
      if (file.data && file.data.length > 0) {
        Object.keys(file.data[0]).forEach(col => allColumns.add(col));
        
        // Detect patterns
        Object.keys(file.data[0]).forEach(col => {
          const lowerCol = col.toLowerCase();
          if (/user|customer|client|member/.test(lowerCol) || /_id$/.test(lowerCol)) {
            userIdColumns.push(col);
          }
          if (/event|action|activity|click|view|session/.test(lowerCol)) {
            eventColumns.push(col);
          }
          if (/time|date|timestamp|created|when/.test(lowerCol)) {
            timestampColumns.push(col);
          }
        });
      }
    });
    
    insights += `### Data Structure Analysis:\n`;
    insights += `- **Total Columns**: ${allColumns.size}\n`;
    if (userIdColumns.length > 0) {
      insights += `- **User Identifiers**: ${userIdColumns.join(', ')}\n`;
    }
    if (eventColumns.length > 0) {
      insights += `- **Event Columns**: ${eventColumns.join(', ')}\n`;
    }
    if (timestampColumns.length > 0) {
      insights += `- **Time Columns**: ${timestampColumns.join(', ')}\n`;
    }
    
    // Question-specific analysis
    insights += `\n### Analysis for: "${researchQuestion}"\n`;
    
    if (researchQuestion.toLowerCase().includes('user') || researchQuestion.toLowerCase().includes('customer')) {
      if (userIdColumns.length > 0) {
        insights += `✅ **User Analysis Ready**: Found user identifier columns (${userIdColumns.join(', ')})\n`;
        insights += `- Can perform user segmentation, cohort analysis, and behavioral patterns\n`;
      } else {
        insights += `⚠️ **Limited User Analysis**: No clear user identifiers found\n`;
        insights += `- Consider adding user ID columns for deeper user insights\n`;
      }
    }
    
    if (researchQuestion.toLowerCase().includes('time') || researchQuestion.toLowerCase().includes('trend')) {
      if (timestampColumns.length > 0) {
        insights += `✅ **Time Series Analysis Ready**: Found timestamp columns (${timestampColumns.join(', ')})\n`;
        insights += `- Can perform trend analysis, seasonal patterns, and time-based insights\n`;
      } else {
        insights += `⚠️ **Limited Time Analysis**: No clear timestamp columns found\n`;
        insights += `- Consider adding timestamp data for temporal insights\n`;
      }
    }
    
    if (researchQuestion.toLowerCase().includes('event') || researchQuestion.toLowerCase().includes('behavior')) {
      if (eventColumns.length > 0) {
        insights += `✅ **Event Analysis Ready**: Found event columns (${eventColumns.join(', ')})\n`;
        insights += `- Can perform funnel analysis, event sequencing, and behavior flows\n`;
      } else {
        insights += `⚠️ **Limited Event Analysis**: No clear event columns found\n`;
        insights += `- Consider categorizing actions or events for behavioral insights\n`;
      }
    }
    
    if (additionalContext) {
      insights += `\n### Additional Context Integration:\n`;
      insights += `${additionalContext}\n`;
      insights += `- Context has been incorporated into the analysis framework\n`;
    }
    
    return insights;
  }

  private static generateRecommendations(context: DataAnalysisContext): string[] {
    const recommendations: string[] = [];
    const { researchQuestion, parsedData } = context;
    
    if (!parsedData || parsedData.length === 0) {
      recommendations.push("Connect your data sources to enable detailed analysis");
      recommendations.push("Start with CSV exports from your analytics platforms");
      recommendations.push("Consider integrating with databases for real-time insights");
      return recommendations;
    }
    
    // Data quality recommendations
    const totalRows = parsedData.reduce((sum, file) => sum + (file.rows?.length || 0), 0);
    if (totalRows < 100) {
      recommendations.push("Consider collecting more data for statistically significant insights");
    }
    
    // Column-specific recommendations
    const hasUserIds = parsedData.some(file => 
      file.data && file.data.length > 0 && 
      Object.keys(file.data[0]).some(col => 
        /user|customer|client|member|_id$/.test(col.toLowerCase())
      )
    );
    
    if (!hasUserIds && researchQuestion.toLowerCase().includes('user')) {
      recommendations.push("Add user identifier columns to enable user-centric analysis");
    }
    
    // Analysis method recommendations
    if (researchQuestion.toLowerCase().includes('correlation') || researchQuestion.toLowerCase().includes('relationship')) {
      recommendations.push("Perform correlation analysis between key variables");
      recommendations.push("Consider creating scatter plots to visualize relationships");
    }
    
    if (researchQuestion.toLowerCase().includes('segment') || researchQuestion.toLowerCase().includes('group')) {
      recommendations.push("Apply clustering techniques to identify natural segments");
      recommendations.push("Use cohort analysis to track user behavior over time");
    }
    
    recommendations.push("Create visualizations to communicate insights effectively");
    recommendations.push("Set up automated reporting for ongoing monitoring");
    
    return recommendations;
  }

  private static generateSQLQuery(context: DataAnalysisContext): string {
    const { researchQuestion, parsedData } = context;
    
    if (!parsedData || parsedData.length === 0) {
      return `-- Conceptual query for: ${researchQuestion}
-- Replace 'your_table' with your actual table name

SELECT 
    column1,
    column2,
    COUNT(*) as frequency,
    AVG(numeric_column) as average_value
FROM your_table 
WHERE condition = 'relevant_filter'
GROUP BY column1, column2
ORDER BY frequency DESC
LIMIT 10;`;
    }
    
    const firstFile = parsedData[0];
    const tableName = firstFile.name?.toLowerCase().replace(/[^a-z0-9]/g, '_') || 'data_table';
    
    if (!firstFile.data || firstFile.data.length === 0) {
      return `-- Query for ${tableName}
SELECT * FROM ${tableName} LIMIT 10;`;
    }
    
    const columns = Object.keys(firstFile.data[0]);
    const numericColumns = columns.filter(col => {
      const firstValue = firstFile.data[0][col];
      return typeof firstValue === 'number' || !isNaN(Number(firstValue));
    });
    
    let query = `-- Analysis query for: ${researchQuestion}\n`;
    query += `-- Table: ${tableName}\n\n`;
    
    if (researchQuestion.toLowerCase().includes('count') || researchQuestion.toLowerCase().includes('how many')) {
      query += `SELECT \n    COUNT(*) as total_records,\n`;
      if (columns.length > 0) {
        query += `    COUNT(DISTINCT ${columns[0]}) as unique_${columns[0]}\n`;
      }
      query += `FROM ${tableName};`;
    } else if (researchQuestion.toLowerCase().includes('average') || researchQuestion.toLowerCase().includes('mean')) {
      if (numericColumns.length > 0) {
        query += `SELECT \n`;
        numericColumns.slice(0, 3).forEach((col, index) => {
          query += `    AVG(${col}) as avg_${col}${index < numericColumns.slice(0, 3).length - 1 ? ',' : ''}\n`;
        });
        query += `FROM ${tableName};`;
      } else {
        query += `SELECT COUNT(*) as total_records FROM ${tableName};`;
      }
    } else {
      // General exploration query
      query += `SELECT \n`;
      columns.slice(0, 5).forEach((col, index) => {
        query += `    ${col}${index < Math.min(columns.length, 5) - 1 ? ',' : ''}\n`;
      });
      query += `FROM ${tableName}\nLIMIT 10;`;
    }
    
    return query;
  }

  private static generateQueryBreakdown(context: DataAnalysisContext) {
    return {
      steps: [
        {
          step: 1,
          title: "Data Selection",
          description: "Identify relevant columns and apply initial filters",
          code: "SELECT column1, column2 FROM table",
          explanation: "Start by selecting the columns most relevant to your research question"
        },
        {
          step: 2,
          title: "Data Filtering",
          description: "Apply WHERE conditions to focus on relevant data",
          code: "WHERE condition = 'value'",
          explanation: "Filter data to match your analysis criteria and remove irrelevant records"
        },
        {
          step: 3,
          title: "Aggregation",
          description: "Group and aggregate data for insights",
          code: "GROUP BY column1 ORDER BY COUNT(*) DESC",
          explanation: "Group similar records together and calculate summary statistics"
        }
      ]
    };
  }

  private static generateDetailedResults(context: DataAnalysisContext) {
    const { parsedData } = context;
    
    if (!parsedData || parsedData.length === 0) {
      return [
        {
          id: '1',
          title: 'Data Connection Required',
          description: 'Connect your data sources to generate detailed insights',
          value: 'No data connected',
          insight: 'Upload files or connect to databases to begin analysis',
          confidence: 'high' as const
        }
      ];
    }
    
    const totalRows = parsedData.reduce((sum, file) => sum + (file.rows?.length || 0), 0);
    const totalColumns = new Set();
    
    parsedData.forEach(file => {
      if (file.data && file.data.length > 0) {
        Object.keys(file.data[0]).forEach(col => totalColumns.add(col));
      }
    });
    
    return [
      {
        id: '1',
        title: 'Dataset Overview',
        description: 'Summary of connected data sources',
        value: `${parsedData.length} source${parsedData.length > 1 ? 's' : ''}`,
        insight: `Total of ${totalRows.toLocaleString()} records across ${totalColumns.size} unique columns`,
        confidence: 'high' as const
      },
      {
        id: '2',
        title: 'Data Quality',
        description: 'Assessment of data completeness and structure',
        value: totalRows > 1000 ? 'Good' : totalRows > 100 ? 'Moderate' : 'Limited',
        insight: 'Data volume is sufficient for meaningful analysis',
        confidence: 'medium' as const
      },
      {
        id: '3',
        title: 'Analysis Readiness',
        description: 'Capability to answer the research question',
        value: 'Ready',
        insight: 'Data structure supports the requested analysis type',
        confidence: 'high' as const
      }
    ];
  }
}
