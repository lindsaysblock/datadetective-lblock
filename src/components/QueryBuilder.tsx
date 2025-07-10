import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Lightbulb, BarChart3, Database, Upload, TestTube } from 'lucide-react';
import Header from './Header';
import DataSourceManager from './DataSourceManager';
import AnalysisDashboard from './AnalysisDashboard';
import DataTestingPanel from './DataTestingPanel';
import SQLQueryBuilder from './SQLQueryBuilder';
import UnifiedProgress from './UnifiedProgress';
import AnalyzingIcon from './AnalyzingIcon';
import OnboardingFlow from './OnboardingFlow';
import UndoRedoControls from './UndoRedoControls';
import { useAuthState } from '../hooks/useAuthState';
import { useDataUpload } from '../hooks/useDataUpload';
import { useUndoRedo } from '../hooks/useUndoRedo';
import { type ParsedData } from '../utils/dataParser';

interface AppState {
  activeTab: string;
  showOnboarding: boolean;
  lastAction: string;
}

const QueryBuilder = () => {
  const [activeTab, setActiveTab] = useState('connect');
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [currentParsedData, setCurrentParsedData] = useState<ParsedData | null>(null);

  const { user, loading, handleUserChange } = useAuthState();
  const {
    uploading,
    uploadProgress,
    uploadStatus,
    uploadError,
    filename,
    parsedData,
    findings,
    analyzing,
    estimatedTime,
    handleFileUpload
  } = useDataUpload();

  // Initialize undo/redo for app state
  const {
    current: appState,
    canUndo,
    canRedo,
    undo,
    redo,
    push: pushState,
    reset: resetState
  } = useUndoRedo<AppState>({
    activeTab: 'connect',
    showOnboarding: false,
    lastAction: 'initial'
  });

  // Update current parsed data when upload data changes
  useEffect(() => {
    if (parsedData) {
      setCurrentParsedData(parsedData);
    }
  }, [parsedData]);

  // Check if user is new (first time visiting)
  useEffect(() => {
    const hasVisited = localStorage.getItem('data-detective-visited');
    if (!hasVisited && !loading) {
      setShowOnboarding(true);
      localStorage.setItem('data-detective-visited', 'true');
    }
  }, [loading]);

  // Update app state when activeTab changes
  useEffect(() => {
    if (activeTab !== appState.activeTab) {
      pushState({
        activeTab,
        showOnboarding,
        lastAction: `switched to ${activeTab} tab`
      });
    }
  }, [activeTab, showOnboarding, appState.activeTab, pushState]);

  // Apply state changes from undo/redo
  useEffect(() => {
    if (appState.activeTab !== activeTab) {
      setActiveTab(appState.activeTab);
    }
    if (appState.showOnboarding !== showOnboarding) {
      setShowOnboarding(appState.showOnboarding);
    }
  }, [appState]);

  // Keyboard shortcuts for undo/redo
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey || event.metaKey) {
        if (event.key === 'z' && !event.shiftKey) {
          event.preventDefault();
          undo();
        } else if ((event.key === 'y') || (event.key === 'z' && event.shiftKey)) {
          event.preventDefault();
          redo();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo]);

  const onFileUploadWrapper = async (file: File) => {
    try {
      await handleFileUpload(file);
      setTimeout(() => {
        setActiveTab('insights');
        pushState({
          activeTab: 'insights',
          showOnboarding: false,
          lastAction: 'uploaded file and switched to insights'
        });
      }, 1500);
    } catch (error) {
      console.error('File upload failed:', error);
    }
  };

  const handleExecuteQuery = (query: string) => {
    console.log('Executing SQL query:', query);
    pushState({
      activeTab,
      showOnboarding: false,
      lastAction: `executed SQL query`
    });
  };

  const handleOnboardingComplete = () => {
    setShowOnboarding(false);
    pushState({
      activeTab,
      showOnboarding: false,
      lastAction: 'completed onboarding'
    });
  };

  const handleOnboardingSkip = () => {
    setShowOnboarding(false);
    pushState({
      activeTab,
      showOnboarding: false,
      lastAction: 'skipped onboarding'
    });
  };

  const handleTabChange = (newTab: string) => {
    setActiveTab(newTab);
    pushState({
      activeTab: newTab,
      showOnboarding: false,
      lastAction: `switched to ${newTab} tab`
    });
  };

  const handleDataUpdate = (newData: ParsedData) => {
    setCurrentParsedData(newData);
    pushState({
      activeTab,
      showOnboarding: false,
      lastAction: 'updated data through management tools'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <Header user={user} onUserChange={handleUserChange} />
        <div className="container mx-auto px-4 py-8 flex items-center justify-center">
          <AnalyzingIcon isAnalyzing={true} />
        </div>
      </div>
    );
  }

  // Show upload progress screen
  if (uploading || uploadStatus === 'complete' || uploadStatus === 'error' || analyzing) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <Header user={user} onUserChange={handleUserChange} />
        <div className="container mx-auto px-4 py-8 space-y-6">
          <UnifiedProgress
            isActive={uploading || analyzing}
            progress={uploadProgress}
            status={uploadStatus}
            filename={filename}
            error={uploadError}
            estimatedTime={estimatedTime}
          />
          {analyzing && (
            <div className="text-center">
              <AnalyzingIcon isAnalyzing={analyzing} />
            </div>
          )}
        </div>
      </div>
    );
  }

  // Show analysis dashboard after successful data upload
  if (currentParsedData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <Header user={user} onUserChange={handleUserChange} />
        <div className="container mx-auto px-4 py-8">
          <AnalysisDashboard
            parsedData={currentParsedData}
            filename={filename}
            findings={findings}
            onDataUpdate={handleDataUpdate}
          />
        </div>
      </div>
    );
  }

  // Main landing page
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {showOnboarding && (
        <OnboardingFlow
          onComplete={handleOnboardingComplete}
          onSkip={handleOnboardingSkip}
        />
      )}

      <Header user={user} onUserChange={handleUserChange} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex-1" />
            <div className="flex-1 text-center">
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Your AI-powered business intelligence companion. Connect your data, ask questions in natural language, 
                and get instant insights with beautiful visualizations.
              </p>
            </div>
            <div className="flex-1 flex justify-end">
              <UndoRedoControls
                canUndo={canUndo}
                canRedo={canRedo}
                onUndo={undo}
                onRedo={redo}
                onReset={() => resetState({
                  activeTab: 'connect',
                  showOnboarding: false,
                  lastAction: 'reset'
                })}
              />
            </div>
          </div>
          
          {!user && (
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg max-w-2xl mx-auto">
              <p className="text-blue-800">
                👋 Welcome! You can explore the dashboard and connect data sources. 
                Sign in using the Account tab above to save your work and access advanced features.
              </p>
            </div>
          )}
        </div>

        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-8">
            <TabsTrigger value="connect" className="flex items-center gap-2">
              <Upload className="w-4 h-4" />
              Connect
            </TabsTrigger>
            <TabsTrigger value="testing" className="flex items-center gap-2">
              <TestTube className="w-4 h-4" />
              Testing
            </TabsTrigger>
            <TabsTrigger value="query" className="flex items-center gap-2">
              <Database className="w-4 h-4" />
              Query
            </TabsTrigger>
            <TabsTrigger value="visualize" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Visualize
            </TabsTrigger>
            <TabsTrigger value="insights" className="flex items-center gap-2">
              <Lightbulb className="w-4 h-4" />
              Insights
            </TabsTrigger>
          </TabsList>

          <TabsContent value="connect" className="space-y-6">
            <DataSourceManager onFileUpload={onFileUploadWrapper} />
          </TabsContent>

          <TabsContent value="testing" className="space-y-6">
            <DataTestingPanel />
          </TabsContent>

          <TabsContent value="query" className="space-y-6">
            <SQLQueryBuilder onExecuteQuery={handleExecuteQuery} />
          </TabsContent>

          <TabsContent value="visualize" className="space-y-6">
            <Card className="p-6">
              <div className="text-center">
                <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">Data Visualization</h3>
                <p className="text-gray-500">Upload data first to see visualization recommendations!</p>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="insights" className="space-y-6">
            <Card className="p-6">
              <div className="text-center">
                <Lightbulb className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">Business Insights</h3>
                <p className="text-gray-500">Connect your data to start generating insights!</p>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default QueryBuilder;
