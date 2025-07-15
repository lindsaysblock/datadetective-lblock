
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import StepIndicator from './StepIndicator';
import ResearchQuestionStep from './ResearchQuestionStep';
import DataSourceStep from './DataSourceStep';
import BusinessContextStep from './BusinessContextStep';
import AnalysisSummaryStep from './AnalysisSummaryStep';
import { useNewProjectForm } from '@/hooks/useNewProjectForm';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';

interface NewProjectContentProps {
  onStartAnalysis: (educationalMode?: boolean, projectName?: string) => void;
}

const NewProjectContent: React.FC<NewProjectContentProps> = ({ onStartAnalysis }) => {
  const formData = useNewProjectForm();
  const { user } = useAuth();
  const { toast } = useToast();

  console.log('NewProjectContent formData:', {
    step: formData.step,
    researchQuestion: formData.researchQuestion,
    hasResearchQuestion: !!formData.researchQuestion,
    researchQuestionLength: formData.researchQuestion?.length || 0
  });

  const handleStartAnalysisWrapper = async (educationalMode: boolean = false, projectName: string = '') => {
    console.log('NewProjectContent starting analysis:', { educationalMode, projectName });
    
    // Validate required fields
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to start analysis.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.researchQuestion?.trim()) {
      toast({
        title: "Research Question Required",
        description: "Please enter a research question before starting analysis.",
        variant: "destructive",
      });
      return;
    }

    if (!projectName.trim()) {
      toast({
        title: "Project Name Required",
        description: "Please enter a project name before starting analysis.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.files || formData.files.length === 0) {
      toast({
        title: "Data Required",
        description: "Please upload data files before starting analysis.",
        variant: "destructive",
      });
      return;
    }

    // Check for duplicate project names
    try {
      const { supabase } = await import('@/integrations/supabase/client');
      const { data: existingProjects, error } = await supabase
        .from('datasets')
        .select('id')
        .eq('name', projectName.trim())
        .eq('user_id', user.id)
        .limit(1);

      if (error) {
        console.error('Error checking project name:', error);
        toast({
          title: "Validation Error",
          description: "Unable to validate project name. Please try again.",
          variant: "destructive",
        });
        return;
      }

      if (existingProjects && existingProjects.length > 0) {
        toast({
          title: "Project Name Exists",
          description: "A project with this name already exists. Please choose a different name.",
          variant: "destructive",
        });
        return;
      }

      // Save project to history
      for (const data of formData.parsedData) {
        const metadata = {
          columns: data.columns || [],
          sample_rows: data.rows?.slice(0, 10) || []
        };

        const summary = {
          projectName,
          researchQuestion: formData.researchQuestion,
          description: formData.additionalContext,
          totalRows: data.summary?.totalRows || data.rowCount || 0,
          totalColumns: data.summary?.totalColumns || data.columns?.length || 0,
          ...data.summary
        };

        const { error: insertError } = await supabase
          .from('datasets')
          .insert([{
            user_id: user.id,
            name: projectName,
            original_filename: data.name || 'uploaded_file.csv',
            file_size: null,
            mime_type: data.name?.endsWith('.csv') ? 'text/csv' : 'application/json',
            metadata: metadata,
            summary: summary
          }]);

        if (insertError) {
          console.error('Error saving project:', insertError);
          toast({
            title: "Save Failed",
            description: "Failed to save project to history. Please try again.",
            variant: "destructive",
          });
          return;
        }
      }

      toast({
        title: "Project Saved",
        description: `"${projectName}" has been saved to your project history.`,
      });

      // Now start the analysis
      onStartAnalysis(educationalMode, projectName);

    } catch (error) {
      console.error('Error in project validation/saving:', error);
      toast({
        title: "Error",
        description: "An error occurred while processing your request. Please try again.",
        variant: "destructive",
      });
    }
  };

  const renderStepContent = () => {
    switch (formData.step) {
      case 1:
        return (
          <ResearchQuestionStep
            researchQuestion={formData.researchQuestion}
            setResearchQuestion={formData.setResearchQuestion}
            onNext={formData.nextStep}
          />
        );
      case 2:
        return (
          <DataSourceStep
            files={formData.files}
            uploading={formData.uploading}
            parsing={formData.parsing}
            parsedData={formData.parsedData}
            onFileChange={(event) => {
              const selectedFiles = event.target.files;
              if (selectedFiles && selectedFiles.length > 0) {
                Array.from(selectedFiles).forEach(file => {
                  formData.addFile(file);
                });
              }
            }}
            onFileUpload={formData.handleFileUpload}
            onRemoveFile={formData.removeFile}
            onColumnMapping={formData.setColumnMapping}
            onNext={formData.nextStep}
            onPrevious={formData.prevStep}
          />
        );
      case 3:
        return (
          <BusinessContextStep
            additionalContext={formData.additionalContext}
            setAdditionalContext={formData.setAdditionalContext}
            parsedData={formData.parsedData}
            columnMapping={formData.columnMapping}
            onColumnMapping={formData.setColumnMapping}
            onNext={formData.nextStep}
            onPrevious={formData.prevStep}
          />
        );
      case 4:
        return (
          <AnalysisSummaryStep
            researchQuestion={formData.researchQuestion}
            additionalContext={formData.additionalContext}
            parsedData={formData.parsedData}
            columnMapping={formData.columnMapping}
            analysisResults={formData.analysisResults}
            analysisCompleted={formData.analysisCompleted}
            isProcessingAnalysis={formData.isProcessingAnalysis}
            onStartAnalysis={handleStartAnalysisWrapper}
            onPrevious={formData.prevStep}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <StepIndicator currentStep={formData.step} />
      
      <Card className="mt-8">
        <CardContent className="p-8">
          {renderStepContent()}
        </CardContent>
      </Card>
    </div>
  );
};

export default NewProjectContent;
