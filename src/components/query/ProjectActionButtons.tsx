
import React from 'react';
import { Button } from '@/components/ui/button';
import { Plus, History, Play } from 'lucide-react';

interface ProjectActionButtonsProps {
  onStartNewProject: () => void;
  onResumeProject: () => void;
}

const ProjectActionButtons: React.FC<ProjectActionButtonsProps> = ({
  onStartNewProject,
  onResumeProject
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
      <div className="p-6 bg-gradient-to-br from-green-50 to-blue-50 border-green-200 hover:shadow-lg transition-shadow cursor-pointer rounded-lg border" onClick={onStartNewProject}>
        <div className="flex items-center gap-4">
          <div className="p-3 bg-green-500 rounded-full">
            <Plus className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-lg text-gray-800">Start New Project</h3>
            <p className="text-gray-600">Upload new data and begin fresh analysis</p>
          </div>
        </div>
      </div>

      <div className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200 hover:shadow-lg transition-shadow cursor-pointer rounded-lg border" onClick={onResumeProject}>
        <div className="flex items-center gap-4">
          <div className="p-3 bg-purple-500 rounded-full">
            <Play className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-lg text-gray-800">Resume Project</h3>
            <p className="text-gray-600">Continue working on saved datasets</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectActionButtons;
