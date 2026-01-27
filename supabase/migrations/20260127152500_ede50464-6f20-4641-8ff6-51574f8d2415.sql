-- Create enums for better type safety
CREATE TYPE public.company_category AS ENUM ('FAANG', 'Product', 'Service', 'Startup');
CREATE TYPE public.problem_type AS ENUM ('Coding', 'Aptitude', 'Behavioral', 'GD');
CREATE TYPE public.difficulty_level AS ENUM ('Easy', 'Medium', 'Hard');
CREATE TYPE public.solve_status AS ENUM ('Solved', 'Attempted', 'Skipped');

-- Companies table
CREATE TABLE public.companies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  category company_category NOT NULL,
  logo_url TEXT,
  description TEXT,
  website_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create index on company name for fast lookups
CREATE INDEX idx_companies_name ON public.companies(name);
CREATE INDEX idx_companies_category ON public.companies(category);

-- Enable RLS on companies (public read, admin write)
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view companies"
ON public.companies FOR SELECT
USING (true);

-- Problems table (covers all problem types)
CREATE TABLE public.problems (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  problem_type problem_type NOT NULL,
  difficulty difficulty_level NOT NULL DEFAULT 'Medium',
  topic TEXT NOT NULL,
  subtopic TEXT,
  tags TEXT[] DEFAULT '{}',
  time_limit_minutes INTEGER,
  solution TEXT,
  explanation TEXT,
  hints TEXT[],
  shortcut_methods TEXT,
  common_mistakes TEXT[],
  sample_input TEXT,
  sample_output TEXT,
  constraints TEXT,
  time_complexity TEXT,
  space_complexity TEXT,
  starter_code JSONB DEFAULT '{}',
  test_cases JSONB DEFAULT '[]',
  interview_frequency TEXT DEFAULT 'Occasionally',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create indexes for common queries
CREATE INDEX idx_problems_type ON public.problems(problem_type);
CREATE INDEX idx_problems_difficulty ON public.problems(difficulty);
CREATE INDEX idx_problems_topic ON public.problems(topic);
CREATE INDEX idx_problems_type_topic ON public.problems(problem_type, topic);

-- Enable RLS on problems (public read)
ALTER TABLE public.problems ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view problems"
ON public.problems FOR SELECT
USING (true);

-- Problem-Company mapping (many-to-many)
CREATE TABLE public.problem_companies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  problem_id UUID NOT NULL REFERENCES public.problems(id) ON DELETE CASCADE,
  company_id UUID NOT NULL REFERENCES public.companies(id) ON DELETE CASCADE,
  year_asked INTEGER,
  frequency TEXT DEFAULT 'Occasionally',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(problem_id, company_id)
);

CREATE INDEX idx_problem_companies_problem ON public.problem_companies(problem_id);
CREATE INDEX idx_problem_companies_company ON public.problem_companies(company_id);

ALTER TABLE public.problem_companies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view problem-company mappings"
ON public.problem_companies FOR SELECT
USING (true);

-- Solved problems tracking
CREATE TABLE public.solved_problems (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  problem_id UUID NOT NULL REFERENCES public.problems(id) ON DELETE CASCADE,
  status solve_status NOT NULL DEFAULT 'Attempted',
  solution_language TEXT,
  solution_code TEXT,
  time_spent_minutes INTEGER,
  notes TEXT,
  solved_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, problem_id)
);

CREATE INDEX idx_solved_problems_user ON public.solved_problems(user_id);
CREATE INDEX idx_solved_problems_problem ON public.solved_problems(problem_id);
CREATE INDEX idx_solved_problems_status ON public.solved_problems(status);

ALTER TABLE public.solved_problems ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own solved problems"
ON public.solved_problems FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own solved problems"
ON public.solved_problems FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own solved problems"
ON public.solved_problems FOR UPDATE
USING (auth.uid() = user_id);

-- User progress tracking
CREATE TABLE public.user_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  problem_type problem_type NOT NULL,
  topic TEXT NOT NULL,
  total_problems INTEGER NOT NULL DEFAULT 0,
  solved_count INTEGER NOT NULL DEFAULT 0,
  attempted_count INTEGER NOT NULL DEFAULT 0,
  accuracy_percentage DECIMAL(5,2) DEFAULT 0,
  avg_time_minutes DECIMAL(5,2),
  last_activity TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, problem_type, topic)
);

CREATE INDEX idx_user_progress_user ON public.user_progress(user_id);
CREATE INDEX idx_user_progress_type ON public.user_progress(problem_type);

ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own progress"
ON public.user_progress FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own progress"
ON public.user_progress FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own progress"
ON public.user_progress FOR UPDATE
USING (auth.uid() = user_id);

-- Trigger to update updated_at columns
CREATE TRIGGER update_problems_updated_at
BEFORE UPDATE ON public.problems
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_solved_problems_updated_at
BEFORE UPDATE ON public.solved_problems
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_progress_updated_at
BEFORE UPDATE ON public.user_progress
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();