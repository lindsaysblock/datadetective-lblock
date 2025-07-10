
import { useToast } from '@/hooks/use-toast';

export const useDashboardActions = (filename?: string) => {
  const { toast } = useToast();

  const handleHypothesisUpdate = (hypothesis: any) => {
    console.log('Hypothesis updated:', hypothesis);
    toast({
      title: "Hypothesis Updated",
      description: "Your hypothesis has been updated successfully.",
    });
  };

  const handleSelectVisualization = (type: string, data: any[]) => {
    console.log('Visualization selected:', type, data);
    toast({
      title: "Visualization Selected",
      description: `Selected ${type} chart for visualization.`,
    });
  };

  const handleExportFinding = (finding: any) => {
    console.log('Exporting finding:', finding);
    
    const exportData = {
      finding,
      exportDate: new Date().toISOString(),
      metadata: {
        source: filename || 'unknown',
        dataRows: 0
      }
    };
    
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `finding-${finding.id}-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: "Finding Exported",
      description: "Your finding has been exported successfully.",
    });
  };

  const handleShareFinding = (finding: any) => {
    console.log('Sharing finding:', finding);
    
    const shareText = `📊 Data Finding: ${finding.title}\n\n${finding.insight}\n\nConfidence: ${finding.confidence}\nGenerated: ${finding.timestamp.toLocaleDateString()}`;
    
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareText).then(() => {
        toast({
          title: "Finding Copied",
          description: "Finding summary copied to clipboard for sharing.",
        });
      }).catch(() => {
        toast({
          title: "Share Ready",
          description: "Finding details logged to console for sharing.",
        });
      });
    } else {
      toast({
        title: "Share Ready",
        description: "Finding details logged to console for sharing.",
      });
    }
  };

  return {
    handleHypothesisUpdate,
    handleSelectVisualization,
    handleExportFinding,
    handleShareFinding
  };
};
