import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const DataValidationDebug = () => {
  const [results, setResults] = useState<any[]>([]);

  const testValidation = () => {
    // This is the actual data structure from the console logs
    const parsedData = [
      {
        "id": "Sample_Behavior_Data_with_Commerce_Purchases.csv-1752694579685-0",
        "name": "Sample_Behavior_Data_with_Commerce_Purchases.csv",
        "rows": [
          {
            "timestamp": "2025-07-01 05:45:34.664282",
            "session_id": "5b8d89b1-8769-4e69-a2b0-7051d0e811c1",
            "user_id": "7f8c156e-4142-4807-bf08-b09a69493672",
            "user_type": "logged_in",
            "product_id": "e18b7971-87ca-4c99-bcf2-5efcda680e62",
            "category": "Category_7",
            "action": "view",
            "price": "196.73",
            "cost": "116.66",
            "quantity": "",
            "discount": "0.0",
            "shipping_cost": "0.0",
            "payment_method": "",
            "total_order_value": "0.0",
            "time_spent_sec": "119.79"
          }
        ],
        "columns": [
          {
            "name": "timestamp",
            "type": "date",
            "samples": ["2025-07-01 05:45:34.664282"]
          },
          {
            "name": "session_id", 
            "type": "string",
            "samples": ["5b8d89b1-8769-4e69-a2b0-7051d0e811c1"]
          }
        ],
        "rowCount": 10,
        "summary": {
          "totalRows": 10,
          "totalColumns": 15
        }
      }
    ];

    console.log('🔍 Testing validation with actual data structure:', parsedData);
    
    const validationResults = parsedData.map((data, index) => {
      const hasData = !!data;
      const hasRowCount = data?.rowCount > 0;
      const hasRows = data?.rows && data?.rows.length > 0;
      const hasColumns = !!data?.columns;
      const isColumnsArray = Array.isArray(data?.columns);
      const hasColumnsLength = data?.columns?.length > 0;
      
      const rowCondition = hasRowCount || hasRows;
      const columnCondition = hasColumns && isColumnsArray && hasColumnsLength;
      const finalResult = hasData && rowCondition && columnCondition;
      
      return {
        index,
        hasData,
        hasRowCount,
        hasRows,
        hasColumns,
        isColumnsArray,
        hasColumnsLength,
        rowCondition,
        columnCondition,
        finalResult,
        data: data
      };
    });

    console.log('🔍 Validation results:', validationResults);
    
    const hasValidData = parsedData.some(data => 
      data && 
      (data.rowCount > 0 || (data.rows && data.rows.length > 0)) && 
      data.columns && 
      Array.isArray(data.columns) && 
      data.columns.length > 0
    );
    
    console.log('🔍 Final hasValidData result:', hasValidData);
    
    setResults(validationResults);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Data Validation Debug</CardTitle>
        </CardHeader>
        <CardContent>
          <Button onClick={testValidation} className="mb-4">
            Test Validation Logic
          </Button>
          
          {results.length > 0 && (
            <div className="space-y-4">
              {results.map((result, index) => (
                <div key={index} className="bg-gray-100 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">Data Item {index}:</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>Has Data: {result.hasData ? '✅' : '❌'}</div>
                    <div>Has Row Count: {result.hasRowCount ? '✅' : '❌'}</div>
                    <div>Has Rows: {result.hasRows ? '✅' : '❌'}</div>
                    <div>Has Columns: {result.hasColumns ? '✅' : '❌'}</div>
                    <div>Is Columns Array: {result.isColumnsArray ? '✅' : '❌'}</div>
                    <div>Has Columns Length: {result.hasColumnsLength ? '✅' : '❌'}</div>
                    <div>Row Condition: {result.rowCondition ? '✅' : '❌'}</div>
                    <div>Column Condition: {result.columnCondition ? '✅' : '❌'}</div>
                    <div className="col-span-2 font-bold">
                      Final Result: {result.finalResult ? '✅ VALID' : '❌ INVALID'}
                    </div>
                  </div>
                  <details className="mt-2">
                    <summary className="cursor-pointer">View Raw Data</summary>
                    <pre className="mt-2 text-xs bg-white p-2 rounded overflow-auto">
                      {JSON.stringify(result.data, null, 2)}
                    </pre>
                  </details>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DataValidationDebug;