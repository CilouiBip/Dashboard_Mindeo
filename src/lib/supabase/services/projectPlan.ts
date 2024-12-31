import { supabase } from '../client';
import { ProjectPlan } from '../../../types/supabase';

export const projectPlanService = {
  async create(project: Omit<ProjectPlan, 'id' | 'created_at'>) {
    const { data, error } = await supabase
      .from('project_plan')
      .insert(project)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async getAll() {
    const { data, error } = await supabase
      .from('project_plan')
      .select(`
        *,
        okr:okr_ref(*)
      `)
      .order('due_date', { ascending: true });

    if (error) throw error;
    return data;
  },

  async getById(id: string) {
    const { data, error } = await supabase
      .from('project_plan')
      .select(`
        *,
        okr:okr_ref(*)
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  },

  async getByOkrId(okrId: string) {
    const { data, error } = await supabase
      .from('project_plan')
      .select('*')
      .eq('okr_ref', okrId)
      .order('due_date', { ascending: true });

    if (error) throw error;
    return data;
  },

  async update(id: string, updates: Partial<ProjectPlan>) {
    const { data, error } = await supabase
      .from('project_plan')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async delete(id: string) {
    const { error } = await supabase
      .from('project_plan')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
};
