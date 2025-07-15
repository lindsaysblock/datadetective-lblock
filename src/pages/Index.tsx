import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useAuthGuard } from '@/hooks/useAuthGuard';
import { useOptimizedDataPipeline } from '@/hooks/useOptimizedDataPipeline';
import { useAnalyticsManager } from '@/hooks/useAnalyticsManager';
import { useToast } from '@/hooks/use-toast';
import { parseFile } from '@/utils/dataParser';
import { useContinueCase } from '@/hooks/useContinueCase';
import MainTabsView from '@/components/query/MainTabsView';
import AnalysisView from '@/components/query/AnalysisView';
import Header from '@/components/Header';
import LegalFooter from '@/components/LegalFooter';

const Index = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const { reconstructAnalysisState } = useContinueCase();
  
  // Use auth guard to protect this route
  useAuthGuard({ requireAuth: false });

  // State management
  const [activeTab, setActiveTab] = useState('upload');
  const [showOnboarding, setShowOnboarding] = useState(!user);
  const [analysisData, setAnalysisData] = useState<any>(null);
  const [currentFilename, setCurrentFilename] = useState('');
  const [findings, setFindings] = useState<any[]>([]);
  const [showAnalysis, setShowAnalysis] = useState(false);

  // Upload state
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<'uploading' | 'processing' | 'complete' | 'error'>('complete');
  const [uploadFilename, setUploadFilename] = useState('');
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [estimatedTime, setEstimatedTime] = useState(0);

  const dataPipeline = useOptimizedDataPipeline();
  const analyticsManager = useAnalyticsManager();

  // Handle route state for continuing investigations
  useEffect(() => {
    if (location.state?.continueInvestigation && location.state?.dataset) {
      const dataset = location.state.dataset;
      console.log('📊 Continue case detected on Index page, redirecting to new-project');
      
      // Navigate to new-project with the continue case data
      navigate('/new-project', {
        state: {
          continueInvestigation: true,
          dataset: dataset
        },
        replace: true
      });
      return;
    }

    // Handle direct dataset selection (legacy support)
    if (location.state?.selectedDataset) {
      const dataset = location.state.selectedDataset;
      console.log('📊 Legacy dataset selection detected, converting to continue case');
      
      try {
        const analysisState = reconstructAnalysisState(dataset);
        setAnalysisData(analysisState.parsedData);
        setCurrentFilename(dataset.original_filename || 'Dataset');
        setActiveTab('analysis');
        setShowAnalysis(true);
      } catch (error) {
        console.error('Error reconstructing analysis state:', error);
        toast({
          title: "Error Loading Dataset",
          description: "Unable to load the selected dataset. Please try again.",
          variant: "destructive",
        });
      }
    }
  }, [location.state, navigate, reconstructAnalysisState, toast]);

  // Event handlers
  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    toast({
      title: "Welcome to Data Detective!",
      description: "You're ready to start analyzing your data.",
    });
  };

  const handleOnboardingSkip = () => {
    setShowOnboarding(false);
  };

  const handleStartNewProject = () => {
    navigate('/new-project');
  };

  const handleResumeProject = () => {
    navigate('/query-history');
  };

  const handleFileProcessed = async (file: File) => {
    if (!file) return;

    try {
      setUploading(true);
      setUploadStatus('uploading');
      setUploadFilename(file.name);
      setUploadError(null);
      setUploadProgress(0);

      console.log('🔄 Starting file processing...');
      
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 200);

      const data = await parseFile(file);
      
      clearInterval(progressInterval);
      setUploadProgress(100);
      setUploadStatus('complete');
      
      setAnalysisData(data);
      setCurrentFilename(file.name);
      setFindings([]);
      
      console.log('✅ File processed successfully');
      
      toast({
        title: "File Processed",
        description: `${file.name} has been processed successfully.`,
      });

    } catch (error) {
      console.error('❌ File processing failed:', error);
      setUploadError(error instanceof Error ? error.message : 'File processing failed');
      setUploadStatus('error');
      
      toast({
        title: "Processing Failed",
        description: "There was an error processing your file.",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  const handleGenerateMockData = () => {
    const mockData = {
      columns: [
        { name: 'id', type: 'number' as const, samples: [1, 2, 3] },
        { name: 'name', type: 'string' as const, samples: ['Sample 1', 'Sample 2', 'Sample 3'] },
        { name: 'value', type: 'number' as const, samples: [100, 200, 300] },
      ],
      rows: [
        { id: 1, name: 'Sample 1', value: 100 },
        { id: 2, name: 'Sample 2', value: 200 },
        { id: 3, name: 'Sample 3', value: 300 },
      ],
      rowCount: 3,
      fileSize: 1024,
      summary: {
        totalRows: 3,
        totalColumns: 3,
      }
    };

    setAnalysisData(mockData);
    setCurrentFilename('Mock Dataset');
    setFindings([]);
    
    toast({
      title: "Mock Data Generated",
      description: "Sample dataset has been created for testing.",
    });
  };

  const handleSaveToAccount = () => {
    if (!user) {
      toast({
        title: "Sign In Required",
        description: "Please sign in to save datasets to your account.",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Dataset Saved",
      description: "Your dataset has been saved to your account.",
    });
  };

  const handleDatasetSelect = (dataset: any) => {
    console.log('📊 Dataset selected on Index page, redirecting to new-project');
    
    // Navigate to new-project for continue case
    navigate('/new-project', {
      state: {
        continueInvestigation: true,
        dataset: dataset
      }
    });
  };

  const handleStartAnalysis = () => {
    if (!analysisData) {
      toast({
        title: "No Data",
        description: "Please upload or select a dataset first.",
        variant: "destructive",
      });
      return;
    }

    setActiveTab('analysis');
    setShowAnalysis(true);
    
    toast({
      title: "Analysis Started",
      description: "Beginning analysis of your dataset.",
    });
  };

  // Show analysis view if we have data and analysis is active
  if (showAnalysis && analysisData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <AnalysisView
            analysisData={analysisData}
            currentFilename={currentFilename}
            findings={findings}
            setActiveTab={setActiveTab}
            setAnalysisData={setAnalysisData}
            handleStartNewProject={handleStartNewProject}
            handleResumeProject={handleResumeProject}
          />
        </div>
        <LegalFooter />
      </div>
    );
  }

  // Show main dashboard
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            Welcome to Data Detective
          </h1>
          <p className="text-xl text-gray-600">
            Uncover insights hidden in your data with AI-powered analysis
          </p>
        </div>

        <MainTabsView
          showOnboarding={showOnboarding}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          uploading={uploading}
          uploadProgress={uploadProgress}
          uploadStatus={uploadStatus}
          uploadFilename={uploadFilename}
          uploadError={uploadError}
          estimatedTime={estimatedTime}
          user={user}
          handleOnboardingComplete={handleOnboardingComplete}
          handleOnboardingSkip={handleOnboardingSkip}
          handleStartNewProject={handleStartNewProject}
          handleResumeProject={handleResumeProject}
          handleFileProcessed={handleFileProcessed}
          handleGenerateMockData={handleGenerateMockData}
          handleSaveToAccount={handleSaveToAccount}
          handleDatasetSelect={handleDatasetSelect}
        />

        {analysisData && !showAnalysis && (
          <div className="mt-8 text-center">
            <button
              onClick={handleStartAnalysis}
              className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-all duration-200"
            >
              Start Analysis
            </button>
          </div>
        )}
      </div>
      <LegalFooter />
    </div>
  );
};

export default Index;
