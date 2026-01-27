// Database types for CodeCrack
export type CompanyCategory = 'FAANG' | 'Product' | 'Service' | 'Startup';
export type ProblemType = 'Coding' | 'Aptitude' | 'Behavioral' | 'GD';
export type DifficultyLevel = 'Easy' | 'Medium' | 'Hard';
export type SolveStatus = 'Solved' | 'Attempted' | 'Skipped';

export interface Company {
  id: string;
  name: string;
  category: CompanyCategory;
  logo_url?: string;
  description?: string;
  website_url?: string;
  created_at: string;
}

export interface Problem {
  id: string;
  title: string;
  description: string;
  problem_type: ProblemType;
  difficulty: DifficultyLevel;
  topic: string;
  subtopic?: string;
  tags: string[];
  time_limit_minutes?: number;
  solution?: string;
  explanation?: string;
  hints?: string[];
  shortcut_methods?: string;
  common_mistakes?: string[];
  sample_input?: string;
  sample_output?: string;
  constraints?: string;
  time_complexity?: string;
  space_complexity?: string;
  starter_code?: Record<string, string>;
  test_cases?: TestCase[];
  interview_frequency?: string;
  created_at: string;
  updated_at: string;
}

export interface TestCase {
  input: string;
  expected_output: string;
  is_hidden?: boolean;
}

export interface ProblemCompany {
  id: string;
  problem_id: string;
  company_id: string;
  year_asked?: number;
  frequency?: string;
  created_at: string;
}

export interface SolvedProblem {
  id: string;
  user_id: string;
  problem_id: string;
  status: SolveStatus;
  solution_language?: string;
  solution_code?: string;
  time_spent_minutes?: number;
  notes?: string;
  solved_at: string;
  updated_at: string;
}

export interface UserProgress {
  id: string;
  user_id: string;
  problem_type: ProblemType;
  topic: string;
  total_problems: number;
  solved_count: number;
  attempted_count: number;
  accuracy_percentage: number;
  avg_time_minutes?: number;
  last_activity: string;
  created_at: string;
  updated_at: string;
}

// Aptitude specific types
export interface AptitudeCategory {
  id: string;
  name: string;
  icon: string;
  topics: AptitudeTopic[];
  totalQuestions: number;
  solvedQuestions: number;
}

export interface AptitudeTopic {
  id: string;
  name: string;
  questions: number;
  solved: number;
  description: string;
}

// Behavioral specific types
export interface BehavioralCategory {
  id: string;
  name: string;
  icon: string;
  questions: BehavioralQuestion[];
}

export interface BehavioralQuestion {
  id: string;
  question: string;
  category: string;
  sampleAnswer: string;
  starAnswer: {
    situation: string;
    task: string;
    action: string;
    result: string;
  };
  tips: string[];
  commonMistakes: string[];
}

// GD specific types
export interface GDCategory {
  id: string;
  name: string;
  icon: string;
  topics: GDTopic[];
}

export interface GDTopic {
  id: string;
  title: string;
  category: string;
  introduction: string;
  supportingPoints: string[];
  opposingPoints: string[];
  realWorldExamples: string[];
  conclusion: string;
  doAndDonts: {
    dos: string[];
    donts: string[];
  };
  evaluationCriteria: string[];
}
