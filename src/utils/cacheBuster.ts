/**
 * Cache Busting Utility
 * Forces component remounting and state reset
 */

export const clearComponentCache = () => {
  // Add timestamp to force component remounting
  window.__COMPONENT_CACHE_KEY = Date.now();
};

export const getComponentKey = (baseKey: string) => {
  return `${baseKey}-${window.__COMPONENT_CACHE_KEY || Date.now()}`;
};

// Clear cache on page load
if (typeof window !== 'undefined') {
  clearComponentCache();
}

declare global {
  interface Window {
    __COMPONENT_CACHE_KEY?: number;
  }
}