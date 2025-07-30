/**
 * Force Component Refresh Utility
 * Ensures all components reload with fresh state
 */

// Force a complete component refresh by adding a timestamp
const forceRefresh = () => {
  // Add a unique timestamp to force React to remount components
  const timestamp = Date.now();
  
  // Clear any cached component states
  if (typeof window !== 'undefined') {
    (window as any).__FORCE_REFRESH = timestamp;
    
    // Force re-render by triggering a custom event
    window.dispatchEvent(new CustomEvent('force-component-refresh', {
      detail: { timestamp }
    }));
    
    console.log('🔄 Force refresh triggered:', timestamp);
  }
};

// Auto-trigger on module load
forceRefresh();

export { forceRefresh };