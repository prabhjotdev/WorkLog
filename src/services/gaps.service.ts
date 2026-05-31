import { supabase } from '@/lib/supabase';
import type { KnowledgeGap, GapInsert, GapUpdate } from '@/types/app';

export async function fetchGaps(): Promise<KnowledgeGap[]> {
  const { data, error } = await supabase
    .from('knowledge_gaps')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
}

export async function createGap(gap: GapInsert): Promise<KnowledgeGap> {
  const { data, error } = await supabase.from('knowledge_gaps').insert(gap).select().single();
  if (error) throw error;
  return data;
}

export async function updateGap(id: string, updates: GapUpdate): Promise<KnowledgeGap> {
  const { data, error } = await supabase
    .from('knowledge_gaps')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteGap(id: string): Promise<void> {
  const { error } = await supabase.from('knowledge_gaps').delete().eq('id', id);
  if (error) throw error;
}
