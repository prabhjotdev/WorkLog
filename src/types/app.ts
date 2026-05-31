/**
 * UI-level derived types. These re-export or narrow the raw DB row types for
 * convenient use in components and Redux slices.
 */

import type { Database } from './database';

export type Profile = Database['public']['Tables']['profiles']['Row'];
export type Sprint = Database['public']['Tables']['sprints']['Row'];
export type Task = Database['public']['Tables']['tasks']['Row'];
export type KnowledgeGap = Database['public']['Tables']['knowledge_gaps']['Row'];
export type SprintVelocityRow =
  Database['public']['Functions']['get_sprint_velocity']['Returns'][number];

export type TaskInsert = Database['public']['Tables']['tasks']['Insert'];
export type TaskUpdate = Database['public']['Tables']['tasks']['Update'];
export type SprintInsert = Database['public']['Tables']['sprints']['Insert'];
export type SprintUpdate = Database['public']['Tables']['sprints']['Update'];
export type GapInsert = Database['public']['Tables']['knowledge_gaps']['Insert'];
export type GapUpdate = Database['public']['Tables']['knowledge_gaps']['Update'];
export type ProfileUpdate = Database['public']['Tables']['profiles']['Update'];
