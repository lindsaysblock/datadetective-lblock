
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const ProjectHeader: React.FC = () => {
  return (
    <div className="text-center mb-8">
      <Link to="/" className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-800 mb-4">
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </Link>
      <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">Start New Project</h1>
      <p className="text-lg bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Let's explore your data together</p>
    </div>
  );
};

export default ProjectHeader;
