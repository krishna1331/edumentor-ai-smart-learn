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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      daily_reports: {
        Row: {
          created_at: string | null
          doubts_posted: number | null
          doubts_solved: number | null
          id: string
          mcqs_attempted: number | null
          mcqs_correct: number | null
          report_data: Json | null
          report_date: string
          study_time: number | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          doubts_posted?: number | null
          doubts_solved?: number | null
          id?: string
          mcqs_attempted?: number | null
          mcqs_correct?: number | null
          report_data?: Json | null
          report_date: string
          study_time?: number | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          doubts_posted?: number | null
          doubts_solved?: number | null
          id?: string
          mcqs_attempted?: number | null
          mcqs_correct?: number | null
          report_data?: Json | null
          report_date?: string
          study_time?: number | null
          user_id?: string
        }
        Relationships: []
      }
      doubt_replies: {
        Row: {
          created_at: string | null
          doubt_id: string
          id: string
          is_solution: boolean | null
          reply: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          doubt_id: string
          id?: string
          is_solution?: boolean | null
          reply: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          doubt_id?: string
          id?: string
          is_solution?: boolean | null
          reply?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "doubt_replies_doubt_id_fkey"
            columns: ["doubt_id"]
            isOneToOne: false
            referencedRelation: "doubts"
            referencedColumns: ["id"]
          },
        ]
      }
      doubts: {
        Row: {
          created_at: string | null
          description: string
          id: string
          status: string | null
          subject: string
          title: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          description: string
          id?: string
          status?: string | null
          subject: string
          title: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          description?: string
          id?: string
          status?: string | null
          subject?: string
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      materials: {
        Row: {
          created_at: string | null
          description: string | null
          downloads: number | null
          file_type: string | null
          file_url: string
          id: string
          subject: string | null
          title: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          downloads?: number | null
          file_type?: string | null
          file_url: string
          id?: string
          subject?: string | null
          title: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          downloads?: number | null
          file_type?: string | null
          file_url?: string
          id?: string
          subject?: string | null
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      mcq_attempts: {
        Row: {
          attempted_at: string | null
          id: string
          is_correct: boolean
          question_id: string
          selected_answer: string
          user_id: string
        }
        Insert: {
          attempted_at?: string | null
          id?: string
          is_correct: boolean
          question_id: string
          selected_answer: string
          user_id: string
        }
        Update: {
          attempted_at?: string | null
          id?: string
          is_correct?: boolean
          question_id?: string
          selected_answer?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "mcq_attempts_question_id_fkey"
            columns: ["question_id"]
            isOneToOne: false
            referencedRelation: "mcq_questions"
            referencedColumns: ["id"]
          },
        ]
      }
      mcq_questions: {
        Row: {
          correct_answer: string
          created_at: string | null
          id: string
          options: Json
          question: string
          subject: string
          user_id: string
        }
        Insert: {
          correct_answer: string
          created_at?: string | null
          id?: string
          options: Json
          question: string
          subject: string
          user_id: string
        }
        Update: {
          correct_answer?: string
          created_at?: string | null
          id?: string
          options?: Json
          question?: string
          subject?: string
          user_id?: string
        }
        Relationships: []
      }
      note_summaries: {
        Row: {
          created_at: string | null
          id: string
          note_id: string
          summary: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          note_id: string
          summary: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          note_id?: string
          summary?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "note_summaries_note_id_fkey"
            columns: ["note_id"]
            isOneToOne: false
            referencedRelation: "notes"
            referencedColumns: ["id"]
          },
        ]
      }
      notes: {
        Row: {
          created_at: string | null
          file_type: string | null
          file_url: string | null
          id: string
          title: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          file_type?: string | null
          file_url?: string | null
          id?: string
          title: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          file_type?: string | null
          file_url?: string | null
          id?: string
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          full_name: string | null
          id: string
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          full_name?: string | null
          id: string
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      study_plans: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          plan_data: Json
          title: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          plan_data: Json
          title: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          plan_data?: Json
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      study_sessions: {
        Row: {
          completed_at: string | null
          duration: number
          id: string
          subject: string | null
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          duration: number
          id?: string
          subject?: string | null
          user_id: string
        }
        Update: {
          completed_at?: string | null
          duration?: number
          id?: string
          subject?: string | null
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
      [_ in never]: never
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
    Enums: {},
  },
} as const
