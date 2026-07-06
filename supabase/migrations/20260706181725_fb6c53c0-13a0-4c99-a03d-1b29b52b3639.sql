
-- Practice submissions (problem slug based, since problems here are static content)
CREATE TABLE public.practice_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  problem_slug TEXT NOT NULL,
  problem_title TEXT NOT NULL,
  difficulty TEXT,
  language TEXT NOT NULL,
  code TEXT NOT NULL,
  verdict TEXT NOT NULL,
  passed_count INT NOT NULL DEFAULT 0,
  total_count INT NOT NULL DEFAULT 0,
  runtime_ms INT,
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX practice_submissions_user_idx ON public.practice_submissions(user_id, submitted_at DESC);
CREATE INDEX practice_submissions_slug_idx ON public.practice_submissions(user_id, problem_slug);
GRANT SELECT, INSERT ON public.practice_submissions TO authenticated;
GRANT ALL ON public.practice_submissions TO service_role;
ALTER TABLE public.practice_submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own submissions read" ON public.practice_submissions
  FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.is_admin());
CREATE POLICY "own submissions insert" ON public.practice_submissions
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- Aptitude quiz attempts
CREATE TABLE public.aptitude_attempts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  topic TEXT,
  total_questions INT NOT NULL,
  correct_count INT NOT NULL,
  wrong_count INT NOT NULL,
  skipped_count INT NOT NULL DEFAULT 0,
  score INT NOT NULL,
  accuracy NUMERIC(5,2) NOT NULL,
  time_taken_seconds INT NOT NULL DEFAULT 0,
  xp_earned INT NOT NULL DEFAULT 0,
  answers JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX aptitude_attempts_user_idx ON public.aptitude_attempts(user_id, created_at DESC);
GRANT SELECT, INSERT ON public.aptitude_attempts TO authenticated;
GRANT ALL ON public.aptitude_attempts TO service_role;
ALTER TABLE public.aptitude_attempts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own attempts read" ON public.aptitude_attempts
  FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.is_admin());
CREATE POLICY "own attempts insert" ON public.aptitude_attempts
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- Notifications
CREATE TABLE public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  body TEXT,
  data JSONB,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX notifications_user_idx ON public.notifications(user_id, created_at DESC);
GRANT SELECT, UPDATE, DELETE ON public.notifications TO authenticated;
GRANT ALL ON public.notifications TO service_role;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own notifs read" ON public.notifications
  FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "own notifs update" ON public.notifications
  FOR UPDATE TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own notifs delete" ON public.notifications
  FOR DELETE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "admin insert notif" ON public.notifications
  FOR INSERT TO authenticated WITH CHECK (public.is_admin() OR auth.uid() = user_id);

-- Notify user when their certificate is approved/rejected
CREATE OR REPLACE FUNCTION public.notify_certificate_status_change()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF NEW.status IS DISTINCT FROM OLD.status THEN
    IF NEW.status = 'approved' THEN
      INSERT INTO public.notifications(user_id, type, title, body, data)
      VALUES (NEW.user_id, 'certificate_approved',
        'Certificate approved 🎉',
        'Your certificate for "' || COALESCE(NEW.contest_title,'Practice') || '" is ready to download.',
        jsonb_build_object('certificate_id', NEW.id, 'code', NEW.code));
    ELSIF NEW.status = 'rejected' THEN
      INSERT INTO public.notifications(user_id, type, title, body, data)
      VALUES (NEW.user_id, 'certificate_rejected',
        'Certificate request rejected',
        COALESCE(NEW.rejected_reason, 'Please review the requirements and try again.'),
        jsonb_build_object('certificate_id', NEW.id));
    END IF;
  END IF;
  RETURN NEW;
END $$;

DROP TRIGGER IF EXISTS trg_notify_cert_status ON public.certificates;
CREATE TRIGGER trg_notify_cert_status
AFTER UPDATE OF status ON public.certificates
FOR EACH ROW EXECUTE FUNCTION public.notify_certificate_status_change();

-- Enable realtime
ALTER PUBLICATION supabase_realtime ADD TABLE public.notifications;
ALTER PUBLICATION supabase_realtime ADD TABLE public.practice_submissions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.aptitude_attempts;
ALTER PUBLICATION supabase_realtime ADD TABLE public.certificates;
