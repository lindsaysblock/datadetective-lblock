
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface DataPreviewGridProps {
  parsedData: {
    columns: string[];
    rows: any[];
  };
}

const DataPreviewGrid: React.FC<DataPreviewGridProps> = ({ parsedData }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <CardHeader>
          <CardTitle>Columns</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc pl-5">
            {parsedData.columns.map((column: string, index: number) => (
              <li key={index}>{column}</li>
            ))}
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Sample Data</CardTitle>
        </CardHeader>
        <CardContent>
          {parsedData.rows.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr>
                    {parsedData.columns.map((column: string, index: number) => (
                      <th key={index} className="text-left font-medium text-gray-700 py-2 px-3 border-b">
                        {column}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {parsedData.rows.slice(0, 5).map((row: any, rowIndex: number) => (
                    <tr key={rowIndex}>
                      {parsedData.columns.map((column: string, colIndex: number) => (
                        <td key={colIndex} className="py-2 px-3 border-b text-sm text-gray-500">
                          {typeof row[column] === 'object' ? JSON.stringify(row[column]) : String(row[column])}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-gray-500">No data to display.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DataPreviewGrid;
