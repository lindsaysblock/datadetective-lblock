
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
    if (selectedFile) {
      setFile(selectedFile);
      setParsedData(null); // Reset parsed data when new file is selected
    }
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
      const fileExtension = file.name?.split('.').pop()?.toLowerCase();

      if (fileExtension === 'csv' || file.type === 'text/csv' || file.type === 'application/vnd.ms-excel') {
        Papa.parse(file, {
          header: true,
          dynamicTyping: true,
          complete: async (results) => {
            setParsedData({
              columns: results.meta.fields || [],
              rows: results.data,
              summary: {
                totalRows: results.data.length,
                totalColumns: results.meta.fields?.length || 0
              }
            });
            setParsing(false);
            setUploading(false);
            
            toast({
              title: "Success",
              description: `File processed successfully! Found ${results.data.length} rows.`,
            });
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
      } else if (fileExtension === 'json' || file.type === 'application/json' || file.type === 'text/json') {
        const reader = new FileReader();
        reader.onload = async (e) => {
          try {
            const jsonData = JSON.parse(e.target?.result as string);
            const columns = Object.keys(jsonData[0] || {});

            setParsedData({
              columns: columns,
              rows: jsonData,
              summary: {
                totalRows: jsonData.length,
                totalColumns: columns.length
              }
            });
            setParsing(false);
            setUploading(false);
            
            toast({
              title: "Success",
              description: `File processed successfully! Found ${jsonData.length} rows.`,
            });
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
      } else if (fileExtension === 'txt' || file.type === 'text/plain' || file.type === 'text/txt') {
        const reader = new FileReader();
        reader.onload = async (e) => {
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
              
              setParsedData({
                columns: headers,
                rows: rows,
                summary: {
                  totalRows: rows.length,
                  totalColumns: headers.length
                }
              });
            } else {
              // Plain text
              const textData = lines.map((line, index) => ({ line_number: index + 1, content: line }));
              setParsedData({
                columns: ['line_number', 'content'],
                rows: textData,
                summary: {
                  totalRows: textData.length,
                  totalColumns: 2
                }
              });
            }
            
            setParsing(false);
            setUploading(false);
            
            toast({
              title: "Success",
              description: `File processed successfully! Found ${lines.length} lines.`,
            });
          } catch (error) {
            console.error("Text Parsing Error:", error);
            toast({
              title: "Parsing Error",
              description: "Failed to parse text file.",
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
          description: `File type .${fileExtension} is not supported. Please upload CSV, JSON, or TXT files.`,
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
