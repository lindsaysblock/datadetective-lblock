
/**
 * Project Context Card Component
 * Refactored to meet coding standards with proper constants and semantic styling
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { ChevronDown } from 'lucide-react';
import { SPACING, TEXT_SIZES, ICON_SIZES } from '@/constants/ui';

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
          <CardHeader className="cursor-pointer hover:bg-muted transition-colors">
            <div className="flex items-center justify-between">
              <CardTitle className={TEXT_SIZES.LARGE}>Project Context</CardTitle>
              <ChevronDown className={`${ICON_SIZES.SM} transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </div>
          </CardHeader>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <CardContent className={`space-y-${SPACING.MD}`}>
            <div>
              <h3 className={`font-semibold text-foreground mb-${SPACING.SM}`}>Research Question</h3>
              <p className={`text-muted-foreground bg-primary/10 p-${SPACING.SM} rounded-lg`}>{researchQuestion}</p>
            </div>
            
            <div>
              <h3 className={`font-semibold text-foreground mb-${SPACING.SM}`}>Data Source</h3>
              <p className={`text-muted-foreground bg-success/10 p-${SPACING.SM} rounded-lg`}>{dataSource}</p>
            </div>

            {additionalContext && (
              <div>
                <h3 className={`font-semibold text-foreground mb-${SPACING.SM}`}>Business Context</h3>
                <p className={`text-muted-foreground bg-secondary/10 p-${SPACING.SM} rounded-lg`}>{additionalContext}</p>
              </div>
            )}
          </CardContent>
        </CollapsibleContent>
      </Card>
    </Collapsible>
  );
};

export default ProjectContextCard;
