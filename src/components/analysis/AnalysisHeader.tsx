
/**
 * Analysis Header Component
 * Refactored to meet coding standards with proper constants and semantic theming
 */

import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Plus, History } from 'lucide-react';
import { useAuthState } from '@/hooks/useAuthState';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import DataDetectiveLogo from '../DataDetectiveLogo';
import { SPACING } from '@/constants/ui';

interface AnalysisHeaderProps {
  projectName: string;
  onBackToProject: () => void;
  onNewProject: () => void;
  onProjectHistory: () => void;
}

const AnalysisHeader: React.FC<AnalysisHeaderProps> = ({
  projectName,
  onBackToProject,
  onNewProject,
  onProjectHistory
}) => {
  const { user } = useAuthState();

  return (
    <div className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className={`container mx-auto px-${SPACING.MD} py-${SPACING.MD}`}>
        <div className="flex items-center justify-between">
          {/* Left section with logo and back button */}
          <div className={`flex items-center gap-${SPACING.MD}`}>
            <DataDetectiveLogo size="sm" showText={true} />
            <Button variant="outline" onClick={onBackToProject} className={`flex items-center gap-${SPACING.SM}`}>
              <ArrowLeft className={`w-${SPACING.MD} h-${SPACING.MD}`} />
              Back to Projects
            </Button>
          </div>

          {/* Center section with project name */}
          <div className={`text-center flex-1 mx-${SPACING.XL}`}>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              {projectName}
            </h1>
            <p className="text-blue-600">Analysis Results</p>
          </div>

          {/* Right section with actions and user */}
          <div className={`flex items-center gap-${SPACING.SM}`}>
            <Button 
              variant="outline"
              onClick={onNewProject}
              className={`flex items-center gap-${SPACING.SM}`}
            >
              <Plus className={`w-${SPACING.MD} h-${SPACING.MD}`} />
              New Project
            </Button>
            
            <Button 
              variant="outline"
              onClick={onProjectHistory}
              className="flex items-center gap-2"
            >
              <History className="w-4 h-4" />
              Projects
            </Button>

            {user && (
              <div className="flex items-center gap-2 pl-2 border-l">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={user.user_metadata?.avatar_url} />
                  <AvatarFallback>
                    {user.email?.charAt(0).toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm text-gray-600">{user.email}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalysisHeader;
