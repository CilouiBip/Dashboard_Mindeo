import { supabase } from '../client';

export interface Memory {
  id: string;
  session_id: string;
  role: string;
  content: string;
  created_at: string;
}

export async function getAll() {
  const { data, error } = await supabase
    .from('memory')
    .select('*')
    .order('created_at', { ascending: false });

  return { data, error };
}

export async function create(memory: Omit<Memory, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('memory')
    .insert([memory])
    .select()
    .single();

  return { data, error };
}

export async function update(id: string, updates: Partial<Memory>) {
  const { data, error } = await supabase
    .from('memory')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  return { data, error };
}

export async function remove(id: string) {
  const { error } = await supabase
    .from('memory')
    .delete()
    .eq('id', id);

  return { error };
}
