
import { lazy } from 'react';

// Lazy load heavy components to improve initial load time
export const LazyAdmin = lazy(() => import('../pages/Admin'));
export const LazyAnalysisDashboard = lazy(() => import('./AnalysisDashboard'));
export const LazyDataUploadContainer = lazy(() => import('./upload/DataUploadContainer'));
export const LazyProjectAnalysisView = lazy(() => import('./ProjectAnalysisView'));
export const LazyEnhancedAnalyticsDashboard = lazy(() => import('./analytics/EnhancedAnalyticsDashboard'));

// Preload critical components
export const preloadCriticalComponents = () => {
  // Preload components that are likely to be used soon
  import('./upload/DataUploadContainer');
  import('./ProjectAnalysisView');
};
