import { supabase } from '../client';

export interface ProjectPlan {
  id: string;
  name: string;
  description: string;
  owner: string;
  due_date: string;
  priority: 'high' | 'medium' | 'low';
  status: 'todo' | 'in_progress' | 'done';
  okr_ref: string;
  created_at: string;
}

export async function getAll() {
  const { data, error } = await supabase
    .from('project_plan')
    .select(`
      *,
      okr:okr_ref (
        objective
      )
    `)
    .order('created_at', { ascending: false });

  return { data, error };
}

export async function getByOKRId(okrId: string) {
  const { data, error } = await supabase
    .from('project_plan')
    .select('*')
    .eq('okr_ref', okrId)
    .order('due_date', { ascending: true });

  return { data, error };
}

export async function create(project: Omit<ProjectPlan, 'id' | 'created_at'>) {
  const { data, error } = await supabase
    .from('project_plan')
    .insert([project])
    .select()
    .single();

  return { data, error };
}

export async function update(id: string, updates: Partial<ProjectPlan>) {
  const { data, error } = await supabase
    .from('project_plan')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  return { data, error };
}

export async function remove(id: string) {
  const { error } = await supabase
    .from('project_plan')
    .delete()
    .eq('id', id);

  return { error };
}
