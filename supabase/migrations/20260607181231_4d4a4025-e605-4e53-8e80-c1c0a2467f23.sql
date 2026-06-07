
ALTER TABLE public.certificates
  ADD COLUMN IF NOT EXISTS percentage numeric(5,2) NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS accuracy numeric(5,2) NOT NULL DEFAULT 0;

ALTER TABLE public.contests
  ADD COLUMN IF NOT EXISTS finalized_at timestamptz;

ALTER TABLE public.certificate_rules
  ADD COLUMN IF NOT EXISTS auto_generate boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS pass_percentage integer NOT NULL DEFAULT 50;
