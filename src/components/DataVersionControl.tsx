
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { GitBranch, Save, Rewind, Clock, Tag, FileText, Download, Upload } from 'lucide-react';
import { type ParsedData } from '../utils/dataParser';

interface DataVersion {
  id: string;
  version: string;
  description: string;
  timestamp: Date;
  author: string;
  changes: string[];
  dataSnapshot: ParsedData;
  tags: string[];
}

interface DataVersionControlProps {
  currentData: ParsedData;
  onDataRestore: (data: ParsedData) => void;
}

const DataVersionControl: React.FC<DataVersionControlProps> = ({
  currentData,
  onDataRestore
}) => {
  const [versions, setVersions] = useState<DataVersion[]>([]);
  const [versionDescription, setVersionDescription] = useState('');
  const [versionTag, setVersionTag] = useState('');
  const [selectedVersion, setSelectedVersion] = useState<DataVersion | null>(null);
  const { toast } = useToast();

  // Load versions from localStorage on component mount
  useEffect(() => {
    const savedVersions = localStorage.getItem('dataVersions');
    if (savedVersions) {
      try {
        const parsedVersions = JSON.parse(savedVersions).map((v: any) => ({
          ...v,
          timestamp: new Date(v.timestamp)
        }));
        setVersions(parsedVersions);
      } catch (error) {
        console.error('Error loading versions:', error);
      }
    }
  }, []);

  // Save versions to localStorage whenever versions change
  useEffect(() => {
    localStorage.setItem('dataVersions', JSON.stringify(versions));
  }, [versions]);

  const saveVersion = () => {
    if (!versionDescription.trim()) {
      toast({
        title: "Description Required",
        description: "Please provide a description for this version.",
        variant: "destructive"
      });
      return;
    }

    const newVersion: DataVersion = {
      id: Date.now().toString(),
      version: `v${versions.length + 1}.0`,
      description: versionDescription,
      timestamp: new Date(),
      author: 'Current User', // In real app, get from auth
      changes: detectChanges(versions.length > 0 ? versions[0].dataSnapshot : null, currentData),
      dataSnapshot: JSON.parse(JSON.stringify(currentData)), // Deep clone
      tags: versionTag ? [versionTag] : []
    };

    setVersions(prev => [newVersion, ...prev]);
    setVersionDescription('');
    setVersionTag('');

    toast({
      title: "Version Saved",
      description: `Version ${newVersion.version} has been saved successfully.`,
    });
  };

  const restoreVersion = (version: DataVersion) => {
    onDataRestore(version.dataSnapshot);
    toast({
      title: "Version Restored",
      description: `Restored data to version ${version.version}.`,
    });
  };

  const detectChanges = (previousData: ParsedData | null, currentData: ParsedData): string[] => {
    const changes: string[] = [];

    if (!previousData) {
      changes.push('Initial data version');
      return changes;
    }

    // Check row count changes
    if (previousData.summary.totalRows !== currentData.summary.totalRows) {
      const diff = currentData.summary.totalRows - previousData.summary.totalRows;
      changes.push(`Rows: ${diff > 0 ? '+' : ''}${diff} (${currentData.summary.totalRows} total)`);
    }

    // Check column changes
    if (previousData.summary.totalColumns !== currentData.summary.totalColumns) {
      const diff = currentData.summary.totalColumns - previousData.summary.totalColumns;
      changes.push(`Columns: ${diff > 0 ? '+' : ''}${diff} (${currentData.summary.totalColumns} total)`);
    }

    // Check for new columns
    const previousColumnNames = previousData.columns.map(col => col.name);
    const currentColumnNames = currentData.columns.map(col => col.name);
    const newColumns = currentColumnNames.filter(name => !previousColumnNames.includes(name));
    const removedColumns = previousColumnNames.filter(name => !currentColumnNames.includes(name));

    newColumns.forEach(col => changes.push(`Added column: ${col}`));
    removedColumns.forEach(col => changes.push(`Removed column: ${col}`));

    if (changes.length === 0) {
      changes.push('Data transformations applied');
    }

    return changes;
  };

  const exportVersion = (version: DataVersion) => {
    const exportData = {
      version: version.version,
      description: version.description,
      timestamp: version.timestamp,
      data: version.dataSnapshot
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `data-version-${version.version}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast({
      title: "Version Exported",
      description: `Version ${version.version} has been exported successfully.`,
    });
  };

  const formatTimestamp = (timestamp: Date) => {
    return timestamp.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <GitBranch className="w-5 h-5 text-blue-500" />
          Data Version Control
        </h2>

        {/* Save New Version */}
        <div className="space-y-4 p-4 bg-gray-50 rounded-lg mb-6">
          <h3 className="font-medium">Save Current Version</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Description *</Label>
              <Textarea
                value={versionDescription}
                onChange={(e) => setVersionDescription(e.target.value)}
                placeholder="Describe the changes in this version..."
                className="min-h-20"
              />
            </div>
            <div>
              <Label>Tag (optional)</Label>
              <Input
                value={versionTag}
                onChange={(e) => setVersionTag(e.target.value)}
                placeholder="e.g., cleaned, transformed, final"
              />
            </div>
          </div>
          <Button onClick={saveVersion} className="flex items-center gap-2">
            <Save className="w-4 h-4" />
            Save Version
          </Button>
        </div>

        {/* Version History */}
        <div>
          <h3 className="font-medium mb-4 flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Version History ({versions.length})
          </h3>

          {versions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <GitBranch className="w-12 h-12 mx-auto mb-2 text-gray-300" />
              <p>No versions saved yet</p>
              <p className="text-sm">Save your first version to start tracking changes</p>
            </div>
          ) : (
            <div className="space-y-4">
              {versions.map(version => (
                <Card key={version.id} className="p-4 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="font-mono">
                          {version.version}
                        </Badge>
                        {version.tags.map(tag => (
                          <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                            <Tag className="w-3 h-3" />
                            {tag}
                          </Badge>
                        ))}
                        <span className="text-sm text-gray-500">
                          {formatTimestamp(version.timestamp)}
                        </span>
                      </div>
                      
                      <p className="text-sm text-gray-700 mb-2">{version.description}</p>
                      
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <span>{version.dataSnapshot.summary.totalRows} rows</span>
                        <span>{version.dataSnapshot.summary.totalColumns} columns</span>
                        <span>by {version.author}</span>
                      </div>

                      {version.changes.length > 0 && (
                        <div className="mt-2">
                          <details className="text-sm">
                            <summary className="cursor-pointer text-blue-600 hover:text-blue-800">
                              View Changes ({version.changes.length})
                            </summary>
                            <ul className="mt-2 space-y-1 ml-4">
                              {version.changes.map((change, index) => (
                                <li key={index} className="text-gray-600">• {change}</li>
                              ))}
                            </ul>
                          </details>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedVersion(version)}
                        className="flex items-center gap-1"
                      >
                        <FileText className="w-3 h-3" />
                        Details
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => exportVersion(version)}
                        className="flex items-center gap-1"
                      >
                        <Download className="w-3 h-3" />
                        Export
                      </Button>
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => restoreVersion(version)}
                        className="flex items-center gap-1"
                      >
                        <Rewind className="w-3 h-3" />
                        Restore
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </Card>

      {/* Version Details Modal */}
      {selectedVersion && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">
              Version {selectedVersion.version} Details
            </h3>
            <Button
              variant="ghost"
              onClick={() => setSelectedVersion(null)}
            >
              Close
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-2">Version Information</h4>
              <div className="space-y-2 text-sm">
                <div><strong>Version:</strong> {selectedVersion.version}</div>
                <div><strong>Created:</strong> {formatTimestamp(selectedVersion.timestamp)}</div>
                <div><strong>Author:</strong> {selectedVersion.author}</div>
                <div><strong>Description:</strong> {selectedVersion.description}</div>
              </div>
            </div>

            <div>
              <h4 className="font-medium mb-2">Data Summary</h4>
              <div className="space-y-2 text-sm">
                <div><strong>Rows:</strong> {selectedVersion.dataSnapshot.summary.totalRows.toLocaleString()}</div>
                <div><strong>Columns:</strong> {selectedVersion.dataSnapshot.summary.totalColumns}</div>
                <div><strong>Total Cells:</strong> {(selectedVersion.dataSnapshot.summary.totalRows * selectedVersion.dataSnapshot.summary.totalColumns).toLocaleString()}</div>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <h4 className="font-medium mb-2">Changes Made</h4>
            <ul className="space-y-1 text-sm">
              {selectedVersion.changes.map((change, index) => (
                <li key={index} className="text-gray-600">• {change}</li>
              ))}
            </ul>
          </div>
        </Card>
      )}
    </div>
  );
};

export default DataVersionControl;
