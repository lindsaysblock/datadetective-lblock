export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      analysis_results: {
        Row: {
          confidence: string | null
          created_at: string | null
          data: Json | null
          dataset_id: string
          description: string | null
          id: string
          title: string
          type: string
          user_id: string
        }
        Insert: {
          confidence?: string | null
          created_at?: string | null
          data?: Json | null
          dataset_id: string
          description?: string | null
          id?: string
          title: string
          type: string
          user_id: string
        }
        Update: {
          confidence?: string | null
          created_at?: string | null
          data?: Json | null
          dataset_id?: string
          description?: string | null
          id?: string
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "analysis_results_dataset_id_fkey"
            columns: ["dataset_id"]
            isOneToOne: false
            referencedRelation: "datasets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "analysis_results_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      analysis_sessions: {
        Row: {
          completed_at: string | null
          id: string
          insights: Json | null
          metadata: Json | null
          project_id: string
          recommendations: Json | null
          session_type: string
          sql_queries: Json | null
          started_at: string
          status: string
          user_id: string
          visualizations: Json | null
        }
        Insert: {
          completed_at?: string | null
          id?: string
          insights?: Json | null
          metadata?: Json | null
          project_id: string
          recommendations?: Json | null
          session_type?: string
          sql_queries?: Json | null
          started_at?: string
          status?: string
          user_id: string
          visualizations?: Json | null
        }
        Update: {
          completed_at?: string | null
          id?: string
          insights?: Json | null
          metadata?: Json | null
          project_id?: string
          recommendations?: Json | null
          session_type?: string
          sql_queries?: Json | null
          started_at?: string
          status?: string
          user_id?: string
          visualizations?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "analysis_sessions_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      datasets: {
        Row: {
          created_at: string | null
          file_size: number | null
          id: string
          metadata: Json | null
          mime_type: string | null
          name: string
          original_filename: string
          storage_path: string | null
          summary: Json | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          file_size?: number | null
          id?: string
          metadata?: Json | null
          mime_type?: string | null
          name: string
          original_filename: string
          storage_path?: string | null
          summary?: Json | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          file_size?: number | null
          id?: string
          metadata?: Json | null
          mime_type?: string | null
          name?: string
          original_filename?: string
          storage_path?: string | null
          summary?: Json | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "datasets_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string | null
          full_name: string | null
          id: string
          preferences: Json | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id: string
          preferences?: Json | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string | null
          full_name?: string | null
          id?: string
          preferences?: Json | null
          updated_at?: string | null
        }
        Relationships: []
      }
      project_files: {
        Row: {
          column_mapping: Json | null
          created_at: string
          file_size: number
          filename: string
          id: string
          mime_type: string
          original_filename: string
          parsed_data: Json | null
          processed_at: string | null
          project_id: string
          storage_path: string
        }
        Insert: {
          column_mapping?: Json | null
          created_at?: string
          file_size: number
          filename: string
          id?: string
          mime_type: string
          original_filename: string
          parsed_data?: Json | null
          processed_at?: string | null
          project_id: string
          storage_path: string
        }
        Update: {
          column_mapping?: Json | null
          created_at?: string
          file_size?: number
          filename?: string
          id?: string
          mime_type?: string
          original_filename?: string
          parsed_data?: Json | null
          processed_at?: string | null
          project_id?: string
          storage_path?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_files_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects"
            referencedColumns: ["id"]
          },
        ]
      }
      projects: {
        Row: {
          business_context: string | null
          created_at: string
          id: string
          metadata: Json | null
          mode: string
          name: string
          research_question: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          business_context?: string | null
          created_at?: string
          id?: string
          metadata?: Json | null
          mode?: string
          name: string
          research_question: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          business_context?: string | null
          created_at?: string
          id?: string
          metadata?: Json | null
          mode?: string
          name?: string
          research_question?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      research_questions: {
        Row: {
          analysis_session_id: string
          answer: string | null
          answered_at: string | null
          asked_at: string
          confidence_level: string | null
          id: string
          question: string
          sql_query: string | null
          visualization_data: Json | null
        }
        Insert: {
          analysis_session_id: string
          answer?: string | null
          answered_at?: string | null
          asked_at?: string
          confidence_level?: string | null
          id?: string
          question: string
          sql_query?: string | null
          visualization_data?: Json | null
        }
        Update: {
          analysis_session_id?: string
          answer?: string | null
          answered_at?: string | null
          asked_at?: string
          confidence_level?: string | null
          id?: string
          question?: string
          sql_query?: string | null
          visualization_data?: Json | null
        }
        Relationships: [
          {
            foreignKeyName: "research_questions_analysis_session_id_fkey"
            columns: ["analysis_session_id"]
            isOneToOne: false
            referencedRelation: "analysis_sessions"
            referencedColumns: ["id"]
          },
        ]
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
