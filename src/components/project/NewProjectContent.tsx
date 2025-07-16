
/**
 * New Project Content Component
 * Orchestrates the new project creation flow with proper error handling and validation
 */

import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useDatasetPersistence } from '@/hooks/useDatasetPersistence';
import { useToast } from '@/hooks/use-toast';
import DataDetectiveHeader from './DataDetectiveHeader';
import ProjectForm from './ProjectForm';
import { SPACING } from '@/constants/ui';

interface NewProjectContentProps {
  formData: any;
  onStartAnalysis: (educationalMode?: boolean, projectName?: string) => void;
  isLoading?: boolean;
}

const NewProjectContent: React.FC<NewProjectContentProps> = ({ formData, onStartAnalysis, isLoading = false }) => {
  const { user } = useAuth();
  const { saveAnalysisProject } = useDatasetPersistence();
  const { toast } = useToast();

  console.log('NewProjectContent formData:', {
    step: formData.step,
    researchQuestion: formData.researchQuestion,
    hasResearchQuestion: !!formData.researchQuestion,
    researchQuestionLength: formData.researchQuestion?.length || 0,
    projectName: formData.projectName,
    hasData: !!(formData.parsedData && formData.parsedData.length > 0),
    processedFilesCount: formData.processedFiles?.length || 0,
    uploading: formData.uploading,
    parsing: formData.parsing,
    setResearchQuestionType: typeof formData.setResearchQuestion
  });

  const handleStartAnalysisWrapper = async (educationalMode: boolean = false, projectName: string = '') => {
    console.log('NewProjectContent starting analysis:', { educationalMode, projectName });
    
    try {
      // Validate required fields
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

      if (!formData.uploadedData && (!formData.parsedData || formData.parsedData.length === 0)) {
        toast({
          title: "Data Required",
          description: "Please upload data files before starting analysis.",
          variant: "destructive",
        });
        return;
      }

      // Basic data validation
      if (formData.parsedData && formData.parsedData.length > 0) {
        const hasValidData = formData.parsedData.some((data: any) => 
          data && (data.rows > 0 || data.rowCount > 0)
        );

        if (!hasValidData) {
          toast({
            title: "Invalid Data",
            description: "The uploaded data appears to be empty. Please check your files.",
            variant: "destructive",
          });
          return;
        }
      }

      console.log('Validation passed, starting analysis');
      
      // Save project if user is authenticated
      if (user) {
        try {
          const savedProject = await saveAnalysisProject(
            projectName,
            formData.researchQuestion,
            formData.businessContext || '',
            formData.uploadedData || formData.parsedData
          );
          
          console.log('Project saved successfully:', savedProject);
        } catch (saveError) {
          console.error('Failed to save project:', saveError);
          // Continue with analysis even if save fails
        }
      }

      // Start the analysis
      onStartAnalysis(educationalMode, projectName);
      
    } catch (error) {
      console.error('Error starting analysis:', error);
      toast({
        title: "Analysis Failed to Start",
        description: error instanceof Error ? error.message : 'Unknown error occurred',
        variant: "destructive",
      });
    }
  };

  // Simplified for now - will add step components back progressively

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className={`container mx-auto px-${SPACING.MD} py-${SPACING.XL}`}>
        <DataDetectiveHeader />
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Create New Investigation</h2>
            <p className="text-gray-600">Follow the steps below to set up your data analysis project</p>
          </div>
          <div className="bg-white rounded-xl shadow-lg p-8">
            <p className="text-center text-gray-600">
              Project form components are being rebuilt with proper integration...
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewProjectContent;
