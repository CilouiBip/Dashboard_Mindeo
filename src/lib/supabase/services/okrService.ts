import { supabase } from '../client';

export interface KeyResult {
  id: string;
  metric: string;
  target: number;
  current: number;
  unit: string;
}

export interface OKR {
  id: string;
  objective: string;
  key_results: KeyResult[];
  status: 'active' | 'completed' | 'cancelled';
  iteration: number;
  vision_id: string;
  created_at: string;
}

export async function getAll() {
  const { data, error } = await supabase
    .from('okr')
    .select(`
      *,
      vision:vision_id (
        vision_text
      )
    `)
    .order('created_at', { ascending: false });

  return { data, error };
}

export async function getByVisionId(visionId: string) {
  const { data, error } = await supabase
    .from('okr')
    .select('*')
    .eq('vision_id', visionId)
    .order('created_at', { ascending: false });

  return { data, error };
}

export async function create(okr: Omit<OKR, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('okr')
    .insert([okr])
    .select()
    .single();

  return { data, error };
}

export async function update(id: string, updates: Partial<OKR>) {
  const { data, error } = await supabase
    .from('okr')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  return { data, error };
}

export async function remove(id: string) {
  const { error } = await supabase
    .from('okr')
    .delete()
    .eq('id', id);

  return { error };
}
