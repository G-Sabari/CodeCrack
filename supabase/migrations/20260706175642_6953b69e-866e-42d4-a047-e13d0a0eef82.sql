
-- 1. Reset table privileges: revoke broad grants, then re-grant appropriately.
DO $$
DECLARE t text;
BEGIN
  FOR t IN SELECT tablename FROM pg_tables WHERE schemaname='public' LOOP
    EXECUTE format('REVOKE ALL ON public.%I FROM anon, authenticated', t);
  END LOOP;
END $$;

-- Public-readable catalog tables (no user data)
GRANT SELECT ON public.companies, public.problems, public.contests,
  public.contest_problems, public.problem_companies, public.preparation_roadmaps,
  public.pyq_questions, public.certificate_rules TO anon, authenticated;

-- Authenticated user tables (RLS enforces per-row access)
GRANT SELECT, INSERT, UPDATE, DELETE ON
  public.profiles, public.certificates, public.contest_registrations,
  public.contest_submissions, public.solved_problems, public.user_progress,
  public.user_roadmap_progress, public.resume_analyses, public.resume_chats,
  public.resume_versions
  TO authenticated;

-- user_roles: read-only for authenticated (has_role uses SECURITY DEFINER anyway)
GRANT SELECT ON public.user_roles TO authenticated;

-- 2. Restrict contest_registrations & contest_submissions SELECT to owner + admin.
DROP POLICY IF EXISTS "Anyone can view registrations" ON public.contest_registrations;
CREATE POLICY "Owners and admins view registrations"
  ON public.contest_registrations FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR public.is_admin());

DROP POLICY IF EXISTS "Anyone can view submissions for leaderboard" ON public.contest_submissions;
CREATE POLICY "Owners and admins view submissions"
  ON public.contest_submissions FOR SELECT TO authenticated
  USING (auth.uid() = user_id OR public.is_admin());

-- 3. Lock down SECURITY DEFINER function EXECUTE.
REVOKE EXECUTE ON FUNCTION public.claim_first_admin() FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.is_admin() FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.claim_first_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, app_role) TO authenticated;

-- 4. Realtime authorization: only allow subscribing to own user-scoped topics.
ALTER TABLE IF EXISTS realtime.messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users read own realtime topic" ON realtime.messages;
CREATE POLICY "Users read own realtime topic"
  ON realtime.messages FOR SELECT TO authenticated
  USING (
    realtime.topic() = 'user:' || auth.uid()::text
  );
