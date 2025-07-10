import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Lightbulb, BarChart3, Database, Upload, TestTube, Plus, Sparkles, TrendingUp, Users, Target } from 'lucide-react';
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

  const handleStartNewProject = () => {
    // Reset all state for a fresh start
    setCurrentParsedData(null);
    setActiveTab('connect');
    resetState({
      activeTab: 'connect',
      showOnboarding: false,
      lastAction: 'started new project'
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

  // Enhanced main landing page
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {showOnboarding && (
        <OnboardingFlow
          onComplete={handleOnboardingComplete}
          onSkip={handleOnboardingSkip}
        />
      )}

      <Header user={user} onUserChange={handleUserChange} />
      
      <div className="container mx-auto px-4 py-8">
        {/* Enhanced Hero Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-between mb-6">
            <div className="flex-1" />
            <div className="flex-1 text-center">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-medium mb-6 shadow-lg">
                <Sparkles className="w-4 h-4" />
                AI-Powered Business Intelligence
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
                Transform Your Data Into
                <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Actionable Insights
                </span>
              </h1>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                Ask questions in natural language, get validated insights instantly, and make data-driven decisions 
                without needing SQL expertise or complex analytics tools.
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

          {/* Quick Actions */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 px-8 py-4 text-lg shadow-lg transform hover:scale-105 transition-all duration-200"
              onClick={() => setActiveTab('connect')}
            >
              <Upload className="w-5 h-5 mr-2" />
              Connect Your Data
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="px-8 py-4 text-lg border-2 border-blue-300 text-blue-700 hover:bg-blue-50 hover:border-blue-400 transform hover:scale-105 transition-all duration-200"
              onClick={handleStartNewProject}
            >
              <Plus className="w-5 h-5 mr-2" />
              Start New Project
            </Button>
          </div>

          {/* Feature Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Card className="p-6 bg-white/70 backdrop-blur-sm border-blue-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">Real-time Analytics</h3>
              </div>
              <p className="text-gray-600">
                Get live insights with automatic data refreshes and streaming analytics for up-to-the-minute business intelligence.
              </p>
            </Card>

            <Card className="p-6 bg-white/70 backdrop-blur-sm border-purple-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">Team Collaboration</h3>
              </div>
              <p className="text-gray-600">
                Share insights, collaborate on analyses, and maintain data governance across your entire organization.
              </p>
            </Card>

            <Card className="p-6 bg-white/70 backdrop-blur-sm border-green-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                  <Target className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">Smart Recommendations</h3>
              </div>
              <p className="text-gray-600">
                AI-powered suggestions for data quality improvements, visualization types, and actionable business insights.
              </p>
            </Card>
          </div>
          
          {!user && (
            <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl max-w-3xl mx-auto">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">👋</span>
                </div>
                <h3 className="font-semibold text-blue-900">Welcome to Data Detective!</h3>
              </div>
              <p className="text-blue-800">
                You can explore the dashboard and connect data sources right away. 
                Sign in using the Account tab above to save your work, set up scheduled refreshes, and access advanced collaboration features.
              </p>
            </div>
          )}
        </div>

        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid w-full grid-cols-5 mb-8 bg-white/70 backdrop-blur-sm border border-gray-200">
            <TabsTrigger value="connect" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-blue-600 data-[state=active]:text-white">
              <Upload className="w-4 h-4" />
              Connect
            </TabsTrigger>
            <TabsTrigger value="testing" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-purple-600 data-[state=active]:text-white">
              <TestTube className="w-4 h-4" />
              Testing
            </TabsTrigger>
            <TabsTrigger value="query" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-500 data-[state=active]:to-green-600 data-[state=active]:text-white">
              <Database className="w-4 h-4" />
              Query
            </TabsTrigger>
            <TabsTrigger value="visualize" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-orange-600 data-[state=active]:text-white">
              <BarChart3 className="w-4 h-4" />
              Visualize
            </TabsTrigger>
            <TabsTrigger value="insights" className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-500 data-[state=active]:to-yellow-600 data-[state=active]:text-white">
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
            <Card className="p-8 bg-white/70 backdrop-blur-sm border-orange-200">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mx-auto mb-6">
                  <BarChart3 className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">Smart Visualizations</h3>
                <p className="text-gray-600 text-lg mb-6">
                  Upload your data first to unlock AI-powered visualization recommendations and interactive charts!
                </p>
                <Button 
                  onClick={() => setActiveTab('connect')}
                  className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
                >
                  Connect Data Source
                </Button>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="insights" className="space-y-6">
            <Card className="p-8 bg-white/70 backdrop-blur-sm border-yellow-200">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center mx-auto mb-6">
                  <Lightbulb className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4">AI-Powered Insights</h3>
                <p className="text-gray-600 text-lg mb-6">
                  Connect your data to start generating validated business insights with confidence scores and statistical significance!
                </p>
                <Button 
                  onClick={() => setActiveTab('connect')}
                  className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700"
                >
                  Get Started
                </Button>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default QueryBuilder;
