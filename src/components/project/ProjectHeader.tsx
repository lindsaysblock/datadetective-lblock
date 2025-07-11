
import React from 'react';

const ProjectHeader: React.FC = () => {
  console.log('ProjectHeader rendering');

  return (
    <div className="text-center mb-8">
      <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
        Start New Project
      </h1>
      <p className="text-lg bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
        Let's explore your data together
      </p>
    </div>
  );
};

export default ProjectHeader;
