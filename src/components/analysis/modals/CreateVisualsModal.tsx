
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { BarChart3, LineChart, PieChart, ScatterChart } from 'lucide-react';

interface CreateVisualsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CreateVisualsModal: React.FC<CreateVisualsModalProps> = ({
  open,
  onOpenChange
}) => {
  const visualOptions = [
    {
      icon: BarChart3,
      title: "Bar Chart",
      description: "Compare categories and show distribution",
      recommended: true
    },
    {
      icon: LineChart,
      title: "Line Chart",
      description: "Show trends over time",
      recommended: false
    },
    {
      icon: PieChart,
      title: "Pie Chart",
      description: "Display proportions and percentages",
      recommended: false
    },
    {
      icon: ScatterChart,
      title: "Scatter Plot",
      description: "Explore relationships between variables",
      recommended: true
    }
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-500" />
            Create Visualizations
          </DialogTitle>
          <DialogDescription>
            Choose the type of visualization that best represents your data insights.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid grid-cols-2 gap-4">
          {visualOptions.map((option, index) => (
            <div key={index} className={`p-4 border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors ${option.recommended ? 'border-primary bg-primary/5' : ''}`}>
              <div className="flex items-center gap-3 mb-2">
                <option.icon className="w-5 h-5 text-primary" />
                <h4 className="font-semibold">{option.title}</h4>
                {option.recommended && (
                  <span className="text-xs px-2 py-1 bg-primary/10 text-primary rounded">
                    Recommended
                  </span>
                )}
              </div>
              <p className="text-sm text-muted-foreground">{option.description}</p>
            </div>
          ))}
        </div>
        
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button>
            Create Visuals
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateVisualsModal;
