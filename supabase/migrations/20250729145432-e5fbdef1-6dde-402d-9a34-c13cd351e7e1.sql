-- Phase 4: Enhance existing profiles table for guided tour and data persistence
-- Add missing columns to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS tour_completed BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS api_keys_configured JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS usage_stats JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS display_name TEXT;

-- Update profiles table to reference user_id properly if needed
-- Check if user_id column exists and add proper reference
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'profiles' AND column_name = 'user_id') THEN
        ALTER TABLE public.profiles ADD COLUMN user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE;
    END IF;
END $$;

-- Update preferences default if it's empty
UPDATE public.profiles 
SET preferences = '{
  "preferred_ai_provider": null,
  "email_notifications": true,
  "data_retention_days": 30,
  "theme": "system"
}'::jsonb 
WHERE preferences = '{}'::jsonb OR preferences IS NULL;

-- Create analysis sessions table for data persistence
CREATE TABLE IF NOT EXISTS public.user_analysis_sessions (
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

-- Enable RLS on user analysis sessions
ALTER TABLE public.user_analysis_sessions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for user analysis sessions
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'user_analysis_sessions' AND policyname = 'Users can view their own sessions') THEN
        CREATE POLICY "Users can view their own sessions" 
        ON public.user_analysis_sessions 
        FOR SELECT 
        USING (auth.uid() = user_id OR is_public = TRUE);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'user_analysis_sessions' AND policyname = 'Users can create their own sessions') THEN
        CREATE POLICY "Users can create their own sessions" 
        ON public.user_analysis_sessions 
        FOR INSERT 
        WITH CHECK (auth.uid() = user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'user_analysis_sessions' AND policyname = 'Users can update their own sessions') THEN
        CREATE POLICY "Users can update their own sessions" 
        ON public.user_analysis_sessions 
        FOR UPDATE 
        USING (auth.uid() = user_id);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'user_analysis_sessions' AND policyname = 'Users can delete their own sessions') THEN
        CREATE POLICY "Users can delete their own sessions" 
        ON public.user_analysis_sessions 
        FOR DELETE 
        USING (auth.uid() = user_id);
    END IF;
END $$;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_analysis_sessions_user_id ON public.user_analysis_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_analysis_sessions_created_at ON public.user_analysis_sessions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_user_analysis_sessions_status ON public.user_analysis_sessions(status);

-- Update the existing trigger function to handle tour completion
CREATE OR REPLACE FUNCTION public.handle_new_user_registration_enhanced()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, display_name, preferences, tour_completed, user_id)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    '{
      "preferred_ai_provider": null,
      "email_notifications": true,
      "data_retention_days": 30,
      "theme": "system"
    }'::jsonb,
    FALSE,
    NEW.id
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = EXCLUDED.full_name,
    display_name = EXCLUDED.display_name,
    user_id = EXCLUDED.user_id;
  RETURN NEW;
END;
$$;

-- Create or replace the trigger
DROP TRIGGER IF EXISTS on_auth_user_created_enhanced ON auth.users;
CREATE TRIGGER on_auth_user_created_enhanced
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_registration_enhanced();