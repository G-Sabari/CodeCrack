export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      aptitude_attempts: {
        Row: {
          accuracy: number
          answers: Json | null
          category: string
          correct_count: number
          created_at: string
          id: string
          score: number
          skipped_count: number
          time_taken_seconds: number
          topic: string | null
          total_questions: number
          user_id: string
          wrong_count: number
          xp_earned: number
        }
        Insert: {
          accuracy: number
          answers?: Json | null
          category: string
          correct_count: number
          created_at?: string
          id?: string
          score: number
          skipped_count?: number
          time_taken_seconds?: number
          topic?: string | null
          total_questions: number
          user_id: string
          wrong_count: number
          xp_earned?: number
        }
        Update: {
          accuracy?: number
          answers?: Json | null
          category?: string
          correct_count?: number
          created_at?: string
          id?: string
          score?: number
          skipped_count?: number
          time_taken_seconds?: number
          topic?: string | null
          total_questions?: number
          user_id?: string
          wrong_count?: number
          xp_earned?: number
        }
        Relationships: []
      }
      certificate_rules: {
        Row: {
          auto_generate: boolean
          citation_prompt: string | null
          contest_id: string
          created_at: string
          enabled: boolean
          id: string
          min_score: number
          participation_enabled: boolean
          pass_percentage: number
          top_n: number
          updated_at: string
        }
        Insert: {
          auto_generate?: boolean
          citation_prompt?: string | null
          contest_id: string
          created_at?: string
          enabled?: boolean
          id?: string
          min_score?: number
          participation_enabled?: boolean
          pass_percentage?: number
          top_n?: number
          updated_at?: string
        }
        Update: {
          auto_generate?: boolean
          citation_prompt?: string | null
          contest_id?: string
          created_at?: string
          enabled?: boolean
          id?: string
          min_score?: number
          participation_enabled?: boolean
          pass_percentage?: number
          top_n?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "certificate_rules_contest_id_fkey"
            columns: ["contest_id"]
            isOneToOne: true
            referencedRelation: "contests"
            referencedColumns: ["id"]
          },
        ]
      }
      certificates: {
        Row: {
          accuracy: number
          admin_comment: string | null
          approved_at: string | null
          approved_by: string | null
          certificate_type: string
          citation: string | null
          code: string
          contest_id: string | null
          contest_title: string
          download_count: number
          eligibility: Json | null
          generated_by: string | null
          id: string
          issued_at: string
          percentage: number
          rank: number
          recipient_name: string
          rejected_reason: string | null
          reviewed_at: string | null
          reviewed_by: string | null
          score: number
          shared_count: number
          status: string
          total_points: number
          user_id: string
        }
        Insert: {
          accuracy?: number
          admin_comment?: string | null
          approved_at?: string | null
          approved_by?: string | null
          certificate_type?: string
          citation?: string | null
          code: string
          contest_id?: string | null
          contest_title: string
          download_count?: number
          eligibility?: Json | null
          generated_by?: string | null
          id?: string
          issued_at?: string
          percentage?: number
          rank: number
          recipient_name: string
          rejected_reason?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          score: number
          shared_count?: number
          status?: string
          total_points: number
          user_id: string
        }
        Update: {
          accuracy?: number
          admin_comment?: string | null
          approved_at?: string | null
          approved_by?: string | null
          certificate_type?: string
          citation?: string | null
          code?: string
          contest_id?: string | null
          contest_title?: string
          download_count?: number
          eligibility?: Json | null
          generated_by?: string | null
          id?: string
          issued_at?: string
          percentage?: number
          rank?: number
          recipient_name?: string
          rejected_reason?: string | null
          reviewed_at?: string | null
          reviewed_by?: string | null
          score?: number
          shared_count?: number
          status?: string
          total_points?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "certificates_contest_id_fkey"
            columns: ["contest_id"]
            isOneToOne: false
            referencedRelation: "contests"
            referencedColumns: ["id"]
          },
        ]
      }
      companies: {
        Row: {
          category: Database["public"]["Enums"]["company_category"]
          common_roles: string[] | null
          created_at: string
          description: string | null
          difficulty_level: string | null
          hiring_pattern: string[] | null
          hr_round_details: string | null
          id: string
          interview_experience_count: number | null
          logo_url: string | null
          name: string
          online_test_details: string | null
          preparation_tips: string[] | null
          technical_rounds_details: string | null
          website_url: string | null
        }
        Insert: {
          category: Database["public"]["Enums"]["company_category"]
          common_roles?: string[] | null
          created_at?: string
          description?: string | null
          difficulty_level?: string | null
          hiring_pattern?: string[] | null
          hr_round_details?: string | null
          id?: string
          interview_experience_count?: number | null
          logo_url?: string | null
          name: string
          online_test_details?: string | null
          preparation_tips?: string[] | null
          technical_rounds_details?: string | null
          website_url?: string | null
        }
        Update: {
          category?: Database["public"]["Enums"]["company_category"]
          common_roles?: string[] | null
          created_at?: string
          description?: string | null
          difficulty_level?: string | null
          hiring_pattern?: string[] | null
          hr_round_details?: string | null
          id?: string
          interview_experience_count?: number | null
          logo_url?: string | null
          name?: string
          online_test_details?: string | null
          preparation_tips?: string[] | null
          technical_rounds_details?: string | null
          website_url?: string | null
        }
        Relationships: []
      }
      contest_problems: {
        Row: {
          contest_id: string
          created_at: string
          id: string
          points: number
          problem_id: string
          problem_order: number
        }
        Insert: {
          contest_id: string
          created_at?: string
          id?: string
          points?: number
          problem_id: string
          problem_order?: number
        }
        Update: {
          contest_id?: string
          created_at?: string
          id?: string
          points?: number
          problem_id?: string
          problem_order?: number
        }
        Relationships: [
          {
            foreignKeyName: "contest_problems_contest_id_fkey"
            columns: ["contest_id"]
            isOneToOne: false
            referencedRelation: "contests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contest_problems_problem_id_fkey"
            columns: ["problem_id"]
            isOneToOne: false
            referencedRelation: "problems"
            referencedColumns: ["id"]
          },
        ]
      }
      contest_registrations: {
        Row: {
          contest_id: string
          id: string
          registered_at: string
          started_at: string | null
          user_id: string
        }
        Insert: {
          contest_id: string
          id?: string
          registered_at?: string
          started_at?: string | null
          user_id: string
        }
        Update: {
          contest_id?: string
          id?: string
          registered_at?: string
          started_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "contest_registrations_contest_id_fkey"
            columns: ["contest_id"]
            isOneToOne: false
            referencedRelation: "contests"
            referencedColumns: ["id"]
          },
        ]
      }
      contest_submissions: {
        Row: {
          code: string
          contest_id: string
          id: string
          language: string
          passed_count: number
          problem_id: string
          runtime_ms: number | null
          score: number
          status: string
          submitted_at: string
          total_count: number
          user_id: string
        }
        Insert: {
          code: string
          contest_id: string
          id?: string
          language: string
          passed_count?: number
          problem_id: string
          runtime_ms?: number | null
          score?: number
          status?: string
          submitted_at?: string
          total_count?: number
          user_id: string
        }
        Update: {
          code?: string
          contest_id?: string
          id?: string
          language?: string
          passed_count?: number
          problem_id?: string
          runtime_ms?: number | null
          score?: number
          status?: string
          submitted_at?: string
          total_count?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "contest_submissions_contest_id_fkey"
            columns: ["contest_id"]
            isOneToOne: false
            referencedRelation: "contests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "contest_submissions_problem_id_fkey"
            columns: ["problem_id"]
            isOneToOne: false
            referencedRelation: "problems"
            referencedColumns: ["id"]
          },
        ]
      }
      contests: {
        Row: {
          banner_gradient: string | null
          category: string
          created_at: string
          description: string | null
          duration_minutes: number
          end_time: string
          finalized_at: string | null
          id: string
          slug: string
          start_time: string
          status: string
          title: string
          total_points: number
          updated_at: string
          week_number: number | null
          year: number | null
        }
        Insert: {
          banner_gradient?: string | null
          category?: string
          created_at?: string
          description?: string | null
          duration_minutes?: number
          end_time: string
          finalized_at?: string | null
          id?: string
          slug: string
          start_time: string
          status?: string
          title: string
          total_points?: number
          updated_at?: string
          week_number?: number | null
          year?: number | null
        }
        Update: {
          banner_gradient?: string | null
          category?: string
          created_at?: string
          description?: string | null
          duration_minutes?: number
          end_time?: string
          finalized_at?: string | null
          id?: string
          slug?: string
          start_time?: string
          status?: string
          title?: string
          total_points?: number
          updated_at?: string
          week_number?: number | null
          year?: number | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          body: string | null
          created_at: string
          data: Json | null
          id: string
          read_at: string | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          body?: string | null
          created_at?: string
          data?: Json | null
          id?: string
          read_at?: string | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          body?: string | null
          created_at?: string
          data?: Json | null
          id?: string
          read_at?: string | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      practice_submissions: {
        Row: {
          code: string
          difficulty: string | null
          id: string
          language: string
          passed_count: number
          problem_slug: string
          problem_title: string
          runtime_ms: number | null
          submitted_at: string
          total_count: number
          user_id: string
          verdict: string
        }
        Insert: {
          code: string
          difficulty?: string | null
          id?: string
          language: string
          passed_count?: number
          problem_slug: string
          problem_title: string
          runtime_ms?: number | null
          submitted_at?: string
          total_count?: number
          user_id: string
          verdict: string
        }
        Update: {
          code?: string
          difficulty?: string | null
          id?: string
          language?: string
          passed_count?: number
          problem_slug?: string
          problem_title?: string
          runtime_ms?: number | null
          submitted_at?: string
          total_count?: number
          user_id?: string
          verdict?: string
        }
        Relationships: []
      }
      preparation_roadmaps: {
        Row: {
          created_at: string
          daily_plan: Json
          description: string | null
          duration_days: number
          id: string
          target_track: string
          title: string
          topics: Json
          updated_at: string
          weekly_goals: Json
        }
        Insert: {
          created_at?: string
          daily_plan?: Json
          description?: string | null
          duration_days: number
          id?: string
          target_track?: string
          title: string
          topics?: Json
          updated_at?: string
          weekly_goals?: Json
        }
        Update: {
          created_at?: string
          daily_plan?: Json
          description?: string | null
          duration_days?: number
          id?: string
          target_track?: string
          title?: string
          topics?: Json
          updated_at?: string
          weekly_goals?: Json
        }
        Relationships: []
      }
      problem_companies: {
        Row: {
          company_id: string
          created_at: string
          frequency: string | null
          id: string
          problem_id: string
          year_asked: number | null
        }
        Insert: {
          company_id: string
          created_at?: string
          frequency?: string | null
          id?: string
          problem_id: string
          year_asked?: number | null
        }
        Update: {
          company_id?: string
          created_at?: string
          frequency?: string | null
          id?: string
          problem_id?: string
          year_asked?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "problem_companies_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "problem_companies_problem_id_fkey"
            columns: ["problem_id"]
            isOneToOne: false
            referencedRelation: "problems"
            referencedColumns: ["id"]
          },
        ]
      }
      problems: {
        Row: {
          common_mistakes: string[] | null
          constraints: string | null
          created_at: string
          description: string
          difficulty: Database["public"]["Enums"]["difficulty_level"]
          explanation: string | null
          hints: string[] | null
          id: string
          input_format: string | null
          interview_frequency: string | null
          output_format: string | null
          problem_type: Database["public"]["Enums"]["problem_type"]
          sample_input: string | null
          sample_output: string | null
          shortcut_methods: string | null
          solution: string | null
          space_complexity: string | null
          starter_code: Json | null
          subtopic: string | null
          tags: string[] | null
          test_cases: Json | null
          time_complexity: string | null
          time_limit_minutes: number | null
          title: string
          topic: string
          updated_at: string
        }
        Insert: {
          common_mistakes?: string[] | null
          constraints?: string | null
          created_at?: string
          description: string
          difficulty?: Database["public"]["Enums"]["difficulty_level"]
          explanation?: string | null
          hints?: string[] | null
          id?: string
          input_format?: string | null
          interview_frequency?: string | null
          output_format?: string | null
          problem_type: Database["public"]["Enums"]["problem_type"]
          sample_input?: string | null
          sample_output?: string | null
          shortcut_methods?: string | null
          solution?: string | null
          space_complexity?: string | null
          starter_code?: Json | null
          subtopic?: string | null
          tags?: string[] | null
          test_cases?: Json | null
          time_complexity?: string | null
          time_limit_minutes?: number | null
          title: string
          topic: string
          updated_at?: string
        }
        Update: {
          common_mistakes?: string[] | null
          constraints?: string | null
          created_at?: string
          description?: string
          difficulty?: Database["public"]["Enums"]["difficulty_level"]
          explanation?: string | null
          hints?: string[] | null
          id?: string
          input_format?: string | null
          interview_frequency?: string | null
          output_format?: string | null
          problem_type?: Database["public"]["Enums"]["problem_type"]
          sample_input?: string | null
          sample_output?: string | null
          shortcut_methods?: string | null
          solution?: string | null
          space_complexity?: string | null
          starter_code?: Json | null
          subtopic?: string | null
          tags?: string[] | null
          test_cases?: Json | null
          time_complexity?: string | null
          time_limit_minutes?: number | null
          title?: string
          topic?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          college_name: string | null
          created_at: string
          department: string | null
          email: string | null
          full_name: string | null
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          college_name?: string | null
          created_at?: string
          department?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          college_name?: string | null
          created_at?: string
          department?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      pyq_questions: {
        Row: {
          company_id: string | null
          created_at: string
          difficulty: string
          explanation: string | null
          hints: string[] | null
          id: string
          question: string
          question_type: string
          solution: string | null
          subtopic: string | null
          tags: string[] | null
          topic: string
          updated_at: string
          year: number
        }
        Insert: {
          company_id?: string | null
          created_at?: string
          difficulty?: string
          explanation?: string | null
          hints?: string[] | null
          id?: string
          question: string
          question_type?: string
          solution?: string | null
          subtopic?: string | null
          tags?: string[] | null
          topic: string
          updated_at?: string
          year: number
        }
        Update: {
          company_id?: string | null
          created_at?: string
          difficulty?: string
          explanation?: string | null
          hints?: string[] | null
          id?: string
          question?: string
          question_type?: string
          solution?: string | null
          subtopic?: string | null
          tags?: string[] | null
          topic?: string
          updated_at?: string
          year?: number
        }
        Relationships: [
          {
            foreignKeyName: "pyq_questions_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      resume_analyses: {
        Row: {
          analysis: Json | null
          ats_score: number | null
          created_at: string
          file_name: string | null
          file_path: string | null
          id: string
          job_description: string | null
          match_score: number | null
          resume_text: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          analysis?: Json | null
          ats_score?: number | null
          created_at?: string
          file_name?: string | null
          file_path?: string | null
          id?: string
          job_description?: string | null
          match_score?: number | null
          resume_text?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          analysis?: Json | null
          ats_score?: number | null
          created_at?: string
          file_name?: string | null
          file_path?: string | null
          id?: string
          job_description?: string | null
          match_score?: number | null
          resume_text?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      resume_chats: {
        Row: {
          analysis_id: string | null
          content: string
          created_at: string
          id: string
          role: string
          user_id: string
        }
        Insert: {
          analysis_id?: string | null
          content: string
          created_at?: string
          id?: string
          role: string
          user_id: string
        }
        Update: {
          analysis_id?: string | null
          content?: string
          created_at?: string
          id?: string
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "resume_chats_analysis_id_fkey"
            columns: ["analysis_id"]
            isOneToOne: false
            referencedRelation: "resume_analyses"
            referencedColumns: ["id"]
          },
        ]
      }
      resume_versions: {
        Row: {
          content: Json
          created_at: string
          id: string
          template: string
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content?: Json
          created_at?: string
          id?: string
          template?: string
          title?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: Json
          created_at?: string
          id?: string
          template?: string
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      solved_problems: {
        Row: {
          id: string
          notes: string | null
          problem_id: string
          solution_code: string | null
          solution_language: string | null
          solved_at: string
          status: Database["public"]["Enums"]["solve_status"]
          time_spent_minutes: number | null
          updated_at: string
          user_id: string
        }
        Insert: {
          id?: string
          notes?: string | null
          problem_id: string
          solution_code?: string | null
          solution_language?: string | null
          solved_at?: string
          status?: Database["public"]["Enums"]["solve_status"]
          time_spent_minutes?: number | null
          updated_at?: string
          user_id: string
        }
        Update: {
          id?: string
          notes?: string | null
          problem_id?: string
          solution_code?: string | null
          solution_language?: string | null
          solved_at?: string
          status?: Database["public"]["Enums"]["solve_status"]
          time_spent_minutes?: number | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "solved_problems_problem_id_fkey"
            columns: ["problem_id"]
            isOneToOne: false
            referencedRelation: "problems"
            referencedColumns: ["id"]
          },
        ]
      }
      user_progress: {
        Row: {
          accuracy_percentage: number | null
          attempted_count: number
          avg_time_minutes: number | null
          created_at: string
          id: string
          last_activity: string | null
          problem_type: Database["public"]["Enums"]["problem_type"]
          solved_count: number
          topic: string
          total_problems: number
          updated_at: string
          user_id: string
        }
        Insert: {
          accuracy_percentage?: number | null
          attempted_count?: number
          avg_time_minutes?: number | null
          created_at?: string
          id?: string
          last_activity?: string | null
          problem_type: Database["public"]["Enums"]["problem_type"]
          solved_count?: number
          topic: string
          total_problems?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          accuracy_percentage?: number | null
          attempted_count?: number
          avg_time_minutes?: number | null
          created_at?: string
          id?: string
          last_activity?: string | null
          problem_type?: Database["public"]["Enums"]["problem_type"]
          solved_count?: number
          topic?: string
          total_problems?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roadmap_progress: {
        Row: {
          completed_days: number[] | null
          created_at: string
          current_day: number | null
          id: string
          last_activity: string | null
          roadmap_id: string | null
          started_at: string
          updated_at: string
          user_id: string
        }
        Insert: {
          completed_days?: number[] | null
          created_at?: string
          current_day?: number | null
          id?: string
          last_activity?: string | null
          roadmap_id?: string | null
          started_at?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          completed_days?: number[] | null
          created_at?: string
          current_day?: number | null
          id?: string
          last_activity?: string | null
          roadmap_id?: string | null
          started_at?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_roadmap_progress_roadmap_id_fkey"
            columns: ["roadmap_id"]
            isOneToOne: false
            referencedRelation: "preparation_roadmaps"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      claim_first_admin: { Args: never; Returns: boolean }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      increment_certificate_download: {
        Args: { _code: string }
        Returns: undefined
      }
      increment_certificate_share: {
        Args: { _code: string }
        Returns: undefined
      }
      is_admin: { Args: never; Returns: boolean }
    }
    Enums: {
      app_role: "admin" | "moderator" | "user"
      company_category: "FAANG" | "Product" | "Service" | "Startup"
      difficulty_level: "Easy" | "Medium" | "Hard"
      problem_type: "Coding" | "Aptitude" | "Behavioral" | "GD"
      solve_status: "Solved" | "Attempted" | "Skipped"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "moderator", "user"],
      company_category: ["FAANG", "Product", "Service", "Startup"],
      difficulty_level: ["Easy", "Medium", "Hard"],
      problem_type: ["Coding", "Aptitude", "Behavioral", "GD"],
      solve_status: ["Solved", "Attempted", "Skipped"],
    },
  },
} as const
