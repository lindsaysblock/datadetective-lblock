
/**
 * File Upload QA Section Component
 * Tests file upload functionality across different scenarios
 * Refactored for consistency and maintainability
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload } from 'lucide-react';
import FileUploadTestRunner from '../testing/FileUploadTestRunner';
import { SPACING, ICON_SIZES } from '@/constants/ui';

const FileUploadQASection: React.FC = () => {
  return (
    <div className={`space-y-${SPACING.LG}`}>
      <Card>
        <CardHeader>
          <CardTitle className={`flex items-center gap-${SPACING.SM}`}>
            <Upload className={`w-${ICON_SIZES.MD} h-${ICON_SIZES.MD}`} />
            File Upload Quality Assurance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className={`text-muted-foreground mb-${SPACING.MD}`}>
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
          <div className={`grid grid-cols-1 md:grid-cols-2 gap-${SPACING.MD}`}>
            <div className={`space-y-${SPACING.SM}`}>
              <h4 className="font-semibold">Upload Patterns</h4>
              <ul className={`text-sm space-y-${SPACING.XS} text-muted-foreground`}>
                <li>• Single file upload</li>
                <li>• Multiple files at once</li>
                <li>• Sequential file addition</li>
                <li>• File replacement scenarios</li>
              </ul>
            </div>
            <div className={`space-y-${SPACING.SM}`}>
              <h4 className="font-semibold">Technical Validation</h4>
              <ul className={`text-sm space-y-${SPACING.XS} text-muted-foreground`}>
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
