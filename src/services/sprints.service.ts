import { supabase } from '@/lib/supabase';
import type { Sprint, SprintInsert, SprintUpdate, SprintVelocityRow } from '@/types/app';

export async function fetchSprints(): Promise<Sprint[]> {
  const { data, error } = await supabase
    .from('sprints')
    .select('*')
    .order('start_date', { ascending: false, nullsFirst: false })
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function createSprint(sprint: SprintInsert): Promise<Sprint> {
  const { data, error } = await supabase.from('sprints').insert(sprint).select().single();
  if (error) throw error;
  return data;
}

export async function updateSprint(id: string, updates: SprintUpdate): Promise<Sprint> {
  const { data, error } = await supabase
    .from('sprints')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteSprint(id: string): Promise<void> {
  const { error } = await supabase.from('sprints').delete().eq('id', id);
  if (error) throw error;
}

export async function fetchVelocity(userId: string): Promise<SprintVelocityRow[]> {
  const { data, error } = await supabase.rpc('get_sprint_velocity', { p_user_id: userId });
  if (error) throw error;
  return data;
}
