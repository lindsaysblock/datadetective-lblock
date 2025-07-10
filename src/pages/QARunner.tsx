
import React from 'react';
import QATrigger from '../components/QATrigger';
import QARunner from '../components/QARunner';
import Header from '@/components/Header';
import { useAuthState } from '@/hooks/useAuthState';

const QARunnerPage: React.FC = () => {
  const { user, handleUserChange } = useAuthState();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <Header user={user} onUserChange={handleUserChange} />
      
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            QA Analysis Running
          </h1>
          <p className="text-gray-600 mt-2">
            Comprehensive quality assurance analysis with auto-fix and auto-refactoring is in progress...
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
              <span className="text-lg font-medium">Analyzing System Quality...</span>
            </div>
            
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Running component tests with form persistence integration</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span>Analyzing data flow and 4-step user journey</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                <span>Evaluating performance metrics and system efficiency</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                <span>Running load tests and unit test suites</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                <span>Applying auto-fixes and generating refactoring recommendations</span>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-blue-50 rounded border border-blue-200">
              <p className="text-sm text-blue-800">
                <strong>Note:</strong> Check the browser console for detailed real-time QA progress and results.
                The analysis includes comprehensive testing of all system components, performance optimization,
                and automatic code quality improvements.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Background QA components */}
      <QARunner />
      <QATrigger />
    </div>
  );
};

export default QARunnerPage;
