
-- Profile extras: college, department
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS college_name text,
  ADD COLUMN IF NOT EXISTS department text;

-- Problems: add structured format fields (constraints/sample_input/sample_output already exist)
ALTER TABLE public.problems
  ADD COLUMN IF NOT EXISTS input_format text,
  ADD COLUMN IF NOT EXISTS output_format text;

-- Contest registrations: track when user started their personal timer
ALTER TABLE public.contest_registrations
  ADD COLUMN IF NOT EXISTS started_at timestamptz;

-- Update handle_new_user trigger to capture college/department from signup metadata
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, email, full_name, college_name, department)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', ''),
    NULLIF(NEW.raw_user_meta_data ->> 'college_name', ''),
    NULLIF(NEW.raw_user_meta_data ->> 'department', '')
  )
  ON CONFLICT (user_id) DO UPDATE SET
    full_name = COALESCE(EXCLUDED.full_name, public.profiles.full_name),
    college_name = COALESCE(EXCLUDED.college_name, public.profiles.college_name),
    department = COALESCE(EXCLUDED.department, public.profiles.department);
  RETURN NEW;
END;
$$;

-- Ensure trigger exists on auth.users
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'on_auth_user_created') THEN
    CREATE TRIGGER on_auth_user_created
      AFTER INSERT ON auth.users
      FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
  END IF;
END $$;
