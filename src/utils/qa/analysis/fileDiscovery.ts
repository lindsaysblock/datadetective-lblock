
export interface DiscoveredFile {
  path: string;
  type: 'component' | 'hook' | 'utility' | 'page' | 'type';
  size?: number;
  lastModified?: Date;
}

export class FileDiscovery {
  private knownFiles: DiscoveredFile[] = [
    { path: 'src/components/App.tsx', type: 'component' },
    { path: 'src/pages/NewProject.tsx', type: 'page' },
    { path: 'src/pages/Dashboard.tsx', type: 'page' },
    { path: 'src/pages/Home.tsx', type: 'page' },
    { path: 'src/pages/Profile.tsx', type: 'page' },
    { path: 'src/pages/QueryHistory.tsx', type: 'page' },
    { path: 'src/components/QueryBuilder.tsx', type: 'component' },
    { path: 'src/components/VisualizationReporting.tsx', type: 'component' },
    { path: 'src/components/AnalysisDashboard.tsx', type: 'component' },
    { path: 'src/components/DataSourceManager.tsx', type: 'component' },
    { path: 'src/components/QARunner.tsx', type: 'component' },
    { path: 'src/components/LoadTestRunner.tsx', type: 'component' },
    { path: 'src/hooks/useNewProjectForm.ts', type: 'hook' },
    { path: 'src/hooks/useAutoQA.ts', type: 'hook' },
    { path: 'src/hooks/useE2ELoadTest.ts', type: 'hook' },
    { path: 'src/utils/qaSystem.ts', type: 'utility' },
    { path: 'src/utils/loadTesting.ts', type: 'utility' },
    { path: 'src/utils/performance/performanceMonitor.ts', type: 'utility' }
  ];

  getKnownFileList(): DiscoveredFile[] {
    return [...this.knownFiles];
  }

  findReactFiberNodes(): any[] {
    const fiberNodes: any[] = [];
    
    try {
      const rootElement = document.querySelector('#root');
      if (rootElement) {
        // Use type assertion to access React internal properties
        const reactRoot = (rootElement as any)._reactInternalFiber ||
                         (rootElement as any)._reactInternals;
        
        if (reactRoot) {
          this.traverseFiber(reactRoot, fiberNodes, 0, 10);
        }
      }
    } catch (error) {
      console.warn('Could not traverse React fiber nodes:', error);
    }
    
    return fiberNodes;
  }

  private traverseFiber(fiber: any, nodes: any[], depth: number, maxDepth: number): void {
    if (depth > maxDepth || !fiber) return;
    
    if (fiber.type && typeof fiber.type === 'function' && fiber.type.name) {
      nodes.push(fiber);
    }
    
    if (fiber.child) {
      this.traverseFiber(fiber.child, nodes, depth + 1, maxDepth);
    }
    
    if (fiber.sibling) {
      this.traverseFiber(fiber.sibling, nodes, depth, maxDepth);
    }
  }

  inferFilePath(componentName: string): string | null {
    const knownMappings: Record<string, string> = {
      'App': 'src/components/App.tsx',
      'NewProject': 'src/pages/NewProject.tsx',
      'Dashboard': 'src/pages/Dashboard.tsx',
      'QueryBuilder': 'src/components/QueryBuilder.tsx',
      'DataSourceManager': 'src/components/DataSourceManager.tsx',
      'QARunner': 'src/components/QARunner.tsx',
      'LoadTestRunner': 'src/components/LoadTestRunner.tsx'
    };

    if (knownMappings[componentName]) {
      return knownMappings[componentName];
    }

    // Try to infer based on naming conventions
    if (componentName.endsWith('Page')) {
      return `src/pages/${componentName}.tsx`;
    } else if (componentName.startsWith('use')) {
      return `src/hooks/${componentName}.ts`;
    } else {
      return `src/components/${componentName}.tsx`;
    }
  }

  inferFileType(path: string): 'component' | 'hook' | 'utility' | 'page' | 'type' {
    if (path.includes('/pages/')) return 'page';
    if (path.includes('/hooks/')) return 'hook';
    if (path.includes('/components/')) return 'component';
    if (path.includes('/types/') || path.endsWith('.d.ts')) return 'type';
    return 'utility';
  }
}
