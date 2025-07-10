import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Sparkles, Upload, FileText, Database, Globe, CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useDatasetPersistence } from '@/hooks/useDatasetPersistence';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Papa from 'papaparse';
import Header from '@/components/Header';
import { useAuthState } from '@/hooks/useAuthState';

interface DashboardTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const DashboardTabs: React.FC<DashboardTabsProps> = ({ activeTab, setActiveTab }) => {
  return (
    <div className="flex items-center space-x-4">
      <Button
        variant={activeTab === 'dataExploration' ? 'default' : 'outline'}
        onClick={() => setActiveTab('dataExploration')}
      >
        <Sparkles className="w-4 h-4 mr-2" />
        Data Exploration
      </Button>
      <Button
        variant={activeTab === 'myDatasets' ? 'default' : 'outline'}
        onClick={() => setActiveTab('myDatasets')}
      >
        <Database className="w-4 h-4 mr-2" />
        My Datasets
      </Button>
    </div>
  );
};

const Index = () => {
  const { user, loading, handleUserChange } = useAuthState();
  const [activeTab, setActiveTab] = useState('dataExploration');
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [parsing, setParsing] = useState(false);
  const [parsedData, setParsedData] = useState<any>(null);
  const [initialQuestion, setInitialQuestion] = useState('');
  const { toast } = useToast();
  const { datasets, saveDataset, loading: datasetsLoading, refreshDatasets } = useDatasetPersistence();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get('project');

  useEffect(() => {
    if (projectId) {
      toast({
        title: "Project Loaded",
        description: `Project ID: ${projectId} loaded. Start exploring!`,
      });
    }
  }, [projectId, toast]);

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
              summary: {} // Placeholder for summary stats
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
              summary: {} // Placeholder for summary stats
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

  const handleSaveDataset = async () => {
    if (!parsedData || !file) {
      toast({
        title: "Error",
        description: "No data to save. Please upload a file and ensure it's parsed correctly.",
        variant: "destructive",
      });
      return;
    }

    try {
      const datasetId = await saveDataset(file.name, parsedData);
      
      toast({
        title: "Dataset Saved",
        description: `${file.name} has been saved.`,
      });

      // Optionally, navigate to the QA Runner with the new dataset
      navigate(`/?dataset=${datasetId}`);
    } catch (error: any) {
      console.error("Save Dataset Error:", error);
      toast({
        title: "Save Error",
        description: error.message || "Failed to save dataset.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <Header user={user} onUserChange={handleUserChange} />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header user={user} onUserChange={handleUserChange} />
      
      <div className="container mx-auto px-4 py-8">
        {!user ? (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Welcome to Data Detective</h2>
              <p className="text-gray-600 mb-6">Sign in to start exploring and analyzing your data.</p>
              <Button onClick={() => navigate('/auth')}>Sign In</Button>
            </div>
          </div>
        ) : (
          <>
            <Card className="mb-8 border-blue-300">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl font-bold">Data Exploration</CardTitle>
                  <DashboardTabs activeTab={activeTab} setActiveTab={setActiveTab} />
                </div>
                <CardDescription className="text-gray-600">
                  {activeTab === 'dataExploration'
                    ? 'Upload a file to explore its contents and ask questions.'
                    : 'View and manage your uploaded datasets.'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {activeTab === 'dataExploration' ? (
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      <Input
                        type="file"
                        id="upload"
                        className="hidden"
                        onChange={handleFileChange}
                      />
                      <Label htmlFor="upload" className="cursor-pointer bg-blue-100 text-blue-700 rounded-md py-2 px-4 hover:bg-blue-200 transition-colors duration-200">
                        <Upload className="w-4 h-4 mr-2 inline-block" />
                        {file ? file.name : 'Upload a file'}
                      </Label>
                      <Button onClick={handleFileUpload} disabled={uploading || parsing}>
                        {uploading ? 'Uploading...' : 'Upload'}
                      </Button>
                    </div>

                    {parsing && (
                      <div className="text-blue-600 flex items-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mr-2"></div>
                        Parsing data...
                      </div>
                    )}

                    {parsedData && (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Card>
                            <CardHeader>
                              <CardTitle>Columns</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <ul className="list-disc pl-5">
                                {parsedData.columns.map((column: string, index: number) => (
                                  <li key={index}>{column}</li>
                                ))}
                              </ul>
                            </CardContent>
                          </Card>

                          <Card>
                            <CardHeader>
                              <CardTitle>Sample Data</CardTitle>
                            </CardHeader>
                            <CardContent>
                              {parsedData.rows.length > 0 ? (
                                <div className="overflow-x-auto">
                                  <table className="min-w-full">
                                    <thead>
                                      <tr>
                                        {parsedData.columns.map((column: string, index: number) => (
                                          <th key={index} className="text-left font-medium text-gray-700 py-2 px-3 border-b">
                                            {column}
                                          </th>
                                        ))}
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {parsedData.rows.slice(0, 5).map((row: any, rowIndex: number) => (
                                        <tr key={rowIndex}>
                                          {parsedData.columns.map((column: string, colIndex: number) => (
                                            <td key={colIndex} className="py-2 px-3 border-b text-sm text-gray-500">
                                              {typeof row[column] === 'object' ? JSON.stringify(row[column]) : String(row[column])}
                                            </td>
                                          ))}
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              ) : (
                                <p className="text-gray-500">No data to display.</p>
                              )}
                            </CardContent>
                          </Card>
                        </div>

                        <Separator />

                        <div className="flex justify-between items-center">
                          <div>
                            <Label htmlFor="initialQuestion" className="block text-sm font-medium text-gray-700">
                              Initial Question
                            </Label>
                            <Input
                              type="text"
                              id="initialQuestion"
                              placeholder="What do you want to know about this data?"
                              className="mt-1"
                              value={initialQuestion}
                              onChange={(e) => setInitialQuestion(e.target.value)}
                            />
                          </div>
                          <Button onClick={handleSaveDataset}>
                            <CheckCircle2 className="w-4 h-4 mr-2" />
                            Save Dataset
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div>
                    {datasetsLoading ? (
                      <div className="text-blue-600 flex items-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mr-2"></div>
                        Loading datasets...
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {datasets.length === 0 ? (
                          <div className="col-span-full text-center py-12">
                            <AlertTriangle className="w-10 h-10 text-gray-400 mx-auto mb-4" />
                            <p className="text-gray-500">No datasets uploaded yet.</p>
                          </div>
                        ) : (
                          datasets.map((dataset) => (
                            <Card key={dataset.id} className="border-blue-200">
                              <CardHeader>
                                <CardTitle className="text-lg font-semibold">{dataset.name}</CardTitle>
                                <CardDescription className="text-gray-500">
                                  Uploaded on {new Date(dataset.created_at).toLocaleDateString()}
                                </CardDescription>
                              </CardHeader>
                              <CardContent>
                                <div className="flex items-center space-x-2 text-sm text-gray-600">
                                  <FileText className="w-4 h-4" />
                                  <span>{dataset.original_filename}</span>
                                </div>
                                <div className="flex justify-end mt-4">
                                  <Button
                                    variant="outline"
                                    onClick={() => navigate(`/?dataset=${dataset.id}`)}
                                  >
                                    Explore
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>
    </div>
  );
};

export default Index;
