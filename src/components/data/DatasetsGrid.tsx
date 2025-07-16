
/**
 * Datasets Grid Component
 * Refactored to meet coding standards with proper constants and semantic styling
 */

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { SPACING, TEXT_SIZES, ICON_SIZES } from '@/constants/ui';

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
      <div className="text-primary flex items-center">
        <div className={`animate-spin rounded-full h-${SPACING.LG} w-${SPACING.LG} border-b-2 border-primary mr-${SPACING.SM}`}></div>
        Loading datasets...
      </div>
    );
  }

  if (datasets.length === 0) {
    return (
      <div className={`col-span-full text-center py-${SPACING.XXL}`}>
        <AlertTriangle className={`w-10 h-10 text-muted-foreground mx-auto mb-${SPACING.MD}`} />
        <p className="text-muted-foreground">No datasets uploaded yet.</p>
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-${SPACING.MD}`}>
      {datasets.map((dataset) => (
        <Card key={dataset.id} className="border-primary/20">
          <CardHeader>
            <CardTitle className={`${TEXT_SIZES.LARGE} font-semibold`}>{dataset.name}</CardTitle>
            <CardDescription className="text-muted-foreground">
              Uploaded on {new Date(dataset.created_at).toLocaleDateString()}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className={`flex items-center space-x-${SPACING.SM} ${TEXT_SIZES.SMALL} text-muted-foreground`}>
              <FileText className={ICON_SIZES.SM} />
              <span>{dataset.original_filename}</span>
            </div>
            <div className={`flex justify-end mt-${SPACING.MD}`}>
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
