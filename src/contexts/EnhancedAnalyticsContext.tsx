
import React, { createContext, useContext, ReactNode } from 'react';
import { useEnhancedAnalytics } from '@/hooks/useEnhancedAnalytics';
import { ParsedData } from '@/utils/dataParser';
import { AnalysisResult } from '@/utils/analysis/types';

interface EnhancedAnalyticsContextType {
  processData: (data: ParsedData) => Promise<AnalysisResult[]>;
  isProcessing: boolean;
  realTimeResults: AnalysisResult[];
  mlPredictions: any[];
  mlModels: any[];
  cacheStats: any;
  clearCache: (pattern?: string) => number;
  exportData: (data: ParsedData, results: AnalysisResult[], format: 'json' | 'csv' | 'xlsx' | 'pdf') => Promise<Blob>;
  importData: (file: File) => Promise<any>;
  scheduleAnalysis: (jobConfig: any) => string;
  scheduledJobs: any[];
  engines: any;
}

const EnhancedAnalyticsContext = createContext<EnhancedAnalyticsContextType | undefined>(undefined);

interface EnhancedAnalyticsProviderProps {
  children: ReactNode;
  config?: any;
}

export const EnhancedAnalyticsProvider: React.FC<EnhancedAnalyticsProviderProps> = ({
  children,
  config = {}
}) => {
  const analytics = useEnhancedAnalytics(config);

  return (
    <EnhancedAnalyticsContext.Provider value={analytics}>
      {children}
    </EnhancedAnalyticsContext.Provider>
  );
};

export const useEnhancedAnalyticsContext = () => {
  const context = useContext(EnhancedAnalyticsContext);
  if (context === undefined) {
    throw new Error('useEnhancedAnalyticsContext must be used within an EnhancedAnalyticsProvider');
  }
  return context;
};
