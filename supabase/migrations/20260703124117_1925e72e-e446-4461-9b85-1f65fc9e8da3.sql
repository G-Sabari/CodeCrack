
-- Resume analyses
CREATE TABLE public.resume_analyses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  file_name text,
  file_path text,
  resume_text text,
  job_description text,
  ats_score int,
  match_score int,
  analysis jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.resume_analyses TO authenticated;
GRANT ALL ON public.resume_analyses TO service_role;
ALTER TABLE public.resume_analyses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own analyses select" ON public.resume_analyses FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.is_admin());
CREATE POLICY "own analyses insert" ON public.resume_analyses FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own analyses update" ON public.resume_analyses FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own analyses delete" ON public.resume_analyses FOR DELETE TO authenticated USING (auth.uid() = user_id OR public.is_admin());
CREATE TRIGGER trg_resume_analyses_updated BEFORE UPDATE ON public.resume_analyses FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Resume versions (builder drafts)
CREATE TABLE public.resume_versions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL DEFAULT 'Untitled Resume',
  template text NOT NULL DEFAULT 'classic',
  content jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.resume_versions TO authenticated;
GRANT ALL ON public.resume_versions TO service_role;
ALTER TABLE public.resume_versions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own versions all" ON public.resume_versions FOR ALL TO authenticated USING (auth.uid() = user_id OR public.is_admin()) WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER trg_resume_versions_updated BEFORE UPDATE ON public.resume_versions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Resume chats
CREATE TABLE public.resume_chats (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  analysis_id uuid REFERENCES public.resume_analyses(id) ON DELETE SET NULL,
  role text NOT NULL CHECK (role IN ('user','assistant','system')),
  content text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.resume_chats TO authenticated;
GRANT ALL ON public.resume_chats TO service_role;
ALTER TABLE public.resume_chats ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own chats select" ON public.resume_chats FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.is_admin());
CREATE POLICY "own chats insert" ON public.resume_chats FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own chats delete" ON public.resume_chats FOR DELETE TO authenticated USING (auth.uid() = user_id OR public.is_admin());

-- Storage policies for 'resumes' bucket (user folder = auth.uid()::text)
CREATE POLICY "resumes read own" ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'resumes' AND (auth.uid()::text = (storage.foldername(name))[1] OR public.is_admin()));
CREATE POLICY "resumes insert own" ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'resumes' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "resumes update own" ON storage.objects FOR UPDATE TO authenticated
  USING (bucket_id = 'resumes' AND auth.uid()::text = (storage.foldername(name))[1]);
CREATE POLICY "resumes delete own" ON storage.objects FOR DELETE TO authenticated
  USING (bucket_id = 'resumes' AND auth.uid()::text = (storage.foldername(name))[1]);
