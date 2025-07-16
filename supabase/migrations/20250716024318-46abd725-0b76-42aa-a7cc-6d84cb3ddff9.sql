-- Create comprehensive tables for the Data Detective platform

-- Create projects table for storing investigation projects
CREATE TABLE IF NOT EXISTS public.projects (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL,
    name TEXT NOT NULL,
    research_question TEXT NOT NULL,
    business_context TEXT,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'archived')),
    mode TEXT NOT NULL DEFAULT 'professional' CHECK (mode IN ('educational', 'professional')),
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create project_files table for tracking uploaded files
CREATE TABLE IF NOT EXISTS public.project_files (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    filename TEXT NOT NULL,
    original_filename TEXT NOT NULL,
    file_size INTEGER NOT NULL,
    mime_type TEXT NOT NULL,
    storage_path TEXT NOT NULL,
    parsed_data JSONB DEFAULT '{}'::jsonb,
    column_mapping JSONB DEFAULT '{}'::jsonb,
    processed_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create analysis_sessions table for tracking analysis runs
CREATE TABLE IF NOT EXISTS public.analysis_sessions (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
    user_id UUID NOT NULL,
    session_type TEXT NOT NULL DEFAULT 'standard' CHECK (session_type IN ('standard', 'educational', 'deep_dive')),
    status TEXT NOT NULL DEFAULT 'running' CHECK (status IN ('running', 'completed', 'failed', 'cancelled')),
    insights JSONB DEFAULT '[]'::jsonb,
    visualizations JSONB DEFAULT '[]'::jsonb,
    recommendations JSONB DEFAULT '[]'::jsonb,
    sql_queries JSONB DEFAULT '[]'::jsonb,
    started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    completed_at TIMESTAMP WITH TIME ZONE,
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Create research_questions table for additional questions
CREATE TABLE IF NOT EXISTS public.research_questions (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    analysis_session_id UUID NOT NULL REFERENCES public.analysis_sessions(id) ON DELETE CASCADE,
    question TEXT NOT NULL,
    answer TEXT,
    confidence_level TEXT CHECK (confidence_level IN ('high', 'medium', 'low')),
    sql_query TEXT,
    visualization_data JSONB DEFAULT '{}'::jsonb,
    asked_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    answered_at TIMESTAMP WITH TIME ZONE
);

-- Enable Row Level Security
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.project_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.analysis_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.research_questions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for projects
CREATE POLICY "Users can view their own projects" 
ON public.projects 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own projects" 
ON public.projects 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own projects" 
ON public.projects 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own projects" 
ON public.projects 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create RLS policies for project_files
CREATE POLICY "Users can view files for their projects" 
ON public.project_files 
FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM public.projects 
        WHERE projects.id = project_files.project_id 
        AND projects.user_id = auth.uid()
    )
);

CREATE POLICY "Users can create files for their projects" 
ON public.project_files 
FOR INSERT 
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.projects 
        WHERE projects.id = project_files.project_id 
        AND projects.user_id = auth.uid()
    )
);

CREATE POLICY "Users can update files for their projects" 
ON public.project_files 
FOR UPDATE 
USING (
    EXISTS (
        SELECT 1 FROM public.projects 
        WHERE projects.id = project_files.project_id 
        AND projects.user_id = auth.uid()
    )
);

CREATE POLICY "Users can delete files for their projects" 
ON public.project_files 
FOR DELETE 
USING (
    EXISTS (
        SELECT 1 FROM public.projects 
        WHERE projects.id = project_files.project_id 
        AND projects.user_id = auth.uid()
    )
);

-- Create RLS policies for analysis_sessions
CREATE POLICY "Users can view their own analysis sessions" 
ON public.analysis_sessions 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own analysis sessions" 
ON public.analysis_sessions 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own analysis sessions" 
ON public.analysis_sessions 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own analysis sessions" 
ON public.analysis_sessions 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create RLS policies for research_questions
CREATE POLICY "Users can view research questions for their sessions" 
ON public.research_questions 
FOR SELECT 
USING (
    EXISTS (
        SELECT 1 FROM public.analysis_sessions 
        WHERE analysis_sessions.id = research_questions.analysis_session_id 
        AND analysis_sessions.user_id = auth.uid()
    )
);

CREATE POLICY "Users can create research questions for their sessions" 
ON public.research_questions 
FOR INSERT 
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.analysis_sessions 
        WHERE analysis_sessions.id = research_questions.analysis_session_id 
        AND analysis_sessions.user_id = auth.uid()
    )
);

CREATE POLICY "Users can update research questions for their sessions" 
ON public.research_questions 
FOR UPDATE 
USING (
    EXISTS (
        SELECT 1 FROM public.analysis_sessions 
        WHERE analysis_sessions.id = research_questions.analysis_session_id 
        AND analysis_sessions.user_id = auth.uid()
    )
);

CREATE POLICY "Users can delete research questions for their sessions" 
ON public.research_questions 
FOR DELETE 
USING (
    EXISTS (
        SELECT 1 FROM public.analysis_sessions 
        WHERE analysis_sessions.id = research_questions.analysis_session_id 
        AND analysis_sessions.user_id = auth.uid()
    )
);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_projects_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for projects table
CREATE TRIGGER update_projects_updated_at
    BEFORE UPDATE ON public.projects
    FOR EACH ROW
    EXECUTE FUNCTION public.update_projects_updated_at();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON public.projects(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON public.projects(status);
CREATE INDEX IF NOT EXISTS idx_project_files_project_id ON public.project_files(project_id);
CREATE INDEX IF NOT EXISTS idx_analysis_sessions_project_id ON public.analysis_sessions(project_id);
CREATE INDEX IF NOT EXISTS idx_analysis_sessions_user_id ON public.analysis_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_research_questions_session_id ON public.research_questions(analysis_session_id);