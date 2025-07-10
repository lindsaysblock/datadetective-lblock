
import { useHypothesisActions } from './useHypothesisActions';
import { useVisualizationActions } from './useVisualizationActions';
import { useFindingActions } from './useFindingActions';

export const useDashboardActions = (filename?: string) => {
  const { handleHypothesisUpdate } = useHypothesisActions();
  const { handleSelectVisualization } = useVisualizationActions();
  const { handleExportFinding, handleShareFinding } = useFindingActions(filename);

  return {
    handleHypothesisUpdate,
    handleSelectVisualization,
    handleExportFinding,
    handleShareFinding
  };
};
