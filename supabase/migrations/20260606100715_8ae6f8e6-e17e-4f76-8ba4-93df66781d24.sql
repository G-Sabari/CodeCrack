CREATE POLICY "Users update their own registration"
ON public.contest_registrations
FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);