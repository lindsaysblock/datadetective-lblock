
-- 1. Install pgcrypto extension
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 2. Enable RLS on storage.objects
ALTER TABLE storage.objects
  ENABLE ROW LEVEL SECURITY;

-- 3. Add updated_at to analysis_results & trigger
ALTER TABLE public.analysis_results
  ADD COLUMN updated_at TIMESTAMPTZ DEFAULT NOW();

CREATE TRIGGER update_analysis_results_updated_at
  BEFORE UPDATE ON public.analysis_results
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- 4. Modernize triggers for profiles & datasets
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS update_datasets_updated_at ON public.datasets;
CREATE TRIGGER update_datasets_updated_at
  BEFORE UPDATE ON public.datasets
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- 5. Enforce email constraints & add indexes
ALTER TABLE public.profiles
  ALTER COLUMN email SET NOT NULL,
  ADD CONSTRAINT profiles_email_unique UNIQUE (email);

CREATE INDEX IF NOT EXISTS idx_datasets_user_id
  ON public.datasets(user_id);

CREATE INDEX IF NOT EXISTS idx_analysis_results_user_id
  ON public.analysis_results(user_id);

CREATE INDEX IF NOT EXISTS idx_analysis_results_dataset_id
  ON public.analysis_results(dataset_id);

-- 6. Verify storage bucket insert
INSERT INTO storage.buckets (id, name, public)
VALUES ('datasets', 'datasets', false)
ON CONFLICT (id) DO NOTHING;
