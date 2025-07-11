
export interface DiscoveredFile {
  path: string;
  type: 'component' | 'hook' | 'utility' | 'page' | 'type';
}

export class FileDiscovery {
  getKnownFileList(): DiscoveredFile[] {
    return [
      { path: 'src/pages/NewProject.tsx', type: 'page' },
      { path: 'src/components/QueryBuilder.tsx', type: 'component' },
      { path: 'src/components/VisualizationReporting.tsx', type: 'component' },
      { path: 'src/components/AnalysisDashboard.tsx', type: 'component' },
      { path: 'src/utils/qaSystem.ts', type: 'utility' },
      { path: 'src/utils/qa/qaTestSuites.ts', type: 'utility' },
      { path: 'src/hooks/useAutoQA.ts', type: 'hook' },
      { path: 'src/hooks/useAutoRefactor.ts', type: 'hook' },
      { path: 'src/components/QARunner.tsx', type: 'component' },
      { path: 'src/components/data/DataUploadFlow.tsx', type: 'component' }
    ];
  }

  findReactFiberNodes(): any[] {
    const nodes: any[] = [];
    const reactElements = Array.from(document.querySelectorAll('*')).slice(0, 50);
    
    for (const element of reactElements) {
      const fiberKey = Object.keys(element).find(key => 
        key.startsWith('__reactFiber') || 
        key.startsWith('__reactInternalInstance')
      );
      
      if (fiberKey && (element as any)[fiberKey]) {
        nodes.push((element as any)[fiberKey]);
      }
    }
    
    return nodes;
  }

  inferFilePath(componentName: string): string | null {
    if (componentName.includes('Page')) {
      return `src/pages/${componentName}.tsx`;
    }
    if (componentName.startsWith('use')) {
      return `src/hooks/${componentName}.ts`;
    }
    if (componentName.includes('Hook')) {
      return `src/hooks/${componentName}.ts`;
    }
    return `src/components/${componentName}.tsx`;
  }

  inferFileType(path: string): 'component' | 'hook' | 'utility' | 'page' | 'type' | 'unknown' {
    if (path.includes('/pages/')) return 'page';
    if (path.includes('/hooks/') || path.includes('use')) return 'hook';
    if (path.includes('/components/')) return 'component';
    if (path.includes('/utils/')) return 'utility';
    if (path.includes('/types/') || path.endsWith('.d.ts')) return 'type';
    return 'unknown';
  }
}
