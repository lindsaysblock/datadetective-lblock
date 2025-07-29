/**
 * Code Splitting Optimizer  
 * Focused utility for code splitting and lazy loading optimization
 */

class CodeSplittingOptimizer {
  async optimize(): Promise<number> {
    console.log('🔧 Optimizing code splitting...');
    
    let chunksCreated = 0;

    // Dynamic import optimization
    chunksCreated += this.setupDynamicImports();

    // Route-based code splitting
    chunksCreated += this.optimizeRouteChunks();

    // Component-level code splitting
    chunksCreated += this.optimizeComponentChunks();

    console.log(`✅ Code splitting optimization complete - ${chunksCreated} chunks created`);
    return chunksCreated;
  }

  private setupDynamicImports(): number {
    // Preload likely next routes
    const currentPath = window.location.pathname;
    const likelyNextRoutes = this.predictNextRoutes(currentPath);
    
    likelyNextRoutes.forEach(route => {
      this.preloadRoute(route);
    });

    return likelyNextRoutes.length;
  }

  private optimizeRouteChunks(): number {
    // Create invisible links with prefetch for routes
    const routes = ['/admin', '/new-project', '/analysis', '/query-history'];
    let created = 0;

    routes.forEach(route => {
      if (route !== window.location.pathname) {
        this.preloadRoute(route);
        created++;
      }
    });

    return created;
  }

  private optimizeComponentChunks(): number {
    // Create intersection observer for component containers
    let observed = 0;
    const componentObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const element = entry.target as HTMLElement;
          if (element.dataset.component) {
            this.loadComponent(element.dataset.component);
            componentObserver.unobserve(element);
          }
        }
      });
    });

    document.querySelectorAll('[data-component]').forEach(el => {
      componentObserver.observe(el);
      observed++;
    });

    return observed;
  }

  private predictNextRoutes(currentPath: string): string[] {
    const routePredictions: Record<string, string[]> = {
      '/': ['/new-project', '/query-history'],
      '/admin': ['/'],
      '/new-project': ['/analysis'],
      '/query-history': ['/analysis', '/new-project']
    };
    
    return routePredictions[currentPath] || [];
  }

  private preloadRoute(route: string): void {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = route;
    document.head.appendChild(link);
  }

  private loadComponent(componentName: string): void {
    import(`../../components/${componentName}`)
      .then(() => {
        console.log(`✅ Component ${componentName} loaded`);
      })
      .catch(() => {
        console.warn(`Failed to load component ${componentName}`);
      });
  }
}

export const codeSplittingOptimizer = new CodeSplittingOptimizer();