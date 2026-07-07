
-- Admin write policies for content tables (public read policies already exist)
CREATE POLICY "admins manage companies" ON public.companies FOR ALL TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "admins manage pyq" ON public.pyq_questions FOR ALL TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

CREATE POLICY "admins manage roadmaps" ON public.preparation_roadmaps FOR ALL TO authenticated
  USING (public.is_admin()) WITH CHECK (public.is_admin());

-- Ensure updated_at triggers exist where columns present
DROP TRIGGER IF EXISTS trg_pyq_updated_at ON public.pyq_questions;
CREATE TRIGGER trg_pyq_updated_at BEFORE UPDATE ON public.pyq_questions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS trg_roadmaps_updated_at ON public.preparation_roadmaps;
CREATE TRIGGER trg_roadmaps_updated_at BEFORE UPDATE ON public.preparation_roadmaps
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
