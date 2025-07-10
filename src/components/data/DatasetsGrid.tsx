
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Dataset {
  id: string;
  name: string;
  created_at: string;
  original_filename: string;
}

interface DatasetsGridProps {
  datasets: Dataset[];
  loading: boolean;
}

const DatasetsGrid: React.FC<DatasetsGridProps> = ({ datasets, loading }) => {
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="text-blue-600 flex items-center">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mr-2"></div>
        Loading datasets...
      </div>
    );
  }

  if (datasets.length === 0) {
    return (
      <div className="col-span-full text-center py-12">
        <AlertTriangle className="w-10 h-10 text-gray-400 mx-auto mb-4" />
        <p className="text-gray-500">No datasets uploaded yet.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {datasets.map((dataset) => (
        <Card key={dataset.id} className="border-blue-200">
          <CardHeader>
            <CardTitle className="text-lg font-semibold">{dataset.name}</CardTitle>
            <CardDescription className="text-gray-500">
              Uploaded on {new Date(dataset.created_at).toLocaleDateString()}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <FileText className="w-4 h-4" />
              <span>{dataset.original_filename}</span>
            </div>
            <div className="flex justify-end mt-4">
              <Button
                variant="outline"
                onClick={() => navigate(`/?dataset=${dataset.id}`)}
              >
                Explore
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default DatasetsGrid;
