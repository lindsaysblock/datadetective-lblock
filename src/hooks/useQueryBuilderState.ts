
import { useState } from 'react';
import { useAuthState } from '@/hooks/useAuthState';
import { useDataUpload } from '@/hooks/useDataUpload';

interface AnalysisData {
  columns: any[];
  rows: any[];
  summary: any;
}

export const useQueryBuilderState = () => {
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const [currentFilename, setCurrentFilename] = useState<string | null>(null);
  const [currentDatasetId, setCurrentDatasetId] = useState<string | null>(null);
  const [findings, setFindings] = useState<any[]>([]);
  const [showOnboarding, setShowOnboarding] = useState(true);
  const [activeTab, setActiveTab] = useState('upload');
  
  const { user, loading, handleUserChange } = useAuthState();
  const {
    uploading,
    uploadProgress,
    uploadStatus,
    uploadError,
    filename: uploadFilename,
    estimatedTime,
    handleFileUpload,
    resetUpload
  } = useDataUpload();

  return {
    // State
    analysisData,
    currentFilename,
    currentDatasetId,
    findings,
    showOnboarding,
    activeTab,
    user,
    loading,
    uploading,
    uploadProgress,
    uploadStatus,
    uploadError,
    uploadFilename: uploadFilename || '',
    estimatedTime,
    
    // Setters
    setAnalysisData,
    setCurrentFilename,
    setCurrentDatasetId,
    setFindings,
    setShowOnboarding,
    setActiveTab,
    handleUserChange,
    
    // Actions
    handleFileUpload,
    resetUpload
  };
};
