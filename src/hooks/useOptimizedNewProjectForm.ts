import { useState, useCallback } from 'react';
import { useProjectManagement } from './useProjectManagement';
import { useFileUploadManager } from './useFileUploadManager';
import { useToast } from './use-toast';
import { useNavigate } from 'react-router-dom';

export interface OptimizedFormData {
  // Project details
  projectName: string;
  researchQuestion: string;
  businessContext: string;
  mode: 'educational' | 'professional';
  
  // File handling
  selectedFiles: File[];
  uploadedFiles: any[];
  parsedData: any[];
  
  // UI state
  step: number;
  isProcessing: boolean;
}

const initialFormData: OptimizedFormData = {
  projectName: '',
  researchQuestion: '',
  businessContext: '',
  mode: 'professional',
  selectedFiles: [],
  uploadedFiles: [],
  parsedData: [],
  step: 1,
  isProcessing: false,
};

export const useOptimizedNewProjectForm = () => {
  const [formData, setFormData] = useState<OptimizedFormData>(initialFormData);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  
  const projectManager = useProjectManagement();
  const fileUploader = useFileUploadManager();
  const { toast } = useToast();
  const navigate = useNavigate();

  // Form validation
  const validateStep = useCallback((step: number): boolean => {
    const errors: Record<string, string> = {};
    
    switch (step) {
      case 1:
        if (!formData.researchQuestion.trim()) {
          errors.researchQuestion = 'Research question is required';
        } else if (formData.researchQuestion.length < 10) {
          errors.researchQuestion = 'Research question should be at least 10 characters';
        }
        break;
        
      case 2:
        if (formData.selectedFiles.length === 0 && formData.uploadedFiles.length === 0) {
          errors.files = 'At least one data file is required';
        }
        break;
        
      case 4:
        if (!formData.projectName.trim()) {
          errors.projectName = 'Project name is required';
        }
        break;
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  }, [formData]);

  // Step navigation
  const nextStep = useCallback(() => {
    if (validateStep(formData.step)) {
      setFormData(prev => ({ ...prev, step: prev.step + 1 }));
    } else {
      toast({
        title: "Validation Error",
        description: "Please fix the errors before proceeding.",
        variant: "destructive",
      });
    }
  }, [formData.step, validateStep, toast]);

  const prevStep = useCallback(() => {
    setFormData(prev => ({ ...prev, step: Math.max(1, prev.step - 1) }));
    setValidationErrors({});
  }, []);

  const goToStep = useCallback((step: number) => {
    setFormData(prev => ({ ...prev, step }));
    setValidationErrors({});
  }, []);

  // Form field updates
  const updateField = useCallback(<K extends keyof OptimizedFormData>(
    field: K,
    value: OptimizedFormData[K]
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear validation error for this field
    if (validationErrors[field]) {
      setValidationErrors(prev => {
        const { [field]: _, ...rest } = prev;
        return rest;
      });
    }
  }, [validationErrors]);

  // File handling
  const handleFileSelection = useCallback((files: File[]) => {
    updateField('selectedFiles', files);
  }, [updateField]);

  const processFiles = useCallback(async (projectId: string) => {
    if (formData.selectedFiles.length === 0) return [];

    setFormData(prev => ({ ...prev, isProcessing: true }));
    
    try {
      const results = await fileUploader.uploadFiles(formData.selectedFiles, projectId);
      
      updateField('uploadedFiles', results);
      updateField('parsedData', results.map(f => f.parsedData));
      
      return results;
    } catch (error) {
      console.error('File processing failed:', error);
      toast({
        title: "File Processing Failed",
        description: error instanceof Error ? error.message : 'Unknown error occurred',
        variant: "destructive",
      });
      return [];
    } finally {
      setFormData(prev => ({ ...prev, isProcessing: false }));
    }
  }, [formData.selectedFiles, fileUploader, updateField, toast]);

  // Project creation and analysis
  const startAnalysis = useCallback(async (): Promise<boolean> => {
    if (!validateStep(4)) return false;

    setFormData(prev => ({ ...prev, isProcessing: true }));

    try {
      // Create project
      const project = await projectManager.createProject(
        formData.projectName,
        formData.researchQuestion,
        formData.businessContext,
        formData.mode
      );

      if (!project) {
        throw new Error('Failed to create project');
      }

      // Process files if any
      let fileResults = [];
      if (formData.selectedFiles.length > 0) {
        fileResults = await processFiles(project.id);
      }

      // Start analysis session
      const sessionType = formData.mode === 'educational' ? 'educational' : 'standard';
      const session = await projectManager.startAnalysisSession(project.id, sessionType);

      if (!session) {
        throw new Error('Failed to start analysis session');
      }

      // Navigate to analysis page with proper state
      navigate('/analysis', {
        state: {
          project,
          session,
          formData: {
            ...formData,
            uploadedFiles: fileResults,
            parsedData: fileResults.map(f => f.parsedData)
          },
          educationalMode: formData.mode === 'educational',
          projectName: formData.projectName
        }
      });

      toast({
        title: "🚀 Investigation Started",
        description: `Analysis has begun for "${formData.projectName}"`,
      });

      return true;
    } catch (error) {
      console.error('Analysis start failed:', error);
      toast({
        title: "Analysis Failed",
        description: error instanceof Error ? error.message : 'Failed to start analysis',
        variant: "destructive",
      });
      return false;
    } finally {
      setFormData(prev => ({ ...prev, isProcessing: false }));
    }
  }, [formData, validateStep, projectManager, processFiles, navigate, toast]);

  // Reset form
  const resetForm = useCallback(() => {
    setFormData(initialFormData);
    setValidationErrors({});
    fileUploader.clearAll();
    projectManager.setCurrentProject(null);
    projectManager.setCurrentSession(null);
  }, [fileUploader, projectManager]);

  // Load existing project
  const loadProject = useCallback(async (projectId: string) => {
    try {
      const projects = await projectManager.fetchProjects();
      const project = projects.find(p => p.id === projectId);
      
      if (project) {
        projectManager.setCurrentProject(project);
        
        // Load project files
        const files = await fileUploader.getFilesByProject(projectId);
        
        setFormData({
          projectName: project.name,
          researchQuestion: project.research_question,
          businessContext: project.business_context || '',
          mode: project.mode,
          selectedFiles: [],
          uploadedFiles: files,
          parsedData: files.map(f => f.parsedData),
          step: files.length > 0 ? 4 : 2,
          isProcessing: false,
        });

        toast({
          title: "🔄 Project Loaded",
          description: `Continuing investigation "${project.name}"`,
        });
      }
    } catch (error) {
      console.error('Failed to load project:', error);
      toast({
        title: "Load Failed",
        description: "Failed to load the project.",
        variant: "destructive",
      });
    }
  }, [projectManager, fileUploader, toast]);

  return {
    // State
    formData,
    validationErrors,
    isLoading: projectManager.isLoading || fileUploader.isUploading || formData.isProcessing,
    error: projectManager.error,

    // Navigation
    nextStep,
    prevStep,
    goToStep,

    // Form updates
    updateField,
    setResearchQuestion: (value: string) => updateField('researchQuestion', value),
    setProjectName: (value: string) => updateField('projectName', value),
    setBusinessContext: (value: string) => updateField('businessContext', value),
    setMode: (value: 'educational' | 'professional') => updateField('mode', value),

    // File handling
    handleFileSelection,
    processFiles,
    removeFile: fileUploader.removeFile,

    // Actions
    startAnalysis,
    resetForm,
    loadProject,
    validateStep,

    // Upload state
    uploadProgress: fileUploader.uploadProgress,
    processingStatus: fileUploader.processingStatus,

    // Project management
    projectManager,
    fileUploader,
  };
};

export default useOptimizedNewProjectForm;