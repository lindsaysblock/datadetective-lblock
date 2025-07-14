
export interface ParsedDataRow {
  [key: string]: any;
}

export interface ParsedDataFile {
  id: string;
  name: string;
  rows: number;
  columns: number;
  preview?: ParsedDataRow[];
  data: ParsedDataRow[];
  columnInfo?: Array<{
    name: string;
    type: 'string' | 'number' | 'date' | 'boolean';
    samples?: any[];
  }>;
  summary?: {
    totalRows: number;
    totalColumns: number;
    possibleUserIdColumns?: string[];
    possibleEventColumns?: string[];
    possibleTimestampColumns?: string[];
  };
}

export interface DataAnalysisContext {
  researchQuestion: string;
  additionalContext: string;
  parsedData: ParsedDataFile[];
  columnMapping?: ColumnMapping;
  educationalMode: boolean;
}

export interface ColumnMapping {
  userIdColumn?: string;
  timestampColumn?: string;
  eventColumn?: string;
  valueColumns: string[];
  categoryColumns: string[];
}

export interface AnalysisInsight {
  id: string;
  title: string;
  description: string;
  value: number | string | any;
  insight: string;
  confidence: 'high' | 'medium' | 'low';
}

export interface AnalysisResults {
  insights: string;
  confidence: 'high' | 'medium' | 'low';
  recommendations: string[];
  detailedResults: AnalysisInsight[];
  sqlQuery: string;
  queryBreakdown?: {
    steps: Array<{
      step: number;
      title: string;
      description: string;
      code: string;
      explanation: string;
    }>;
  };
}

export interface QuestionLog {
  id: string;
  question: string;
  answer: string;
  timestamp: Date;
  confidence: 'high' | 'medium' | 'low';
  visualizations?: string[];
}

export interface EnhancedAnalysisResults extends AnalysisResults {
  questionLog: QuestionLog[];
  originalQuestion: string;
  generatedVisuals: {
    id: string;
    type: string;
    title: string;
    questionId: string;
    data: any;
  }[];
}
