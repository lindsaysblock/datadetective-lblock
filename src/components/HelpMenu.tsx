
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle 
} from '@/components/ui/dialog';
import { HelpCircle, Book, MessageCircle, Video, FileText, Lightbulb } from 'lucide-react';

const HelpMenu: React.FC = () => {
  const [showGettingStarted, setShowGettingStarted] = useState(false);
  const [showTips, setShowTips] = useState(false);

  const openExternalLink = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="flex items-center gap-2">
            <HelpCircle className="w-4 h-4" />
            Help
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuItem onClick={() => setShowGettingStarted(true)}>
            <Book className="w-4 h-4 mr-2" />
            Getting Started
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={() => setShowTips(true)}>
            <Lightbulb className="w-4 h-4 mr-2" />
            Tips & Best Practices
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem onClick={() => openExternalLink('https://docs.datadetective.ai')}>
            <FileText className="w-4 h-4 mr-2" />
            Documentation
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={() => openExternalLink('https://www.youtube.com/@datadetective')}>
            <Video className="w-4 h-4 mr-2" />
            Video Tutorials
          </DropdownMenuItem>
          
          <DropdownMenuItem onClick={() => openExternalLink('https://support.datadetective.ai')}>
            <MessageCircle className="w-4 h-4 mr-2" />
            Contact Support
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Getting Started Dialog */}
      <Dialog open={showGettingStarted} onOpenChange={setShowGettingStarted}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Getting Started with Data Detective</DialogTitle>
            <DialogDescription>
              Follow these steps to get the most out of your data analysis
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <h3 className="font-semibold">1. Upload Your Data</h3>
                <p className="text-sm text-gray-600">
                  Upload CSV, JSON, or Excel files. For best results, ensure your data has clear column headers.
                </p>
              </div>
              <div className="space-y-3">
                <h3 className="font-semibold">2. Review Data Quality</h3>
                <p className="text-sm text-gray-600">
                  Check the automatically generated data quality report to understand your dataset.
                </p>
              </div>
              <div className="space-y-3">
                <h3 className="font-semibold">3. Explore Insights</h3>
                <p className="text-sm text-gray-600">
                  Navigate through different tabs to discover AI-generated insights and patterns.
                </p>
              </div>
              <div className="space-y-3">
                <h3 className="font-semibold">4. Create Visualizations</h3>
                <p className="text-sm text-gray-600">
                  Use the visualization tab to create charts and graphs that tell your data's story.
                </p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Tips Dialog */}
      <Dialog open={showTips} onOpenChange={setShowTips}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Tips & Best Practices</DialogTitle>
            <DialogDescription>
              Maximize your analysis effectiveness with these expert tips
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">📊 Data Preparation</h3>
                <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                  <li>Use descriptive column names</li>
                  <li>Remove or handle missing values appropriately</li>
                  <li>Ensure consistent date formats</li>
                  <li>Include metadata when possible</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">🔍 Analysis Tips</h3>
                <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                  <li>Start with the Business Insights tab for high-level findings</li>
                  <li>Use the Hypothesis tab to test specific questions</li>
                  <li>Document your observations in project notes</li>
                  <li>Cross-validate AI findings with domain knowledge</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">📈 Visualization Best Practices</h3>
                <ul className="text-sm text-gray-600 space-y-1 list-disc list-inside">
                  <li>Choose chart types that match your data story</li>
                  <li>Use color consistently across visualizations</li>
                  <li>Include clear titles and axis labels</li>
                  <li>Consider your audience when selecting complexity level</li>
                </ul>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default HelpMenu;
