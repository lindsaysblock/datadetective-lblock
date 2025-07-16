import { useState, useCallback, useRef } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

export interface FileUploadResult {
  id: string;
  filename: string;
  originalFilename: string;
  fileSize: number;
  mimeType: string;
  storagePath: string;
  parsedData: any;
  columnMapping: any;
}

export const useFileUploadManager = () => {
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const [processingStatus, setProcessingStatus] = useState<Record<string, 'uploading' | 'parsing' | 'completed' | 'error'>>({});
  const [uploadedFiles, setUploadedFiles] = useState<FileUploadResult[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();
  const uploadQueue = useRef<File[]>([]);

  const generateUniqueFilename = useCallback((originalName: string): string => {
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(2, 8);
    const extension = originalName?.split('.').pop();
    return `${timestamp}_${randomId}.${extension}`;
  }, []);

  const uploadToStorage = useCallback(async (file: File, projectId: string): Promise<string | null> => {
    const filename = generateUniqueFilename(file.name);
    const filePath = `${user?.id}/${projectId}/${filename}`;

    try {
      const { error } = await supabase.storage
        .from('datasets')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) throw error;
      return filePath;
    } catch (error) {
      console.error('Storage upload failed:', error);
      return null;
    }
  }, [user?.id, generateUniqueFilename]);

  const parseFileData = useCallback(async (file: File): Promise<any> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (event) => {
        try {
          const text = event.target?.result as string;
          
          if (file.type === 'application/json') {
            const jsonData = JSON.parse(text);
            resolve({
              rows: Array.isArray(jsonData) ? jsonData : [jsonData],
              columns: Array.isArray(jsonData) && jsonData.length > 0 ? Object.keys(jsonData[0]) : [],
              rowCount: Array.isArray(jsonData) ? jsonData.length : 1,
              summary: {
                fileType: 'JSON',
                totalRows: Array.isArray(jsonData) ? jsonData.length : 1,
                totalColumns: Array.isArray(jsonData) && jsonData.length > 0 ? Object.keys(jsonData[0]).length : 0
              }
            });
          } else if (file.type === 'text/csv' || file.name?.endsWith('.csv')) {
            const lines = text.split('\n').filter(line => line.trim());
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
              rows,
              columns: headers,
              rowCount: rows.length,
              summary: {
                fileType: 'CSV',
                totalRows: rows.length,
                totalColumns: headers.length
              }
            });
          } else {
            // For other text files, create a simple structure
            const lines = text.split('\n').filter(line => line.trim());
            resolve({
              rows: lines.map((line, index) => ({ line_number: index + 1, content: line })),
              columns: ['line_number', 'content'],
              rowCount: lines.length,
              summary: {
                fileType: 'TEXT',
                totalRows: lines.length,
                totalColumns: 2
              }
            });
          }
        } catch (error) {
          reject(error);
        }
      };

      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  }, []);

  const processFile = useCallback(async (
    file: File,
    projectId: string,
    fileId: string
  ): Promise<FileUploadResult | null> => {
    if (!user) return null;

    try {
      // Update status to uploading
      setProcessingStatus(prev => ({ ...prev, [fileId]: 'uploading' }));
      setUploadProgress(prev => ({ ...prev, [fileId]: 0 }));

      // Upload to storage
      const storagePath = await uploadToStorage(file, projectId);
      if (!storagePath) throw new Error('Failed to upload to storage');

      setUploadProgress(prev => ({ ...prev, [fileId]: 50 }));
      setProcessingStatus(prev => ({ ...prev, [fileId]: 'parsing' }));

      // Parse file data
      const parsedData = await parseFileData(file);
      
      setUploadProgress(prev => ({ ...prev, [fileId]: 80 }));

      // Save to database
      const { data, error } = await supabase
        .from('project_files')
        .insert({
          project_id: projectId,
          filename: generateUniqueFilename(file.name),
          original_filename: file.name,
          file_size: file.size,
          mime_type: file.type,
          storage_path: storagePath,
          parsed_data: parsedData,
          column_mapping: {}
        })
        .select()
        .single();

      if (error) throw error;

      setUploadProgress(prev => ({ ...prev, [fileId]: 100 }));
      setProcessingStatus(prev => ({ ...prev, [fileId]: 'completed' }));

      const result: FileUploadResult = {
        id: data.id,
        filename: data.filename,
        originalFilename: data.original_filename,
        fileSize: data.file_size,
        mimeType: data.mime_type,
        storagePath: data.storage_path,
        parsedData: data.parsed_data,
        columnMapping: data.column_mapping
      };

      return result;
    } catch (error) {
      console.error('File processing failed:', error);
      setProcessingStatus(prev => ({ ...prev, [fileId]: 'error' }));
      toast({
        title: "File Processing Failed",
        description: `Failed to process ${file.name}: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      });
      return null;
    }
  }, [user, uploadToStorage, parseFileData, generateUniqueFilename, toast]);

  const uploadFiles = useCallback(async (
    files: File[],
    projectId: string
  ): Promise<FileUploadResult[]> => {
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to upload files.",
        variant: "destructive",
      });
      return [];
    }

    setIsUploading(true);
    const results: FileUploadResult[] = [];

    try {
      // Process files sequentially to avoid overwhelming the system
      for (const file of files) {
        const fileId = `${file.name}_${Date.now()}`;
        
        toast({
          title: "📁 Processing File",
          description: `Processing ${file.name}...`,
        });

        const result = await processFile(file, projectId, fileId);
        if (result) {
          results.push(result);
          setUploadedFiles(prev => [...prev, result]);
        }
      }

      if (results.length > 0) {
        toast({
          title: "✅ Files Processed",
          description: `Successfully processed ${results.length} file(s).`,
        });
      }

      return results;
    } catch (error) {
      console.error('Batch upload failed:', error);
      toast({
        title: "Upload Failed",
        description: error instanceof Error ? error.message : 'Unknown error occurred',
        variant: "destructive",
      });
      return results;
    } finally {
      setIsUploading(false);
      // Clear progress after a delay
      setTimeout(() => {
        setUploadProgress({});
        setProcessingStatus({});
      }, 3000);
    }
  }, [user, processFile, toast]);

  const removeFile = useCallback(async (fileId: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('project_files')
        .delete()
        .eq('id', fileId);

      if (error) throw error;

      setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
      
      toast({
        title: "File Removed",
        description: "File has been removed from the project.",
      });

      return true;
    } catch (error) {
      console.error('Failed to remove file:', error);
      toast({
        title: "Removal Failed",
        description: "Failed to remove the file.",
        variant: "destructive",
      });
      return false;
    }
  }, [toast]);

  const clearAll = useCallback(() => {
    setUploadedFiles([]);
    setUploadProgress({});
    setProcessingStatus({});
    uploadQueue.current = [];
  }, []);

  const getFilesByProject = useCallback(async (projectId: string): Promise<FileUploadResult[]> => {
    try {
      const { data, error } = await supabase
        .from('project_files')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const files: FileUploadResult[] = data.map(file => ({
        id: file.id,
        filename: file.filename,
        originalFilename: file.original_filename,
        fileSize: file.file_size,
        mimeType: file.mime_type,
        storagePath: file.storage_path,
        parsedData: file.parsed_data,
        columnMapping: file.column_mapping
      }));

      return files;
    } catch (error) {
      console.error('Failed to fetch project files:', error);
      return [];
    }
  }, []);

  return {
    // State
    uploadProgress,
    processingStatus,
    uploadedFiles,
    isUploading,

    // Actions
    uploadFiles,
    removeFile,
    clearAll,
    getFilesByProject,
    
    // Utilities
    setUploadedFiles,
  };
};

export default useFileUploadManager;