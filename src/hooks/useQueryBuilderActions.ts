
import { useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useDatasetPersistence } from '@/hooks/useDatasetPersistence';
import { generateMockDataset } from '@/utils/mockData';

interface AnalysisData {
  columns: any[];
  rows: any[];
  summary: any;
}

interface QueryBuilderActionsProps {
  setAnalysisData: (data: AnalysisData | null) => void;
  setCurrentFilename: (filename: string | null) => void;
  setCurrentDatasetId: (id: string | null) => void;
  setFindings: (findings: any[]) => void;
  setActiveTab: (tab: string) => void;
  resetUpload: () => void;
  handleFileUpload: (file: File) => Promise<any>;
}

export const useQueryBuilderActions = ({
  setAnalysisData,
  setCurrentFilename,
  setCurrentDatasetId,
  setFindings,
  setActiveTab,
  resetUpload,
  handleFileUpload
}: QueryBuilderActionsProps) => {
  const { saveDataset } = useDatasetPersistence();
  const { toast } = useToast();

  const handleFileProcessed = useCallback(async (file: File) => {
    try {
      resetUpload();
      const parsedData = await handleFileUpload(file);
      
      if (parsedData) {
        setAnalysisData(parsedData);
        setCurrentFilename(file.name);
        setActiveTab('analysis');
        
        toast({
          title: "Data Loaded",
          description: `${file.name} processed successfully.`,
        });
      }
    } catch (error: any) {
      console.error("Error processing file:", error);
      toast({
        title: "File Processing Error",
        description: error.message || "Failed to process the file.",
        variant: "destructive",
      });
    }
  }, [handleFileUpload, resetUpload, toast, setAnalysisData, setCurrentFilename, setActiveTab]);

  const handleSaveToAccount = async (analysisData: AnalysisData | null, currentFilename: string | null) => {
    if (!analysisData || !currentFilename) return;
    
    try {
      const datasetId = await saveDataset(currentFilename, analysisData);
      if (datasetId) {
        setCurrentDatasetId(datasetId);
        toast({
          title: "Dataset Saved",
          description: "Your analysis has been saved to your account.",
        });
      }
    } catch (error: any) {
      console.error('Error saving dataset:', error);
      toast({
        title: "Save Failed",
        description: error.message || "Failed to save dataset",
        variant: "destructive",
      });
    }
  };

  const handleDataSourceLoaded = (data: any, sourceName: string) => {
    const columns = Object.keys(data[0] || {}).map(key => ({
      name: key,
      type: 'string',
      samples: data.slice(0, 5).map((row: any) => row[key])
    }));
    const summary = {
      totalRows: data.length,
      totalColumns: columns.length,
      source: sourceName
    };
    setAnalysisData({ columns, rows: data, summary });
    setCurrentFilename(sourceName);
    setActiveTab('analysis');
    toast({
      title: "Data Source Loaded",
      description: `Data from ${sourceName} loaded successfully.`,
    });
  };

  const handleDatasetSelect = async (dataset: any) => {
    try {
      const analysisData = {
        columns: dataset.metadata?.columns || [],
        rows: dataset.metadata?.sample_rows || [],
        summary: dataset.summary || {}
      };
      
      setAnalysisData(analysisData);
      setCurrentFilename(dataset.original_filename);
      setCurrentDatasetId(dataset.id);
      setActiveTab('analysis');
      
      toast({
        title: "Dataset Loaded",
        description: `${dataset.name} loaded for analysis.`,
      });
    } catch (error: any) {
      console.error('Error loading dataset:', error);
      toast({
        title: "Load Failed",
        description: "Failed to load dataset for analysis",
        variant: "destructive",
      });
    }
  };

  const handleGenerateMockData = () => {
    const mockData = generateMockDataset(100, 3);
    handleDataSourceLoaded(mockData, 'AI Generated Sample Data');
  };

  const handleStartNewProject = () => {
    setAnalysisData(null);
    setCurrentFilename(null);
    setCurrentDatasetId(null);
    setFindings([]);
    resetUpload();
    setActiveTab('upload');
  };

  const handleResumeProject = () => {
    setActiveTab('library');
  };

  return {
    handleFileProcessed,
    handleSaveToAccount,
    handleDataSourceLoaded,
    handleDatasetSelect,
    handleGenerateMockData,
    handleStartNewProject,
    handleResumeProject
  };
};
