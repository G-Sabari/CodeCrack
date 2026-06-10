
ALTER TABLE public.certificates ALTER COLUMN contest_id DROP NOT NULL;
ALTER TABLE public.certificates DROP CONSTRAINT IF EXISTS certificates_user_id_contest_id_key;
ALTER TABLE public.certificates DROP CONSTRAINT IF EXISTS certificates_contest_id_fkey;
ALTER TABLE public.certificates
  ADD CONSTRAINT certificates_contest_id_fkey
  FOREIGN KEY (contest_id) REFERENCES public.contests(id) ON DELETE SET NULL;

DROP POLICY IF EXISTS "users request own certificate" ON public.certificates;
CREATE POLICY "users request own certificate" ON public.certificates
  FOR INSERT TO authenticated
  WITH CHECK (user_id = auth.uid() AND status = 'pending' AND contest_id IS NULL);
