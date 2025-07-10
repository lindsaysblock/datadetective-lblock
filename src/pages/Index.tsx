
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useNavigate } from 'react-router-dom';
import { Plus, History } from 'lucide-react';
import Header from '@/components/Header';
import DashboardTabNavigation from '@/components/dashboard/DashboardTabNavigation';
import DataPreviewGrid from '@/components/data/DataPreviewGrid';
import DatasetsGrid from '@/components/data/DatasetsGrid';
import DataUploadFlow from '@/components/data/DataUploadFlow';
import { useIndexPageState } from '@/hooks/useIndexPageState';

const Index = () => {
  const {
    user,
    loading,
    handleUserChange,
    activeTab,
    setActiveTab,
    researchQuestion,
    setResearchQuestion,
    datasets,
    datasetsLoading,
    file,
    uploading,
    parsing,
    parsedData,
    handleFileChange,
    handleFileUpload,
    handleSaveDataset,
    handleStartAnalysis
  } = useIndexPageState();

  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <Header user={user} onUserChange={handleUserChange} />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header user={user} onUserChange={handleUserChange} />
      
      <div className="container mx-auto px-4 py-8">
        {!user ? (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Welcome to Data Detective</h2>
              <p className="text-gray-600 mb-6">Sign in to start exploring and analyzing your data.</p>
              <Button onClick={() => navigate('/auth')}>Sign In</Button>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Dashboard Options for Existing Users */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">Welcome Back, Detective!</h1>
              <p className="text-gray-600">What would you like to investigate today?</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              <Card 
                className="p-8 bg-gradient-to-br from-green-50 to-blue-50 border-green-200 hover:shadow-lg transition-all cursor-pointer group"
                onClick={() => navigate('/new-project')}
              >
                <div className="text-center">
                  <div className="p-4 bg-green-500 rounded-full w-16 h-16 mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <Plus className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-semibold text-xl text-gray-800 mb-2">Start New Project</h3>
                  <p className="text-gray-600">Upload fresh data and begin a new investigation</p>
                </div>
              </Card>

              <Card 
                className="p-8 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200 hover:shadow-lg transition-all cursor-pointer group"
                onClick={() => navigate('/query-history')}
              >
                <div className="text-center">
                  <div className="p-4 bg-purple-500 rounded-full w-16 h-16 mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <History className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-semibold text-xl text-gray-800 mb-2">Continue Existing Project</h3>
                  <p className="text-gray-600">Resume analysis on your saved datasets</p>
                </div>
              </Card>
            </div>

            {/* Recent Activity Section */}
            <div className="max-w-6xl mx-auto">
              <Card className="border-blue-300">
                <CardHeader>
                  <CardTitle className="text-xl font-bold">Recent Projects</CardTitle>
                  <CardDescription className="text-gray-600">
                    Quick access to your latest investigations
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <DatasetsGrid datasets={datasets?.slice(0, 3) || []} loading={datasetsLoading} />
                  {datasets && datasets.length > 3 && (
                    <div className="text-center mt-4">
                      <Button variant="outline" onClick={() => navigate('/query-history')}>
                        View All Projects
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
