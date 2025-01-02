// ownersService.ts
import { supabase } from '../client';

export interface Owner {
  id?: string;
  name: string;
  role?: string;
  created_at?: string;
}

// Récupère tous les owners, triés par name
export async function getAll() {
  const { data, error } = await supabase
    .from('owners')
    .select('*')
    .order('name', { ascending: true });
  return { data, error };
}

// Crée un owner
export async function create(owner: Owner) {
  const { data, error } = await supabase
    .from('owners')
    .insert([owner])
    .select()
    .single();
  return { data, error };
}

// Met à jour un owner
export async function update(id: string, updates: Partial<Owner>) {
  const { data, error } = await supabase
    .from('owners')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  return { data, error };
}

// Supprime un owner
export async function remove(id: string) {
  const { data, error } = await supabase
    .from('owners')
    .delete()
    .eq('id', id);
  return { data, error };
}
