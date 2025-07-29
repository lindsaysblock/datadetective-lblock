// Helper functions for performance monitoring

export const getMemoryUsage = (): number => {
  try {
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      return memory.usedJSHeapSize / 1024 / 1024; // Convert to MB
    }
    return 0;
  } catch {
    return 0;
  }
};

export const getDOMNodeCount = (): number => {
  try {
    return document.querySelectorAll('*').length;
  } catch {
    return 0;
  }
};

export const getEventListenerCount = (): number => {
  try {
    // Estimate based on common elements that typically have listeners
    const buttons = document.querySelectorAll('button').length;
    const inputs = document.querySelectorAll('input').length;
    const links = document.querySelectorAll('a').length;
    return buttons + inputs + links;
  } catch {
    return 0;
  }
};

export const getImageCount = () => {
  try {
    const images = document.querySelectorAll('img');
    let loaded = 0;
    let total = images.length;
    
    images.forEach(img => {
      if (img.complete && img.naturalHeight !== 0) {
        loaded++;
      }
    });
    
    return { loaded, total };
  } catch {
    return { loaded: 0, total: 0 };
  }
};