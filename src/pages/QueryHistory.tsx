import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  History, 
  Calendar, 
  Database, 
  Edit3, 
  Trash2, 
  Search,
  ArrowLeft,
  Plus,
  FileText,
  Clock,
  Check,
  X
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Separator } from '@/components/ui/separator';

interface Dataset {
  name: string;
  type: 'file' | 'database' | 'api';
  rows: number;
}

interface Project {
  id: string;
  name: string;
  initialQuestion: string;
  startDate: Date;
  lastUsed: Date;
  datasets: Dataset[];
  queryCount: number;
  status: string;
}

const QueryHistory = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [editingProject, setEditingProject] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editingStatus, setEditingStatus] = useState<string | null>(null);
  const [editStatusValue, setEditStatusValue] = useState('');

  // Mock data - in real app this would come from a database/state management
  const [projects, setProjects] = useState<Project[]>([
    {
      id: '1',
      name: 'User Behavior Analysis Q4',
      initialQuestion: 'What are the most common user behaviors on our platform?',
      startDate: new Date('2024-01-15'),
      lastUsed: new Date('2024-01-20'),
      datasets: [
        { name: 'user_events.csv', type: 'file', rows: 15420 },
        { name: 'session_data.json', type: 'file', rows: 8934 }
      ],
      queryCount: 23,
      status: 'active'
    },
    {
      id: '2',
      name: 'Sales Performance Review',
      initialQuestion: 'How has our sales performance changed over the last quarter?',
      startDate: new Date('2024-01-10'),
      lastUsed: new Date('2024-01-18'),
      datasets: [
        { name: 'sales_transactions', type: 'database', rows: 45230 }
      ],
      queryCount: 15,
      status: 'completed'
    },
    {
      id: '3',
      name: 'Customer Segmentation Study',
      initialQuestion: 'Can we identify distinct customer segments based on purchase behavior?',
      startDate: new Date('2024-01-05'),
      lastUsed: new Date('2024-01-12'),
      datasets: [
        { name: 'customer_profiles.csv', type: 'file', rows: 12450 },
        { name: 'purchase_history.csv', type: 'file', rows: 89340 }
      ],
      queryCount: 31,
      status: 'paused'
    }
  ]);

  const filteredProjects = projects
    .filter(project => 
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.initialQuestion.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => b.lastUsed.getTime() - a.lastUsed.getTime());

  const handleRename = (projectId: string, newName: string) => {
    setProjects(prev => prev.map(project => 
      project.id === projectId ? { ...project, name: newName } : project
    ));
    setEditingProject(null);
    setEditName('');
  };

  const handleStatusUpdate = (projectId: string, newStatus: string) => {
    setProjects(prev => prev.map(project => 
      project.id === projectId ? { ...project, status: newStatus } : project
    ));
    setEditingStatus(null);
    setEditStatusValue('');
  };

  const handleDelete = (projectId: string) => {
    setProjects(prev => prev.filter(project => project.id !== projectId));
  };

  const startEditing = (project: Project) => {
    setEditingProject(project.id);
    setEditName(project.name);
  };

  const startEditingStatus = (project: Project) => {
    setEditingStatus(project.id);
    setEditStatusValue(project.status);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active': return 'bg-green-100 text-green-700';
      case 'completed': return 'bg-blue-100 text-blue-700';
      case 'paused': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getDatasetIcon = (type: string) => {
    switch (type) {
      case 'file': return FileText;
      case 'database': return Database;
      case 'api': return Clock;
      default: return FileText;
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="outline" className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Explorer
              </Button>
            </Link>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl shadow-lg">
                <History className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  Query History
                </h1>
                <p className="text-blue-600 text-lg">Manage your data exploration projects</p>
              </div>
            </div>
          </div>
          <Link to="/new-project">
            <Button className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600">
              <Plus className="w-4 h-4" />
              Start New Project
            </Button>
          </Link>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 border-blue-200 focus:border-blue-400"
            />
          </div>
        </div>

        {/* Projects List */}
        <div className="space-y-6">
          {filteredProjects.length === 0 ? (
            <Card className="p-12 text-center border-blue-200">
              <div className="text-gray-500">
                <History className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">No projects found</h3>
                <p>Start a new data exploration project to see it here.</p>
              </div>
            </Card>
          ) : (
            filteredProjects.map((project) => (
              <Card key={project.id} className="border border-blue-200 hover:border-blue-300 transition-all duration-200 hover:shadow-md">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      {editingProject === project.id ? (
                        <div className="flex items-center gap-2 mb-2">
                          <Input
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            className="text-xl font-semibold border-blue-200"
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                handleRename(project.id, editName);
                              }
                            }}
                          />
                          <Button
                            size="sm"
                            onClick={() => handleRename(project.id, editName)}
                            className="bg-green-500 hover:bg-green-600"
                          >
                            Save
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setEditingProject(null)}
                          >
                            Cancel
                          </Button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-3 mb-2">
                          <CardTitle className="text-xl text-gray-800">{project.name}</CardTitle>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => startEditing(project)}
                            className="p-1 h-auto"
                          >
                            <Edit3 className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
                      <p className="text-gray-600 text-base leading-relaxed">{project.initialQuestion}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {editingStatus === project.id ? (
                        <div className="flex items-center gap-1">
                          <Input
                            value={editStatusValue}
                            onChange={(e) => setEditStatusValue(e.target.value)}
                            className="h-6 text-xs w-20"
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                handleStatusUpdate(project.id, editStatusValue);
                              }
                            }}
                          />
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleStatusUpdate(project.id, editStatusValue)}
                            className="p-1 h-6"
                          >
                            <Check className="w-3 h-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => setEditingStatus(null)}
                            className="p-1 h-6"
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      ) : (
                        <Badge 
                          className={`${getStatusColor(project.status)} cursor-pointer hover:opacity-80`}
                          onClick={() => startEditingStatus(project)}
                        >
                          {project.status}
                        </Badge>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(project.id)}
                        className="p-1 h-auto text-red-500 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="pt-0">
                  {/* Project Metadata */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>Started: {formatDate(project.startDate)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Clock className="w-4 h-4" />
                      <span>Last used: {formatDate(project.lastUsed)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Search className="w-4 h-4" />
                      <span>{project.queryCount} queries</span>
                    </div>
                  </div>

                  <Separator className="my-4" />

                  {/* Datasets */}
                  <div>
                    <h4 className="font-medium text-gray-800 mb-3 flex items-center gap-2">
                      <Database className="w-4 h-4" />
                      Datasets ({project.datasets.length})
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {project.datasets.map((dataset, index) => {
                        const IconComponent = getDatasetIcon(dataset.type);
                        return (
                          <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                            <div className="p-2 bg-white rounded-lg">
                              <IconComponent className="w-4 h-4 text-blue-600" />
                            </div>
                            <div className="flex-1">
                              <p className="font-medium text-gray-800 text-sm">{dataset.name}</p>
                              <p className="text-xs text-gray-600">{dataset.rows.toLocaleString()} rows</p>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {dataset.type}
                            </Badge>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <Link to={`/?project=${project.id}`}>
                      <Button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                        Continue Exploration
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default QueryHistory;
