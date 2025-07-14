
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { parseFile } from '@/utils/dataParser';

export const useNewProjectForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    researchQuestion: '',
    businessContext: '',
    projectName: '',
    files: [] as File[],
    parsedData: [] as any[]
  });
  const [uploading, setUploading] = useState(false);
  const [parsing, setParsing] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || []);
    console.log('handleFileChange called with files:', selectedFiles.map(f => f.name));
    
    if (selectedFiles.length > 0) {
      selectedFiles.forEach(file => {
        console.log('Adding file:', file.name);
      });
      
      setFormData(prev => ({
        ...prev,
        files: [...prev.files, ...selectedFiles]
      }));
      
      console.log('Files updated in formData');
    }
  };

  const handleFileUpload = async () => {
    console.log('handleFileUpload called with files:', formData.files.length);
    
    if (formData.files.length === 0) {
      console.log('No files to upload - files array is empty');
      toast({
        title: "No files selected",
        description: "Please select at least one file to upload.",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    setParsing(false);

    try {
      console.log('Starting file upload process for files:', formData.files.map(f => f.name));
      
      // Small delay to show uploading state
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setUploading(false);
      setParsing(true);
      
      const parsedResults = [];
      
      for (const file of formData.files) {
        try {
          console.log('Parsing file:', file.name);
          const parsed = await parseFile(file);
          console.log('File parsed successfully:', file.name, parsed);
          
          parsedResults.push({
            name: file.name,
            summary: parsed.summary,
            columns: parsed.columns,
            rows: parsed.rows,
            totalRows: parsed.rowCount
          });
        } catch (error) {
          console.error('Error parsing file:', file.name, error);
          toast({
            title: "Parsing Error",
            description: `Failed to parse ${file.name}: ${error instanceof Error ? error.message : 'Unknown error'}`,
            variant: "destructive",
          });
        }
      }
      
      if (parsedResults.length > 0) {
        setFormData(prev => ({
          ...prev,
          parsedData: parsedResults
        }));
        
        console.log('All files parsed successfully:', parsedResults.length);
        
        toast({
          title: "Files Processed",
          description: `Successfully processed ${parsedResults.length} file(s).`,
        });
      }
      
    } catch (error) {
      console.error('Error in file upload:', error);
      toast({
        title: "Upload Failed",
        description: `Failed to process files: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      });
    } finally {
      setParsing(false);
    }
  };

  const handleRemoveFile = (index: number) => {
    console.log('Removing file at index:', index);
    setFormData(prev => ({
      ...prev,
      files: prev.files.filter((_, i) => i !== index),
      parsedData: prev.parsedData.filter((_, i) => i !== index)
    }));
  };

  const handleNext = () => {
    console.log('Moving to next step from:', currentStep);
    setCurrentStep(prev => prev + 1);
  };

  const handlePrevious = () => {
    console.log('Moving to previous step from:', currentStep);
    setCurrentStep(prev => prev - 1);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  console.log('useNewProjectForm hook called');
  console.log('useNewProjectForm returning step:', currentStep);
  console.log('useNewProjectForm parsedData:', formData.parsedData.length > 0 ? 'has data' : 'no data');
  console.log('useNewProjectForm files count:', formData.files.length);

  return {
    currentStep,
    formData,
    uploading,
    parsing,
    handleFileChange,
    handleFileUpload,
    handleRemoveFile,
    handleNext,
    handlePrevious,
    handleInputChange
  };
};
