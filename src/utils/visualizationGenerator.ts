
import { ParsedData } from './dataParser';
export * from './visualization/dataQualityAnalyzer';
export * from './visualization/sampleDataGenerator';
export * from './visualization/recommendationEngine';

// Re-export main function for backwards compatibility
export { generateVisualizationRecommendations } from './visualization/recommendationEngine';
