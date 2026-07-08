
ALTER TABLE public.certificates
  ADD COLUMN IF NOT EXISTS download_count integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS shared_count integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS admin_comment text,
  ADD COLUMN IF NOT EXISTS reviewed_by uuid,
  ADD COLUMN IF NOT EXISTS reviewed_at timestamptz,
  ADD COLUMN IF NOT EXISTS eligibility jsonb;

CREATE OR REPLACE FUNCTION public.increment_certificate_download(_code text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.certificates
    SET download_count = download_count + 1
    WHERE code = _code AND status = 'approved';
END $$;

CREATE OR REPLACE FUNCTION public.increment_certificate_share(_code text)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.certificates
    SET shared_count = shared_count + 1
    WHERE code = _code AND status = 'approved';
END $$;

GRANT EXECUTE ON FUNCTION public.increment_certificate_download(text) TO anon, authenticated;
GRANT EXECUTE ON FUNCTION public.increment_certificate_share(text) TO anon, authenticated;

-- Notify user when a new pending certificate request is created
CREATE OR REPLACE FUNCTION public.notify_certificate_requested()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.status = 'pending' THEN
    INSERT INTO public.notifications(user_id, type, title, body, data)
    VALUES (NEW.user_id, 'certificate_requested',
      'Certificate request submitted',
      'Your request for "' || COALESCE(NEW.contest_title, 'Certificate') || '" is pending admin approval.',
      jsonb_build_object('certificate_id', NEW.id, 'code', NEW.code));
  END IF;
  RETURN NEW;
END $$;

DROP TRIGGER IF EXISTS trg_notify_certificate_requested ON public.certificates;
CREATE TRIGGER trg_notify_certificate_requested
AFTER INSERT ON public.certificates
FOR EACH ROW EXECUTE FUNCTION public.notify_certificate_requested();
