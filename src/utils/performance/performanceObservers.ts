
export class PerformanceObservers {
  private observers: PerformanceObserver[] = [];

  initialize(): void {
    this.initializeNavigationObserver();
    this.initializeResourceObserver();
    this.initializeLongTaskObserver();
  }

  private initializeNavigationObserver(): void {
    try {
      const navObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          console.log(`🚀 Navigation: ${entry.name} - ${entry.duration.toFixed(2)}ms`);
        }
      });
      navObserver.observe({ entryTypes: ['navigation'] });
      this.observers.push(navObserver);
    } catch (error) {
      console.warn('Navigation observer not supported:', error);
    }
  }

  private initializeResourceObserver(): void {
    try {
      const resourceObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          if (entry.duration > 100) { // Only log slow resources
            console.log(`📦 Slow Resource: ${entry.name} - ${entry.duration.toFixed(2)}ms`);
          }
        }
      });
      resourceObserver.observe({ entryTypes: ['resource'] });
      this.observers.push(resourceObserver);
    } catch (error) {
      console.warn('Resource observer not supported:', error);
    }
  }

  private initializeLongTaskObserver(): void {
    try {
      const taskObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          console.warn(`⚠️ Long Task: ${entry.duration.toFixed(2)}ms - may block UI`);
        }
      });
      taskObserver.observe({ entryTypes: ['longtask'] });
      this.observers.push(taskObserver);
    } catch (error) {
      console.warn('Long task observer not supported:', error);
    }
  }

  cleanup(): void {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
  }
}
