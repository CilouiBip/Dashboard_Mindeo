import { supabase } from '../client';
import { Memory } from '../../../types/supabase';

export const memoryService = {
  async create(memory: Omit<Memory, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('memory')
      .insert(memory)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async getAll() {
    const { data, error } = await supabase
      .from('memory')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  async getBySessionId(sessionId: string) {
    const { data, error } = await supabase
      .from('memory')
      .select('*')
      .eq('session_id', sessionId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data;
  },

  async update(id: string, updates: Partial<Memory>) {
    const { data, error } = await supabase
      .from('memory')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('memory')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};
