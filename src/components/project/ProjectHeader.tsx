
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, PlusCircle } from 'lucide-react';

interface ProjectHeaderProps {
  isContinueCase?: boolean;
}

const ProjectHeader: React.FC<ProjectHeaderProps> = ({ isContinueCase = false }) => {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-4 mb-6">
        <Link to="/" className="flex items-center gap-2 text-gray-600 hover:text-gray-800">
          <ArrowLeft className="w-4 h-4" />
          Back to Explorer
        </Link>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
          <PlusCircle className="w-8 h-8 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            {isContinueCase ? 'Continue Case' : 'Start New Project'}
          </h1>
          <p className="text-gray-600">
            {isContinueCase 
              ? 'Resume your data investigation case'
              : 'Create a new data investigation case'
            }
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProjectHeader;
