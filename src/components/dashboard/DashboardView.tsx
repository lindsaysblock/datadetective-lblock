
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Plus, History, Clock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import DataDetectiveLogo from '../DataDetectiveLogo';
import HelpMenu from '../HelpMenu';
import { ParsedData } from '@/utils/dataParser';

interface DashboardViewProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  data: ParsedData;
  findings: any[];
  recommendations: any[];
}

const DashboardView: React.FC<DashboardViewProps> = ({
  activeTab,
  onTabChange,
  data,
  findings,
  recommendations
}) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Link to="/" className="flex items-center gap-2">
                <DataDetectiveLogo size="sm" showText={true} />
              </Link>
            </div>

            <div className="flex items-center gap-3">
              <Link to="/new-project">
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  New Project
                </Button>
              </Link>
              
              <Link to="/query-history">
                <Button variant="ghost" size="sm" className="flex items-center gap-2">
                  <History className="w-4 h-4" />
                  Projects
                </Button>
              </Link>

              <HelpMenu />
              
              <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
                Sign In / Sign Up
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          {/* Welcome Message */}
          <div className="mb-12">
            <h1 className="text-5xl font-bold text-gray-800 mb-4">
              Welcome Back, Detective!
            </h1>
            <p className="text-xl text-gray-600">
              What would you like to investigate today?
            </p>
          </div>

          {/* Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {/* Start New Project Card */}
            <Link to="/new-project">
              <Card className="bg-white/80 backdrop-blur-sm border-green-200 hover:border-green-300 transition-all duration-200 hover:shadow-lg cursor-pointer h-full">
                <CardHeader className="text-center pb-4">
                  <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Plus className="w-8 h-8 text-white" strokeWidth={2.5} />
                  </div>
                  <CardTitle className="text-2xl text-gray-800">Start New Project</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <CardDescription className="text-lg text-gray-600">
                    Upload fresh data and begin a new investigation
                  </CardDescription>
                </CardContent>
              </Card>
            </Link>

            {/* Continue Existing Project Card */}
            <Link to="/query-history">
              <Card className="bg-white/80 backdrop-blur-sm border-purple-200 hover:border-purple-300 transition-all duration-200 hover:shadow-lg cursor-pointer h-full">
                <CardHeader className="text-center pb-4">
                  <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Clock className="w-8 h-8 text-white" strokeWidth={2.5} />
                  </div>
                  <CardTitle className="text-2xl text-gray-800">Continue Existing Project</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <CardDescription className="text-lg text-gray-600">
                    Resume analysis on your saved datasets
                  </CardDescription>
                </CardContent>
              </Card>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardView;
