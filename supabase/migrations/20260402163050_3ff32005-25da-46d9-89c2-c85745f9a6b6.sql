CREATE POLICY "Users can delete their own profile"
ON public.profiles FOR DELETE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own solved problems"
ON public.solved_problems FOR DELETE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own progress"
ON public.user_progress FOR DELETE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own roadmap progress"
ON public.user_roadmap_progress FOR DELETE
USING (auth.uid() = user_id);