-- Phase 4: User Profiles and Data Persistence
-- Create user profiles table for enhanced user experience
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  avatar_url TEXT,
  preferences JSONB DEFAULT '{}',
  tour_completed BOOLEAN DEFAULT FALSE,
  api_keys_configured JSONB DEFAULT '{}',
  usage_stats JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Create analysis sessions table for data persistence
CREATE TABLE public.analysis_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  session_name TEXT NOT NULL,
  question TEXT NOT NULL,
  file_data JSONB,
  analysis_results JSONB,
  confidence_score DECIMAL(3,2),
  ai_provider TEXT,
  status TEXT DEFAULT 'pending',
  is_public BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on analysis sessions
ALTER TABLE public.analysis_sessions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for analysis sessions
CREATE POLICY "Users can view their own sessions" 
ON public.analysis_sessions 
FOR SELECT 
USING (auth.uid() = user_id OR is_public = TRUE);

CREATE POLICY "Users can create their own sessions" 
ON public.analysis_sessions 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own sessions" 
ON public.analysis_sessions 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own sessions" 
ON public.analysis_sessions 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user_registration()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, display_name, preferences)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    '{
      "preferred_ai_provider": null,
      "email_notifications": true,
      "data_retention_days": 30,
      "theme": "system"
    }'::jsonb
  );
  RETURN NEW;
END;
$$;

-- Create trigger for new user registration
CREATE TRIGGER on_auth_user_created_enhanced
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_registration();

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_analysis_sessions_updated_at
    BEFORE UPDATE ON public.analysis_sessions
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX idx_analysis_sessions_user_id ON public.analysis_sessions(user_id);
CREATE INDEX idx_analysis_sessions_created_at ON public.analysis_sessions(created_at DESC);
CREATE INDEX idx_analysis_sessions_status ON public.analysis_sessions(status);

-- Create view for user analytics
CREATE VIEW public.user_analytics AS
SELECT 
  p.user_id,
  p.display_name,
  p.tour_completed,
  COUNT(a.id) as total_analyses,
  AVG(a.confidence_score) as avg_confidence,
  MAX(a.created_at) as last_analysis,
  COUNT(CASE WHEN a.created_at > NOW() - INTERVAL '7 days' THEN 1 END) as analyses_last_week
FROM public.profiles p
LEFT JOIN public.analysis_sessions a ON p.user_id = a.user_id
GROUP BY p.user_id, p.display_name, p.tour_completed;