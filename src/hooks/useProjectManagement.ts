import { useState, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

export interface Project {
  id: string;
  name: string;
  research_question: string;
  business_context?: string;
  status: 'active' | 'completed' | 'archived';
  mode: 'educational' | 'professional';
  metadata: any;
  created_at: string;
  updated_at: string;
}

export interface AnalysisSession {
  id: string;
  project_id: string;
  session_type: 'standard' | 'educational' | 'deep_dive';
  status: 'running' | 'completed' | 'failed' | 'cancelled';
  insights: any[];
  visualizations: any[];
  recommendations: any[];
  sql_queries: any[];
  started_at: string;
  completed_at?: string;
  metadata: any;
}

export const useProjectManagement = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [currentSession, setCurrentSession] = useState<AnalysisSession | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const { toast } = useToast();

  const createProject = useCallback(async (
    name: string,
    researchQuestion: string,
    businessContext?: string,
    mode: 'educational' | 'professional' = 'professional'
  ): Promise<Project | null> => {
    if (!user) {
      setError('User must be authenticated to create projects');
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('projects')
        .insert({
          user_id: user.id,
          name,
          research_question: researchQuestion,
          business_context: businessContext,
          mode,
          status: 'active',
          metadata: {}
        })
        .select()
        .single();

      if (error) throw error;

      const project = data as Project;
      setCurrentProject(project);
      setProjects(prev => [...prev, project]);

      toast({
        title: "🕵️ Project Created",
        description: `Investigation "${name}" has been started.`,
      });

      return project;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create project';
      setError(errorMessage);
      toast({
        title: "Project Creation Failed",
        description: errorMessage,
        variant: "destructive",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [user, toast]);

  const fetchProjects = useCallback(async (): Promise<Project[]> => {
    if (!user) return [];

    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      if (error) throw error;

      const fetchedProjects = data as Project[];
      setProjects(fetchedProjects);
      return fetchedProjects;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch projects';
      setError(errorMessage);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  const startAnalysisSession = useCallback(async (
    projectId: string,
    sessionType: 'standard' | 'educational' | 'deep_dive' = 'standard'
  ): Promise<AnalysisSession | null> => {
    if (!user) {
      setError('User must be authenticated to start analysis');
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from('analysis_sessions')
        .insert({
          project_id: projectId,
          user_id: user.id,
          session_type: sessionType,
          status: 'running',
          insights: [],
          visualizations: [],
          recommendations: [],
          sql_queries: [],
          metadata: {}
        })
        .select()
        .single();

      if (error) throw error;

      const session = data as AnalysisSession;
      setCurrentSession(session);

      toast({
        title: "🔍 Analysis Started",
        description: "Investigation session has begun.",
      });

      return session;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to start analysis session';
      setError(errorMessage);
      toast({
        title: "Analysis Failed to Start",
        description: errorMessage,
        variant: "destructive",
      });
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [user, toast]);

  const updateSession = useCallback(async (
    sessionId: string,
    updates: Partial<AnalysisSession>
  ): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase
        .from('analysis_sessions')
        .update(updates)
        .eq('id', sessionId);

      if (error) throw error;

      if (currentSession?.id === sessionId) {
        setCurrentSession(prev => prev ? { ...prev, ...updates } : null);
      }

      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update session';
      setError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [currentSession]);

  const addResearchQuestion = useCallback(async (
    sessionId: string,
    question: string
  ): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const { error } = await supabase
        .from('research_questions')
        .insert({
          analysis_session_id: sessionId,
          question,
          confidence_level: 'medium',
          visualization_data: {}
        });

      if (error) throw error;

      toast({
        title: "❓ Question Added",
        description: "New research question has been added to the investigation.",
      });

      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add research question';
      setError(errorMessage);
      toast({
        title: "Failed to Add Question",
        description: errorMessage,
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const completeSession = useCallback(async (sessionId: string): Promise<boolean> => {
    return await updateSession(sessionId, {
      status: 'completed',
      completed_at: new Date().toISOString()
    });
  }, [updateSession]);

  return {
    // State
    projects,
    currentProject,
    currentSession,
    isLoading,
    error,
    
    // Actions
    createProject,
    fetchProjects,
    startAnalysisSession,
    updateSession,
    addResearchQuestion,
    completeSession,
    setCurrentProject,
    setCurrentSession,
  };
};

export default useProjectManagement;