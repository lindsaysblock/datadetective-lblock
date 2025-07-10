
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Plus, History } from 'lucide-react';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import DashboardTabs from './DashboardTabs';
import DashboardHeader from './DashboardHeader';
import TabContentRenderer from './TabContentRenderer';
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
      {/* Updated Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Link to="/" className="flex items-center gap-2">
                <DataDetectiveLogo size="sm" showText={true} />
              </Link>
            </div>

            <div className="text-center flex-1 mx-8">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
                📊 Data Analysis Dashboard
              </h1>
              <p className="text-gray-600 text-lg">
                Analyzing Dashboard Data • {data.summary.totalRows.toLocaleString()} rows • {data.summary.totalColumns} columns
              </p>
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
      
      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
          <DashboardTabs 
            activeTab={activeTab}
            onTabChange={onTabChange}
          />
          
          <TabContentRenderer
            activeTab={activeTab}
            data={data}
            findings={findings}
            recommendations={recommendations}
          />
        </Tabs>
      </div>
    </div>
  );
};

export default DashboardView;
