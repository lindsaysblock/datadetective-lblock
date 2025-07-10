
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import Papa from 'papaparse';

export const useFileUpload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [parsing, setParsing] = useState(false);
  const [parsedData, setParsedData] = useState<any>(null);
  const { toast } = useToast();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    setFile(selectedFile);
  };

  const handleFileUpload = async () => {
    if (!file) {
      toast({
        title: "Error",
        description: "Please select a file to upload.",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);
    setParsing(true);

    try {
      const fileExtension = file.name.split('.').pop()?.toLowerCase();

      if (fileExtension === 'csv') {
        Papa.parse(file, {
          header: true,
          dynamicTyping: true,
          complete: async (results) => {
            setParsedData({
              columns: results.meta.fields || [],
              rows: results.data,
              summary: {}
            });
            setParsing(false);
          },
          error: (error) => {
            console.error("CSV Parsing Error:", error);
            toast({
              title: "Parsing Error",
              description: "Failed to parse CSV file.",
              variant: "destructive",
            });
            setParsing(false);
            setUploading(false);
          }
        });
      } else if (fileExtension === 'json') {
        const reader = new FileReader();
        reader.onload = async (e) => {
          try {
            const jsonData = JSON.parse(e.target?.result as string);
            const columns = Object.keys(jsonData[0] || {});

            setParsedData({
              columns: columns,
              rows: jsonData,
              summary: {}
            });
            setParsing(false);
          } catch (error) {
            console.error("JSON Parsing Error:", error);
            toast({
              title: "Parsing Error",
              description: "Failed to parse JSON file.",
              variant: "destructive",
            });
            setParsing(false);
            setUploading(false);
          }
        };
        reader.readAsText(file);
      } else {
        toast({
          title: "Unsupported File Type",
          description: "Only CSV and JSON files are supported.",
          variant: "destructive",
        });
        setParsing(false);
        setUploading(false);
      }
    } catch (error: any) {
      console.error("File Upload Error:", error);
      toast({
        title: "Upload Error",
        description: error.message || "Failed to upload file.",
        variant: "destructive",
      });
      setParsing(false);
      setUploading(false);
    } finally {
      setUploading(false);
    }
  };

  return {
    file,
    uploading,
    parsing,
    parsedData,
    handleFileChange,
    handleFileUpload
  };
};
