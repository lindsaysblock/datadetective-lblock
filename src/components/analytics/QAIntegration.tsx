/**
 * Integration Component for Universal QA
 * Integrates the Universal QA component into existing pages
 */

import React from 'react';
import { UniversalQAComponent } from '@/components/analytics/UniversalQAComponent';
import { ParsedData } from '@/utils/dataParser';

interface QAIntegrationProps {
  data?: ParsedData | ParsedData[];
  files?: File[];
  databaseTables?: string[];
  userId?: string;
  showTitle?: boolean;
}

export const QAIntegration: React.FC<QAIntegrationProps> = ({
  data,
  files,
  databaseTables = ['datasets', 'projects', 'analysis_results'],
  userId,
  showTitle = true
}) => {
  return (
    <div className="space-y-6">
      {showTitle && (
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-2">
            🧠 Ask Questions About Your Data
          </h2>
          <p className="text-muted-foreground">
            Get intelligent insights from any file type or database source using AI
          </p>
        </div>
      )}
      
      <UniversalQAComponent
        data={data}
        files={files}
        databaseTables={databaseTables}
        userId={userId}
      />
    </div>
  );
};