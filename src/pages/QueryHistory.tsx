
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { ArrowLeft, Search, Plus, Calendar, BarChart3, Trash2 } from 'lucide-react';
import Header from '@/components/Header';
import { useAuth } from '@/hooks/useAuth';
import { useDatasetPersistence } from '@/hooks/useDatasetPersistence';
import { useToast } from '@/hooks/use-toast';

const QueryHistory = () => {
  const { user } = useAuth();
  const { datasets, loading: datasetsLoading, deleteDataset } = useDatasetPersistence();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (datasetId: string, datasetName: string) => {
    try {
      setDeletingId(datasetId);
      await deleteDataset(datasetId);
      toast({
        title: "Case Deleted",
        description: `${datasetName} has been permanently deleted.`,
      });
    } catch (error) {
      toast({
        title: "Delete Failed",
        description: "Failed to delete the case. Please try again.",
        variant: "destructive",
      });
    } finally {
      setDeletingId(null);
    }
  };

  const handleContinueInvestigation = (dataset: any) => {
    // Navigate back to the main page but replace the current route
    // This ensures we go to the Index component (/) which handles analysis
    navigate('/', { 
      state: { 
        selectedDataset: dataset,
        activeTab: 'analysis'
      },
      replace: true
    });
  };

  if (datasetsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading cases...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link to="/" className="flex items-center gap-2 text-gray-600 hover:text-gray-800">
              <ArrowLeft className="w-4 h-4" />
              Back to Explorer
            </Link>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <BarChart3 className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Case History</h1>
                <p className="text-gray-600">Manage your data investigation cases</p>
              </div>
            </div>
          </div>
          
          <Link to="/new-project">
            <Button className="bg-green-500 hover:bg-green-600 text-white flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Start New Case
            </Button>
          </Link>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search cases..."
              className="pl-10"
            />
          </div>
        </div>

        {/* Projects List */}
        <div className="space-y-6">
          {datasets && datasets.length > 0 ? (
            datasets.map((dataset: any, index: number) => (
              <Card key={dataset.id || index} className="hover:shadow-lg transition-shadow">
                <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <CardTitle className="text-lg">
                        {dataset.summary?.projectName || dataset.name || `Case ${index + 1}`}
                      </CardTitle>
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        active
                      </Badge>
                    </div>
                    <CardDescription className="text-gray-600">
                      {dataset.summary?.description || dataset.summary?.researchQuestion || 'Data investigation case'}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="sm" disabled={deletingId === dataset.id}>
                          {deletingId === dataset.id ? (
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-500"></div>
                          ) : (
                            <Trash2 className="w-4 h-4 text-red-500" />
                          )}
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Case</AlertDialogTitle>
                          <AlertDialogDescription>
                            Please confirm you want to permanently delete this case "{dataset.summary?.projectName || dataset.name || `Case ${index + 1}`}". This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(dataset.id, dataset.summary?.projectName || dataset.name || `Case ${index + 1}`)}
                            className="bg-red-500 hover:bg-red-600"
                          >
                            Delete Case
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardHeader>
                
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>Started: {new Date(dataset.created_at).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>Last used: {new Date(dataset.updated_at || dataset.created_at).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <BarChart3 className="w-4 h-4" />
                      <span>{dataset.summary?.totalRows || 0} rows</span>
                    </div>
                  </div>
                  
                  {/* Datasets Section */}
                  <div className="mb-4">
                    <h4 className="font-semibold text-sm text-gray-700 mb-2">Datasets (1)</h4>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 bg-blue-100 rounded flex items-center justify-center">
                          <span className="text-xs">📄</span>
                        </div>
                        <span>{dataset.original_filename}</span>
                      </div>
                      <Badge variant="outline">file</Badge>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button 
                      className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
                      onClick={() => handleContinueInvestigation(dataset)}
                    >
                      Continue Investigation
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card className="text-center py-12">
              <CardContent>
                <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">No Cases Yet</h3>
                <p className="text-gray-500 mb-4">Start your first data investigation case</p>
                <Link to="/new-project">
                  <Button className="bg-green-500 hover:bg-green-600 text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    Start New Case
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default QueryHistory;
