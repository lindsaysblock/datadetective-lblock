import { useState } from 'react';
import Papa from 'papaparse';
import { ColumnMapping } from '../components/data/ColumnIdentificationStep';
import { validateFile } from '@/utils/fileValidation';

export const useProjectFormState = () => {
  console.log('useProjectFormState initializing');
  
  const [step, setStep] = useState(1);
  const [researchQuestion, setResearchQuestion] = useState('');
  const [additionalContext, setAdditionalContext] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [parsing, setParsing] = useState(false);
  const [parsedData, setParsedData] = useState<any[]>([]);
  const [currentProjectName, setCurrentProjectName] = useState('');
  const [columnMapping, setColumnMapping] = useState<ColumnMapping>({
    valueColumns: [],
    categoryColumns: []
  });

  console.log('useProjectFormState initialized with step:', step);

  const nextStep = () => {
    console.log('nextStep called, current step:', step);
    setStep(prev => {
      const newStep = prev + 1;
      console.log('Moving to step:', newStep);
      return newStep;
    });
  };
  
  const prevStep = () => {
    console.log('prevStep called, current step:', step);
    setStep(prev => {
      const newStep = prev - 1;
      console.log('Moving to step:', newStep);
      return newStep;
    });
  };

  const parseFile = async (file: File): Promise<any> => {
    // Validate file first
    const validation = validateFile(file);
    if (!validation.isValid) {
      throw new Error(validation.error);
    }
    
    return new Promise((resolve, reject) => {
      const fileExtension = file.name?.split('.').pop()?.toLowerCase();

      if (fileExtension === 'csv' || file.type === 'text/csv' || file.type === 'application/vnd.ms-excel') {
        Papa.parse(file, {
          header: true,
          dynamicTyping: true,
          complete: (results) => {
            resolve({
              id: Date.now() + Math.random(),
              name: file.name,
              rows: results.data.length,
              columns: results.meta.fields?.length || 0,
              preview: results.data.slice(0, 5),
              data: results.data
            });
          },
          error: (error) => {
            reject(error);
          }
        });
      } else if (fileExtension === 'json' || file.type === 'application/json' || file.type === 'text/json') {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const jsonData = JSON.parse(e.target?.result as string);
            const dataArray = Array.isArray(jsonData) ? jsonData : [jsonData];
            const columns = Object.keys(dataArray[0] || {});
            
            resolve({
              id: Date.now() + Math.random(),
              name: file.name,
              rows: dataArray.length,
              columns: columns.length,
              preview: dataArray.slice(0, 5),
              data: dataArray
            });
          } catch (error) {
            reject(error);
          }
        };
        reader.readAsText(file);
      } else if (fileExtension === 'txt' || file.type === 'text/plain' || file.type === 'text/txt') {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const text = e.target?.result as string;
            const lines = text.split('\n').filter(line => line.trim());
            
            // Check if it looks like CSV
            if (lines.length > 0 && lines[0].includes(',')) {
              const headers = lines[0]?.split(',').map(h => h.trim().replace(/"/g, '')) || [];
              const rows = lines.slice(1).map(line => {
                const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
                const row: any = {};
                headers.forEach((header, index) => {
                  row[header] = values[index] || '';
                });
                return row;
              });
              
              resolve({
                id: Date.now() + Math.random(),
                name: file.name,
                rows: rows.length,
                columns: headers.length,
                preview: rows.slice(0, 5),
                data: rows
              });
            } else {
              // Plain text
              resolve({
                id: Date.now() + Math.random(),
                name: file.name,
                rows: lines.length,
                columns: 2,
                preview: lines.slice(0, 5).map((line, index) => ({ line_number: index + 1, content: line })),
                data: lines.map((line, index) => ({ line_number: index + 1, content: line }))
              });
            }
          } catch (error) {
            reject(error);
          }
        };
        reader.readAsText(file);
      } else {
        reject(new Error(`File type .${fileExtension} is not supported. Supported types: CSV, JSON, TXT`));
      }
    });
  };

  const handleFileUpload = async () => {
    if (!files.length) return;
    
    setUploading(true);
    setParsing(true);
    
    try {
      const parsedResults = [];
      for (const file of files) {
        const parsed = await parseFile(file);
        parsedResults.push(parsed);
      }
      setParsedData(parsedResults);
      console.log('Files parsed successfully:', parsedResults);
    } catch (error) {
      console.error('File upload error:', error);
    } finally {
      setUploading(false);
      setParsing(false);
    }
  };

  const addFile = (file: File) => {
    console.log('Adding file:', file.name);
    setFiles(prev => [...prev, file]);
  };

  const removeFile = (index: number) => {
    console.log('Removing file at index:', index);
    setFiles(prev => prev.filter((_, i) => i !== index));
    setParsedData(prev => prev.filter((_, i) => i !== index));
  };

  const handleColumnMapping = (mapping: ColumnMapping) => {
    console.log('Column mapping updated:', mapping);
    setColumnMapping(mapping);
  };

  const resetForm = () => {
    console.log('Resetting form');
    setStep(1);
    setResearchQuestion('');
    setAdditionalContext('');
    setFiles([]);
    setUploading(false);
    setParsing(false);
    setParsedData([]);
    setCurrentProjectName('');
    setColumnMapping({
      valueColumns: [],
      categoryColumns: []
    });
  };

  return {
    step,
    researchQuestion,
    additionalContext,
    files,
    uploading,
    parsing,
    parsedData,
    currentProjectName,
    columnMapping,
    setStep,
    setResearchQuestion,
    setAdditionalContext,
    setFiles,
    setUploading,
    setParsing,
    setParsedData,
    setCurrentProjectName,
    setColumnMapping: handleColumnMapping,
    nextStep,
    prevStep,
    handleFileUpload,
    addFile,
    removeFile,
    resetForm
  };
};
