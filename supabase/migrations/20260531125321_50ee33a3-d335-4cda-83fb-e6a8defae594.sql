
-- =============== CONTESTS ===============
CREATE TABLE public.contests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  description text,
  category text NOT NULL DEFAULT 'mixed', -- aptitude | dsa | web | sql | mixed
  week_number int,
  year int,
  start_time timestamptz NOT NULL,
  end_time timestamptz NOT NULL,
  duration_minutes int NOT NULL DEFAULT 90,
  total_points int NOT NULL DEFAULT 400,
  status text NOT NULL DEFAULT 'upcoming', -- upcoming | live | ended
  banner_gradient text DEFAULT 'from-primary/20 to-violet-500/20',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.contests TO anon, authenticated;
GRANT ALL ON public.contests TO service_role;
ALTER TABLE public.contests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view contests" ON public.contests FOR SELECT USING (true);
CREATE TRIGGER trg_contests_updated BEFORE UPDATE ON public.contests
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- =============== CONTEST PROBLEMS ===============
CREATE TABLE public.contest_problems (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  contest_id uuid NOT NULL REFERENCES public.contests(id) ON DELETE CASCADE,
  problem_id uuid NOT NULL REFERENCES public.problems(id) ON DELETE CASCADE,
  problem_order int NOT NULL DEFAULT 1,
  points int NOT NULL DEFAULT 100,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (contest_id, problem_id)
);
GRANT SELECT ON public.contest_problems TO anon, authenticated;
GRANT ALL ON public.contest_problems TO service_role;
ALTER TABLE public.contest_problems ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view contest problems" ON public.contest_problems FOR SELECT USING (true);
CREATE INDEX idx_contest_problems_contest ON public.contest_problems(contest_id);

-- =============== REGISTRATIONS ===============
CREATE TABLE public.contest_registrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  contest_id uuid NOT NULL REFERENCES public.contests(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  registered_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (contest_id, user_id)
);
GRANT SELECT, INSERT, DELETE ON public.contest_registrations TO authenticated;
GRANT ALL ON public.contest_registrations TO service_role;
ALTER TABLE public.contest_registrations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view registrations" ON public.contest_registrations FOR SELECT USING (true);
CREATE POLICY "Users register themselves" ON public.contest_registrations
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users unregister themselves" ON public.contest_registrations
  FOR DELETE TO authenticated USING (auth.uid() = user_id);

-- =============== SUBMISSIONS ===============
CREATE TABLE public.contest_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  contest_id uuid NOT NULL REFERENCES public.contests(id) ON DELETE CASCADE,
  problem_id uuid NOT NULL REFERENCES public.problems(id) ON DELETE CASCADE,
  user_id uuid NOT NULL,
  language text NOT NULL,
  code text NOT NULL,
  status text NOT NULL DEFAULT 'pending', -- accepted | wrong | error | pending
  score int NOT NULL DEFAULT 0,
  passed_count int NOT NULL DEFAULT 0,
  total_count int NOT NULL DEFAULT 0,
  runtime_ms int,
  submitted_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.contest_submissions TO anon, authenticated;
GRANT INSERT ON public.contest_submissions TO authenticated;
GRANT ALL ON public.contest_submissions TO service_role;
ALTER TABLE public.contest_submissions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view submissions for leaderboard" ON public.contest_submissions FOR SELECT USING (true);
CREATE POLICY "Users submit as themselves" ON public.contest_submissions
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE INDEX idx_contest_submissions_contest ON public.contest_submissions(contest_id);
CREATE INDEX idx_contest_submissions_user ON public.contest_submissions(user_id);

-- =============== CERTIFICATES ===============
CREATE TABLE public.certificates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  code text NOT NULL UNIQUE, -- short verification code (e.g. CC-2026-XXXX)
  user_id uuid NOT NULL,
  contest_id uuid NOT NULL REFERENCES public.contests(id) ON DELETE CASCADE,
  recipient_name text NOT NULL,
  contest_title text NOT NULL,
  rank int NOT NULL,
  score int NOT NULL,
  total_points int NOT NULL,
  issued_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, contest_id)
);
GRANT SELECT ON public.certificates TO anon, authenticated;
GRANT INSERT ON public.certificates TO authenticated;
GRANT ALL ON public.certificates TO service_role;
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can verify certificates" ON public.certificates FOR SELECT USING (true);
CREATE POLICY "Users issue their own certificate" ON public.certificates
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

-- =============== REALTIME ===============
ALTER PUBLICATION supabase_realtime ADD TABLE public.contest_submissions;
ALTER PUBLICATION supabase_realtime ADD TABLE public.contest_registrations;
ALTER TABLE public.contest_submissions REPLICA IDENTITY FULL;
ALTER TABLE public.contest_registrations REPLICA IDENTITY FULL;

-- =============== SEED ===============
DO $$
DECLARE
  v_contest uuid;
  v_now timestamptz := now();
  v_start timestamptz;
  v_end timestamptz;
  v_problem record;
  v_order int := 1;
BEGIN
  -- Next Saturday 10:00 UTC
  v_start := date_trunc('day', v_now) + ((6 - extract(dow from v_now)::int + 7) % 7 || ' days')::interval + interval '10 hours';
  IF v_start <= v_now THEN v_start := v_start + interval '7 days'; END IF;
  v_end := v_start + interval '90 minutes';

  INSERT INTO public.contests (slug, title, description, category, week_number, year, start_time, end_time, duration_minutes, total_points, status)
  VALUES (
    'weekly-1',
    'CodeCrack Weekly Challenge #1',
    'Compete with peers across India in a timed 90-minute coding sprint. Top 10 earn certificates.',
    'dsa',
    extract(week from v_start)::int,
    extract(year from v_start)::int,
    v_start, v_end, 90, 400, 'upcoming'
  )
  RETURNING id INTO v_contest;

  FOR v_problem IN
    SELECT id FROM public.problems WHERE problem_type = 'Coding'::problem_type ORDER BY created_at LIMIT 4
  LOOP
    INSERT INTO public.contest_problems (contest_id, problem_id, problem_order, points)
    VALUES (v_contest, v_problem.id, v_order, CASE v_order WHEN 1 THEN 100 WHEN 2 THEN 100 WHEN 3 THEN 100 ELSE 100 END);
    v_order := v_order + 1;
  END LOOP;
END $$;
