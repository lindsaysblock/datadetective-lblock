
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown } from 'lucide-react';

interface ProjectContextCardProps {
  researchQuestion: string;
  dataSource: string;
  additionalContext: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const ProjectContextCard: React.FC<ProjectContextCardProps> = ({
  researchQuestion,
  dataSource,
  additionalContext,
  isOpen,
  onOpenChange
}) => {
  return (
    <Collapsible open={isOpen} onOpenChange={onOpenChange}>
      <Card>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-gray-50 transition-colors">
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl">Project Context</CardTitle>
              <ChevronDown className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </div>
          </CardHeader>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Research Question</h3>
              <p className="text-gray-700 bg-blue-50 p-3 rounded-lg">{researchQuestion}</p>
            </div>
            
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Data Source</h3>
              <p className="text-gray-700 bg-green-50 p-3 rounded-lg">{dataSource}</p>
            </div>

            {additionalContext && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Business Context</h3>
                <p className="text-gray-700 bg-purple-50 p-3 rounded-lg">{additionalContext}</p>
              </div>
            )}
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
};

export default ProjectContextCard;
