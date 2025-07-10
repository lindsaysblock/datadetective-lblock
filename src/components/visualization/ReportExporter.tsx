
import React from 'react';
import { Button } from '@/components/ui/button';
import { FileText, FileImage } from 'lucide-react';

interface ReportExporterProps {
  findings: any[];
  onExportAllFindings: () => void;
  onExportVisualReport: () => void;
}

const ReportExporter: React.FC<ReportExporterProps> = ({
  findings,
  onExportAllFindings,
  onExportVisualReport
}) => {
  if (findings.length === 0) return null;

  return (
    <div className="flex gap-2">
      <Button 
        onClick={onExportAllFindings}
        variant="outline"
        className="flex items-center gap-2"
      >
        <FileText className="w-4 h-4" />
        Export Data
      </Button>
      <Button 
        onClick={onExportVisualReport}
        className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
      >
        <FileImage className="w-4 h-4" />
        Export Visual Report
      </Button>
    </div>
  );
};

export default ReportExporter;
