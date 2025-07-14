
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload } from 'lucide-react';
import FileUploadTestRunner from '../testing/FileUploadTestRunner';

const FileUploadQASection: React.FC = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            File Upload Quality Assurance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">
            Test file upload functionality across different scenarios to ensure reliable data ingestion.
          </p>
          <FileUploadTestRunner />
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Test Scenarios Covered</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-semibold">Upload Patterns</h4>
              <ul className="text-sm space-y-1 text-gray-600">
                <li>• Single file upload</li>
                <li>• Multiple files at once</li>
                <li>• Sequential file addition</li>
                <li>• File replacement scenarios</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold">Technical Validation</h4>
              <ul className="text-sm space-y-1 text-gray-600">
                <li>• FileList interface compliance</li>
                <li>• Event handling correctness</li>
                <li>• Processing flow integrity</li>
                <li>• Error handling robustness</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default FileUploadQASection;
