
-- Certificate approval workflow
ALTER TABLE public.certificates
  ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS approved_at timestamptz,
  ADD COLUMN IF NOT EXISTS approved_by uuid,
  ADD COLUMN IF NOT EXISTS rejected_reason text;

ALTER TABLE public.certificates
  DROP CONSTRAINT IF EXISTS certificates_status_check;
ALTER TABLE public.certificates
  ADD CONSTRAINT certificates_status_check CHECK (status IN ('pending','approved','rejected'));

-- Default certificate_rules.auto_generate to false (manual-approval flow)
ALTER TABLE public.certificate_rules ALTER COLUMN auto_generate SET DEFAULT false;

-- Tighten public verify policy: only approved certs are publicly viewable by code
DROP POLICY IF EXISTS "Anyone can verify certificates" ON public.certificates;
CREATE POLICY "Anyone can verify approved certificates"
  ON public.certificates FOR SELECT
  USING (status = 'approved');

-- Owners can always see their own (pending/rejected/approved) so they know the state
DROP POLICY IF EXISTS "users view own certificates" ON public.certificates;
CREATE POLICY "users view own certificates"
  ON public.certificates FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Admins can see everything (existing admin manage policies already cover insert/update/delete)
DROP POLICY IF EXISTS "admins view all certificates" ON public.certificates;
CREATE POLICY "admins view all certificates"
  ON public.certificates FOR SELECT
  USING (public.is_admin());
