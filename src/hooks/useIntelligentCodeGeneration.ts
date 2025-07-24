/**
 * Intelligent Code Generation Hook
 * Integrates code generation, documentation, and refactoring capabilities
 */

import { useState, useCallback, useRef } from 'react';
import { IntelligentCodeGenerator, type CodeGenerationRequest, type GeneratedCode } from '@/utils/generation/intelligentCodeGenerator';
import { SmartDocumentationGenerator, type ApiDocumentation, type DocumentationConfig } from '@/utils/generation/smartDocumentationGenerator';
import { AutomatedRefactoringEngine, type RefactoringResult, type RefactoringSession } from '@/utils/generation/automatedRefactoringEngine';

export interface CodeGenerationState {
  isGenerating: boolean;
  isDocumenting: boolean;
  isRefactoring: boolean;
  generatedFiles: Map<string, GeneratedCode>;
  documentation: ApiDocumentation | null;
  refactoringSessions: RefactoringSession[];
  error: string | null;
  progress: {
    current: number;
    total: number;
    stage: string;
  };
}

export interface GenerationOptions {
  includeTests: boolean;
  includeDocumentation: boolean;
  applyOptimizations: boolean;
  autoRefactor: boolean;
}

export function useIntelligentCodeGeneration() {
  const [state, setState] = useState<CodeGenerationState>({
    isGenerating: false,
    isDocumenting: false,
    isRefactoring: false,
    generatedFiles: new Map(),
    documentation: null,
    refactoringSessions: [],
    error: null,
    progress: { current: 0, total: 0, stage: '' }
  });

  const codeGenerator = useRef(new IntelligentCodeGenerator());
  const docGenerator = useRef(new SmartDocumentationGenerator());
  const refactoringEngine = useRef(new AutomatedRefactoringEngine());

  const updateProgress = useCallback((current: number, total: number, stage: string) => {
    setState(prev => ({
      ...prev,
      progress: { current, total, stage }
    }));
  }, []);

  const generateCode = useCallback(async (
    requests: CodeGenerationRequest[],
    options: Partial<GenerationOptions> = {}
  ): Promise<GeneratedCode[]> => {
    const {
      includeTests = true,
      includeDocumentation = true,
      applyOptimizations = true,
      autoRefactor = false
    } = options;

    setState(prev => ({
      ...prev,
      isGenerating: true,
      error: null,
      progress: { current: 0, total: requests.length, stage: 'Initializing' }
    }));

    try {
      const results: GeneratedCode[] = [];
      
      for (let i = 0; i < requests.length; i++) {
        const request = requests[i];
        updateProgress(i + 1, requests.length, `Generating ${request.type}: ${request.name}`);
        
        const generated = await codeGenerator.current.generateCode(request);
        results.push(generated);

        setState(prev => ({
          ...prev,
          generatedFiles: new Map(prev.generatedFiles).set(generated.fileName, generated)
        }));

        // Apply optimizations if requested
        if (applyOptimizations && autoRefactor) {
          updateProgress(i + 1, requests.length, `Optimizing ${request.name}`);
          
          const sessionId = refactoringEngine.current.startRefactoringSession();
          await refactoringEngine.current.refactorCode(
            generated.fileName,
            generated.content,
            true
          );
          const session = refactoringEngine.current.endRefactoringSession();
          
          if (session) {
            setState(prev => ({
              ...prev,
              refactoringSessions: [...prev.refactoringSessions, session]
            }));
          }
        }
      }

      // Generate documentation if requested
      if (includeDocumentation) {
        updateProgress(requests.length, requests.length, 'Generating documentation');
        await generateDocumentation();
      }

      setState(prev => ({
        ...prev,
        isGenerating: false,
        progress: { current: requests.length, total: requests.length, stage: 'Complete' }
      }));

      return results;
    } catch (error) {
      setState(prev => ({
        ...prev,
        isGenerating: false,
        error: error instanceof Error ? error.message : 'Generation failed'
      }));
      throw error;
    }
  }, [updateProgress]);

  const generateSingleComponent = useCallback(async (
    name: string,
    description: string,
    props?: Record<string, string>,
    options?: Partial<GenerationOptions>
  ): Promise<GeneratedCode> => {
    const request: CodeGenerationRequest = {
      type: 'component',
      name,
      description,
      requirements: [description],
      props
    };

    const results = await generateCode([request], options);
    return results[0];
  }, [generateCode]);

  const generateSingleHook = useCallback(async (
    name: string,
    description: string,
    requirements: string[] = [],
    options?: Partial<GenerationOptions>
  ): Promise<GeneratedCode> => {
    const request: CodeGenerationRequest = {
      type: 'hook',
      name,
      description,
      requirements: requirements.length > 0 ? requirements : [description]
    };

    const results = await generateCode([request], options);
    return results[0];
  }, [generateCode]);

  const generateUtility = useCallback(async (
    name: string,
    description: string,
    requirements: string[] = [],
    options?: Partial<GenerationOptions>
  ): Promise<GeneratedCode> => {
    const request: CodeGenerationRequest = {
      type: 'utility',
      name,
      description,
      requirements: requirements.length > 0 ? requirements : [description]
    };

    const results = await generateCode([request], options);
    return results[0];
  }, [generateCode]);

  const generateDocumentation = useCallback(async (
    config?: Partial<DocumentationConfig>
  ): Promise<ApiDocumentation> => {
    setState(prev => ({ ...prev, isDocumenting: true, error: null }));

    try {
      if (config) {
        docGenerator.current = new SmartDocumentationGenerator(config);
      }

      const documentation = await docGenerator.current.generateProjectDocumentation();
      
      setState(prev => ({
        ...prev,
        isDocumenting: false,
        documentation
      }));

      return documentation;
    } catch (error) {
      setState(prev => ({
        ...prev,
        isDocumenting: false,
        error: error instanceof Error ? error.message : 'Documentation generation failed'
      }));
      throw error;
    }
  }, []);

  const refactorFiles = useCallback(async (
    files: Map<string, string>,
    autoApplyAll: boolean = false
  ): Promise<RefactoringResult[]> => {
    setState(prev => ({ ...prev, isRefactoring: true, error: null }));

    try {
      const sessionId = refactoringEngine.current.startRefactoringSession();
      const results = await refactoringEngine.current.refactorMultipleFiles(files, autoApplyAll);
      const session = refactoringEngine.current.endRefactoringSession();

      if (session) {
        setState(prev => ({
          ...prev,
          refactoringSessions: [...prev.refactoringSessions, session],
          isRefactoring: false
        }));
      }

      return results;
    } catch (error) {
      setState(prev => ({
        ...prev,
        isRefactoring: false,
        error: error instanceof Error ? error.message : 'Refactoring failed'
      }));
      throw error;
    }
  }, []);

  const exportGeneratedFiles = useCallback((): { fileName: string; content: string }[] => {
    return Array.from(state.generatedFiles.values()).map(file => ({
      fileName: file.fileName,
      content: file.content
    }));
  }, [state.generatedFiles]);

  const exportDocumentation = useCallback(async (format: 'markdown' | 'json' = 'markdown'): Promise<string> => {
    if (!state.documentation) {
      throw new Error('No documentation available');
    }

    if (format === 'json') {
      return JSON.stringify(state.documentation, null, 2);
    }

    return await docGenerator.current.generateMarkdownDocs(state.documentation);
  }, [state.documentation]);

  const clearGenerated = useCallback(() => {
    setState(prev => ({
      ...prev,
      generatedFiles: new Map(),
      documentation: null,
      error: null,
      progress: { current: 0, total: 0, stage: '' }
    }));
    
    codeGenerator.current.clearGeneratedFiles();
    docGenerator.current.clearCache();
  }, []);

  const getRefactoringReport = useCallback((sessionId: string): string => {
    return refactoringEngine.current.generateRefactoringReport(sessionId);
  }, []);

  return {
    // State
    ...state,
    
    // Core generation functions
    generateCode,
    generateSingleComponent,
    generateSingleHook,
    generateUtility,
    
    // Documentation functions
    generateDocumentation,
    exportDocumentation,
    
    // Refactoring functions
    refactorFiles,
    getRefactoringReport,
    
    // Utility functions
    exportGeneratedFiles,
    clearGenerated,
    
    // Status checks
    isActive: state.isGenerating || state.isDocumenting || state.isRefactoring,
    hasGenerated: state.generatedFiles.size > 0,
    hasDocumentation: state.documentation !== null,
    hasRefactoringSessions: state.refactoringSessions.length > 0
  };
}