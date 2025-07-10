
import { useToast } from '@/hooks/use-toast';

export const useVisualizationActions = () => {
  const { toast } = useToast();

  const handleSelectVisualization = (type: string, data: any[]) => {
    console.log('Visualization selected:', type, data);
    toast({
      title: "Visualization Selected",
      description: `Selected ${type} chart for visualization.`,
    });
  };

  return {
    handleSelectVisualization
  };
};
