
-- 1. ROLES
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$ SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role) $$;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$ SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = auth.uid() AND role = 'admin') $$;

CREATE POLICY "view own roles" ON public.user_roles FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "admins view all roles" ON public.user_roles FOR SELECT TO authenticated USING (public.is_admin());
CREATE POLICY "admins manage roles" ON public.user_roles FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Bootstrap: the first authenticated user to call this becomes admin
CREATE OR REPLACE FUNCTION public.claim_first_admin()
RETURNS boolean LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE _uid uuid := auth.uid();
BEGIN
  IF _uid IS NULL THEN RETURN false; END IF;
  IF EXISTS (SELECT 1 FROM public.user_roles WHERE role = 'admin') THEN RETURN false; END IF;
  INSERT INTO public.user_roles (user_id, role) VALUES (_uid, 'admin') ON CONFLICT DO NOTHING;
  RETURN true;
END $$;

GRANT EXECUTE ON FUNCTION public.claim_first_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated, anon;

-- 2. CERTIFICATE RULES
CREATE TABLE public.certificate_rules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  contest_id uuid NOT NULL UNIQUE REFERENCES public.contests(id) ON DELETE CASCADE,
  enabled boolean NOT NULL DEFAULT false,
  participation_enabled boolean NOT NULL DEFAULT true,
  min_score integer NOT NULL DEFAULT 1,
  top_n integer NOT NULL DEFAULT 3,
  citation_prompt text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.certificate_rules TO authenticated, anon;
GRANT ALL ON public.certificate_rules TO service_role;
ALTER TABLE public.certificate_rules ENABLE ROW LEVEL SECURITY;
CREATE POLICY "anyone view rules" ON public.certificate_rules FOR SELECT USING (true);
CREATE POLICY "admins manage rules" ON public.certificate_rules FOR ALL TO authenticated USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE TRIGGER trg_cert_rules_updated BEFORE UPDATE ON public.certificate_rules
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 3. EXTEND CERTIFICATES
ALTER TABLE public.certificates
  ADD COLUMN IF NOT EXISTS certificate_type text NOT NULL DEFAULT 'participation',
  ADD COLUMN IF NOT EXISTS citation text,
  ADD COLUMN IF NOT EXISTS generated_by uuid;

-- Replace user self-issue policy with admin issuance
DROP POLICY IF EXISTS "Users issue their own certificate" ON public.certificates;
CREATE POLICY "admins issue certificates" ON public.certificates FOR INSERT TO authenticated
  WITH CHECK (public.is_admin());
CREATE POLICY "admins update certificates" ON public.certificates FOR UPDATE TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());
CREATE POLICY "admins delete certificates" ON public.certificates FOR DELETE TO authenticated
  USING (public.is_admin());

-- 4. ADMIN POLICIES on existing tables
CREATE POLICY "admins manage contests" ON public.contests FOR ALL TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "admins manage contest_problems" ON public.contest_problems FOR ALL TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "admins manage problems" ON public.problems FOR ALL TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Submissions: admins can update/delete; users still insert their own; everyone reads (already exists)
CREATE POLICY "admins manage submissions" ON public.contest_submissions FOR ALL TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Profiles read-all for admins (assumes existing self policies remain)
CREATE POLICY "admins view all profiles" ON public.profiles FOR SELECT TO authenticated USING (public.is_admin());
