import { supabase } from '../client';
import { Vision } from '../../../types/supabase';

export const visionService = {
  async create(vision: Omit<Vision, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('vision')
      .insert(vision)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async getAll() {
    const { data, error } = await supabase
      .from('vision')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('vision')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  async update(id: string, updates: Partial<Vision>) {
    const { data, error } = await supabase
      .from('vision')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('vision')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};
