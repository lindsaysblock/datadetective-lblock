
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Calendar, BarChart } from 'lucide-react';
import { useDatasetPersistence } from '@/hooks/useDatasetPersistence';

interface ProjectLibraryTabProps {
  user: any;
  onDatasetSelect: (dataset: any) => void;
}

const ProjectLibraryTab: React.FC<ProjectLibraryTabProps> = ({ user, onDatasetSelect }) => {
  const navigate = useNavigate();
  const { datasets, loading } = useDatasetPersistence();

  const handleContinueInvestigation = (dataset: any) => {
    console.log('🔄 Continue investigation clicked for dataset:', dataset.id);
    
    // Navigate to new-project with continue case data
    navigate('/new-project', {
      state: {
        continueInvestigation: true,
        dataset: dataset
      }
    });
  };

  if (!user) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Project History</CardTitle>
          <CardDescription>
            Sign in to view your saved projects and datasets.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">Please sign in to access your project history.</p>
        </CardContent>
      </Card>
    );
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Project History</CardTitle>
          <CardDescription>Loading your saved projects...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-20 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!datasets || datasets.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Project History</CardTitle>
          <CardDescription>
            Your saved projects and datasets will appear here.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-500">No projects found. Start by uploading some data!</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Project History</CardTitle>
        <CardDescription>
          Continue working on your saved projects and datasets.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {datasets.map((dataset) => (
            <div key={dataset.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg">{dataset.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">{dataset.original_filename}</p>
                  
                  {dataset.summary?.researchQuestion && (
                    <p className="text-sm text-gray-700 mb-2">
                      <strong>Research Question:</strong> {dataset.summary.researchQuestion}
                    </p>
                  )}
                  
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(dataset.created_at).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <BarChart className="w-3 h-3" />
                      {dataset.summary?.totalRows || 0} rows
                    </span>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleContinueInvestigation(dataset)}
                  >
                    Continue Investigation
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProjectLibraryTab;
