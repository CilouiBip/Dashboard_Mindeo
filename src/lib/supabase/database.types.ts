export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      okr_sessions: {
        Row: {
          id: string
          name: string
          description: string | null
          status: 'active' | 'completed' | 'archived'
          start_date: string | null
          end_date: string | null
          vision_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['okr_sessions']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['okr_sessions']['Row']>
      }
      objectives: {
        Row: {
          id: string
          session_id: string
          title: string
          description: string | null
          status: 'active' | 'completed' | 'cancelled'
          priority: number | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['objectives']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['objectives']['Row']>
      }
      key_results: {
        Row: {
          id: string
          objective_id: string
          kr_name: string
          description: string | null
          target_value: number
          baseline_value: number | null
          current: number
          target_unit: string
          status: 'active' | 'completed' | 'at_risk'
          start_date: string | null
          due_date: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['key_results']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['key_results']['Row']>
      }
      initiatives: {
        Row: {
          id: string
          key_result_id: string
          title: string
          description: string | null
          status: 'todo' | 'in_progress' | 'done'
          priority: number | null
          start_date: string | null
          due_date: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['initiatives']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['initiatives']['Row']>
      }
      vision: {
        Row: {
          id: string
          vision_text: string
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['vision']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['vision']['Row']>
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      okr_session_status: 'active' | 'completed' | 'archived'
      objective_status: 'active' | 'completed' | 'cancelled'
      key_result_status: 'active' | 'completed' | 'at_risk'
      initiative_status: 'todo' | 'in_progress' | 'done'
    }
  }
}
