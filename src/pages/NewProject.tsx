import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ArrowLeft, ArrowRight, Upload, Database, Globe, FileText, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import { useAuthState } from '@/hooks/useAuthState';

interface Dataset {
  name: string;
  type: 'file' | 'database' | 'api';
  file?: File | null;
  url?: string;
}

const NewProject = () => {
  const { user, handleUserChange } = useAuthState();
  const [step, setStep] = useState(1);
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [newDataset, setNewDataset] = useState<Dataset>({ name: '', type: 'file' });
  const [file, setFile] = useState<File | null>(null);
  const [url, setUrl] = useState('');

  const nextStep = () => setStep(prev => prev + 1);
  const prevStep = () => setStep(prev => prev - 1);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setNewDataset(prev => ({ ...prev, name: selectedFile.name, file: selectedFile }));
    }
  };

  const handleUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(event.target.value);
    setNewDataset(prev => ({ ...prev, name: 'API Data', type: 'api', url: event.target.value }));
  };

  const addDataset = () => {
    if (newDataset.name && (newDataset.file || newDataset.url)) {
      setDatasets(prev => [...prev, newDataset]);
      setNewDataset({ name: '', type: 'file' });
      setFile(null);
      setUrl('');
    }
  };

  const removeDataset = (index: number) => {
    const updatedDatasets = [...datasets];
    updatedDatasets.splice(index, 1);
    setDatasets(updatedDatasets);
  };

  const handleSubmit = () => {
    // Handle project submission logic here
    console.log('Project Name:', projectName);
    console.log('Project Description:', projectDescription);
    console.log('Datasets:', datasets);
    // You would typically send this data to your backend
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Header user={user} onUserChange={handleUserChange} />
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link to="/">
            <Button variant="outline" className="flex items-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Button>
          </Link>
          <div className="text-center flex-1 mx-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Start New Project
            </h1>
            <p className="text-blue-600 text-lg">Let's explore your data together</p>
          </div>
          <div className="w-24"></div> {/* Spacer for balance */}
        </div>

        {/* Stepper */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className={`flex items-center gap-2 ${step > 1 ? 'text-blue-600' : 'text-gray-400'}`}>
              {step > 1 ? <CheckCircle2 className="w-5 h-5" /> : <div className="w-5 h-5 rounded-full border border-gray-400"></div>}
              Project Details
            </div>
            <div className={`flex items-center gap-2 ${step > 2 ? 'text-blue-600' : 'text-gray-400'}`}>
              {step > 2 ? <CheckCircle2 className="w-5 h-5" /> : <div className="w-5 h-5 rounded-full border border-gray-400"></div>}
              Add Datasets
            </div>
            <div className="flex items-center gap-2 text-gray-400">
              <div className="w-5 h-5 rounded-full border border-gray-400"></div>
              Review & Submit
            </div>
          </div>
          <div className="h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mt-2" style={{ width: `${(step - 1) * 50}%` }}></div>
        </div>

        {/* Forms */}
        {step === 1 && (
          <Card>
            <CardHeader>
              <CardTitle>Project Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Project Name</Label>
                <Input
                  id="name"
                  placeholder="Enter project name"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                />
              </div>
              <div>
                <Label htmlFor="description">Project Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe your project"
                  value={projectDescription}
                  onChange={(e) => setProjectDescription(e.target.value)}
                />
              </div>
              <div className="flex justify-end">
                <Button onClick={nextStep}>
                  Next <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {step === 2 && (
          <Card>
            <CardHeader>
              <CardTitle>Add Datasets</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Upload Dataset */}
              <div>
                <Label htmlFor="upload">Upload File</Label>
                <div className="flex items-center space-x-4">
                  <Input
                    type="file"
                    id="upload"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  <Label htmlFor="upload" className="cursor-pointer bg-blue-100 text-blue-600 px-4 py-2 rounded-md hover:bg-blue-200">
                    <Upload className="w-4 h-4 mr-2 inline-block" />
                    Choose File
                  </Label>
                  {file && <span className="text-gray-600">{file.name}</span>}
                </div>
              </div>

              {/* Connect to Database */}
              <div>
                <Label htmlFor="database">Connect to Database</Label>
                <Input
                  id="database"
                  placeholder="Enter database connection string"
                  disabled
                />
                <p className="text-gray-500 text-sm mt-1">Coming Soon</p>
              </div>

              {/* Connect to API */}
              <div>
                <Label htmlFor="api">Connect to API</Label>
                <div className="flex items-center space-x-4">
                  <Input
                    type="url"
                    id="api"
                    placeholder="Enter API endpoint URL"
                    value={url}
                    onChange={handleUrlChange}
                  />
                </div>
              </div>

              <Button onClick={addDataset} className="mt-4">Add Dataset</Button>

              {/* Datasets List */}
              {datasets.length > 0 && (
                <div className="mt-6">
                  <h3 className="text-xl font-semibold mb-4">Datasets</h3>
                  <ul>
                    {datasets.map((dataset, index) => (
                      <li key={index} className="flex items-center justify-between bg-gray-50 p-4 rounded-md mb-2">
                        <div className="flex items-center gap-3">
                          {dataset.type === 'file' && <FileText className="w-5 h-5 text-blue-500" />}
                          {dataset.type === 'database' && <Database className="w-5 h-5 text-blue-500" />}
                          {dataset.type === 'api' && <Globe className="w-5 h-5 text-blue-500" />}
                          <span>{dataset.name}</span>
                        </div>
                        <Button variant="ghost" size="sm" onClick={() => removeDataset(index)} className="text-red-500">
                          Remove
                        </Button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex justify-between mt-8">
                <Button variant="outline" onClick={prevStep}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Previous
                </Button>
                <Button onClick={nextStep}>
                  Next <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {step === 3 && (
          <Card>
            <CardHeader>
              <CardTitle>Review & Submit</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold mb-2">Project Details</h3>
                <p><strong>Name:</strong> {projectName}</p>
                <p><strong>Description:</strong> {projectDescription}</p>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-2">Datasets</h3>
                <ul>
                  {datasets.map((dataset, index) => (
                    <li key={index} className="flex items-center gap-3">
                      {dataset.type === 'file' && <FileText className="w-5 h-5 text-blue-500" />}
                      {dataset.type === 'database' && <Database className="w-5 h-5 text-blue-500" />}
                      {dataset.type === 'api' && <Globe className="w-5 h-5 text-blue-500" />}
                      <span>{dataset.name}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex justify-between mt-8">
                <Button variant="outline" onClick={prevStep}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Previous
                </Button>
                <Button onClick={handleSubmit}>Submit</Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default NewProject;
