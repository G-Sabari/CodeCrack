-- Add new columns to companies table for interview patterns
ALTER TABLE public.companies 
ADD COLUMN IF NOT EXISTS hiring_pattern text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS difficulty_level text DEFAULT 'Medium',
ADD COLUMN IF NOT EXISTS common_roles text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS online_test_details text,
ADD COLUMN IF NOT EXISTS technical_rounds_details text,
ADD COLUMN IF NOT EXISTS hr_round_details text,
ADD COLUMN IF NOT EXISTS preparation_tips text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS interview_experience_count integer DEFAULT 0;

-- Create PYQ (Previous Year Questions) table
CREATE TABLE public.pyq_questions (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  company_id uuid REFERENCES public.companies(id) ON DELETE CASCADE,
  year integer NOT NULL,
  topic text NOT NULL,
  subtopic text,
  difficulty text NOT NULL DEFAULT 'Medium',
  question text NOT NULL,
  solution text,
  explanation text,
  hints text[] DEFAULT '{}',
  tags text[] DEFAULT '{}',
  question_type text NOT NULL DEFAULT 'Coding',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create index for faster queries
CREATE INDEX idx_pyq_company ON public.pyq_questions(company_id);
CREATE INDEX idx_pyq_year ON public.pyq_questions(year);
CREATE INDEX idx_pyq_topic ON public.pyq_questions(topic);
CREATE INDEX idx_pyq_difficulty ON public.pyq_questions(difficulty);

-- Enable RLS
ALTER TABLE public.pyq_questions ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Anyone can view PYQ questions" 
ON public.pyq_questions 
FOR SELECT 
USING (true);

-- Create preparation_roadmaps table
CREATE TABLE public.preparation_roadmaps (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  duration_days integer NOT NULL,
  target_track text NOT NULL DEFAULT 'Service',
  description text,
  topics jsonb NOT NULL DEFAULT '[]',
  daily_plan jsonb NOT NULL DEFAULT '[]',
  weekly_goals jsonb NOT NULL DEFAULT '[]',
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.preparation_roadmaps ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Anyone can view roadmaps" 
ON public.preparation_roadmaps 
FOR SELECT 
USING (true);

-- Create user_roadmap_progress table
CREATE TABLE public.user_roadmap_progress (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  roadmap_id uuid REFERENCES public.preparation_roadmaps(id) ON DELETE CASCADE,
  current_day integer DEFAULT 1,
  completed_days integer[] DEFAULT '{}',
  started_at timestamp with time zone NOT NULL DEFAULT now(),
  last_activity timestamp with time zone DEFAULT now(),
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create index
CREATE INDEX idx_user_roadmap_user ON public.user_roadmap_progress(user_id);

-- Enable RLS
ALTER TABLE public.user_roadmap_progress ENABLE ROW LEVEL SECURITY;

-- RLS policies for user_roadmap_progress
CREATE POLICY "Users can view their own roadmap progress" 
ON public.user_roadmap_progress 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own roadmap progress" 
ON public.user_roadmap_progress 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own roadmap progress" 
ON public.user_roadmap_progress 
FOR UPDATE 
USING (auth.uid() = user_id);

-- Add trigger for updated_at on new tables
CREATE TRIGGER update_pyq_questions_updated_at
BEFORE UPDATE ON public.pyq_questions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_preparation_roadmaps_updated_at
BEFORE UPDATE ON public.preparation_roadmaps
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_roadmap_progress_updated_at
BEFORE UPDATE ON public.user_roadmap_progress
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();