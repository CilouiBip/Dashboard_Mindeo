import { supabase } from '../client';

export interface Initiative {
  id: string;
  title: string;
  description?: string;
  status: 'todo' | 'in_progress' | 'done';
  key_result_id: string;
  created_at?: string;
}

export async function create(initiative: Omit<Initiative, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('initiative')
    .insert([initiative])
    .select()
    .single();

  return { data, error };
}

export async function getByKeyResultId(keyResultId: string) {
  const { data, error } = await supabase
    .from('initiative')
    .select('*')
    .eq('key_result_id', keyResultId)
    .order('created_at', { ascending: true });

  return { data, error };
}

export async function update(id: string, updates: Partial<Initiative>) {
  const { data, error } = await supabase
    .from('initiative')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  return { data, error };
}

export async function remove(id: string) {
  const { error } = await supabase
    .from('initiative')
    .delete()
    .eq('id', id);

  return { error };
}
