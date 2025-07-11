
import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Search, Plus, Calendar, BarChart3, Trash2 } from 'lucide-react';
import Header from '@/components/Header';
import { useIndexPageState } from '@/hooks/useIndexPageState';

const QueryHistory = () => {
  const { user, datasets, datasetsLoading } = useIndexPageState();

  if (datasetsLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading projects...</p>
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
                <h1 className="text-2xl font-bold text-gray-800">Query History</h1>
                <p className="text-gray-600">Manage your data exploration projects</p>
              </div>
            </div>
          </div>
          
          <Link to="/new-project">
            <Button className="bg-green-500 hover:bg-green-600 text-white flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Start New Project
            </Button>
          </Link>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search projects..."
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
                        {dataset.name || `Project ${index + 1}`}
                      </CardTitle>
                      <Badge variant="secondary" className="bg-green-100 text-green-800">
                        active
                      </Badge>
                    </div>
                    <CardDescription className="text-gray-600">
                      {dataset.summary?.description || 'Data analysis project'}
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm">
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </Button>
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
                    >
                      Continue Exploration
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card className="text-center py-12">
              <CardContent>
                <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-600 mb-2">No Projects Yet</h3>
                <p className="text-gray-500 mb-4">Start your first data exploration project</p>
                <Link to="/new-project">
                  <Button className="bg-green-500 hover:bg-green-600 text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    Start New Project
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
