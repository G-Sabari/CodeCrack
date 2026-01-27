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
      companies: {
        Row: {
          category: Database["public"]["Enums"]["company_category"]
          created_at: string
          description: string | null
          id: string
          logo_url: string | null
          name: string
          website_url: string | null
        }
        Insert: {
          category: Database["public"]["Enums"]["company_category"]
          created_at?: string
          description?: string | null
          id?: string
          logo_url?: string | null
          name: string
          website_url?: string | null
        }
        Update: {
          category?: Database["public"]["Enums"]["company_category"]
          created_at?: string
          description?: string | null
          id?: string
          logo_url?: string | null
          name?: string
          website_url?: string | null
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
          interview_frequency: string | null
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
          interview_frequency?: string | null
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
          interview_frequency?: string | null
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
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
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
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
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
      company_category: ["FAANG", "Product", "Service", "Startup"],
      difficulty_level: ["Easy", "Medium", "Hard"],
      problem_type: ["Coding", "Aptitude", "Behavioral", "GD"],
      solve_status: ["Solved", "Attempted", "Skipped"],
    },
  },
} as const
