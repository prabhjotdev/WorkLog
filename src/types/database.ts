/**
 * Hand-written Supabase DB types. Replace with generated output once a
 * Supabase project is linked:  npm run gen:types
 */

export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          display_name: string | null;
          role: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          display_name?: string | null;
          role?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          display_name?: string | null;
          role?: string | null;
          updated_at?: string;
        };
      };
      sprints: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          goal: string | null;
          status: 'planned' | 'active' | 'completed';
          start_date: string | null;
          end_date: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          goal?: string | null;
          status?: 'planned' | 'active' | 'completed';
          start_date?: string | null;
          end_date?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          name?: string;
          goal?: string | null;
          status?: 'planned' | 'active' | 'completed';
          start_date?: string | null;
          end_date?: string | null;
          updated_at?: string;
        };
      };
      tasks: {
        Row: {
          id: string;
          user_id: string;
          sprint_id: string | null;
          title: string;
          description: string | null;
          status: 'todo' | 'in_progress' | 'done' | 'blocked';
          priority: 'low' | 'medium' | 'high' | 'critical';
          tags: string[];
          story_points: number;
          due_date: string | null;
          completed_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          sprint_id?: string | null;
          title: string;
          description?: string | null;
          status?: 'todo' | 'in_progress' | 'done' | 'blocked';
          priority?: 'low' | 'medium' | 'high' | 'critical';
          tags?: string[];
          story_points?: number;
          due_date?: string | null;
          completed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          sprint_id?: string | null;
          title?: string;
          description?: string | null;
          status?: 'todo' | 'in_progress' | 'done' | 'blocked';
          priority?: 'low' | 'medium' | 'high' | 'critical';
          tags?: string[];
          story_points?: number;
          due_date?: string | null;
          completed_at?: string | null;
          updated_at?: string;
        };
      };
      knowledge_gaps: {
        Row: {
          id: string;
          user_id: string;
          task_id: string | null;
          title: string;
          description: string | null;
          category: string | null;
          recurrence: number;
          resolved: boolean;
          resolved_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          task_id?: string | null;
          title: string;
          description?: string | null;
          category?: string | null;
          recurrence?: number;
          resolved?: boolean;
          resolved_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          task_id?: string | null;
          title?: string;
          description?: string | null;
          category?: string | null;
          recurrence?: number;
          resolved?: boolean;
          resolved_at?: string | null;
          updated_at?: string;
        };
      };
    };
    Functions: {
      get_sprint_velocity: {
        Args: { p_user_id: string };
        Returns: {
          sprint_id: string;
          sprint_name: string;
          tasks_total: number;
          tasks_done: number;
          points_total: number;
          points_done: number;
          completion_pct: number;
        }[];
      };
    };
  };
}
