
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ParsedData } from '@/utils/dataParser';

interface SuccessDisplayProps {
  data?: ParsedData;
}

const SuccessDisplay: React.FC<SuccessDisplayProps> = ({ data }) => {
  if (!data) return null;

  return (
    <div className="mt-8 text-center">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Upload Complete</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Successfully processed {data.summary.totalRows} rows and {data.summary.totalColumns} columns
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default SuccessDisplay;
