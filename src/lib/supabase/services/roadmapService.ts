import { supabase } from '../client';

export interface RoadmapItem {
  id?: string;
  title: string;
  owner: string;
  status: string;
  due_date?: string;  // au format YYYY-MM-DD
  priority?: string;
  description?: string;
  created_at?: string;
  start_date?: string;
  end_date?: string;
}

export async function getAll() {
  const { data, error } = await supabase
    .from('roadmap')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching roadmap items:', error);
  }
  return { data, error };
}

export async function create(item: Omit<RoadmapItem, 'id' | 'created_at'>) {
  console.log('Creating item:', item);
  const { start_date, end_date, ...rest } = item;
  const insertData = {
    ...rest,
    start_date,
    end_date
  };
  console.log('Insert data:', insertData);

  const { data, error } = await supabase
    .from('roadmap')
    .insert([insertData])
    .select()
    .single();

  if (error) {
    console.error('Supabase create error:', error);
    console.error('Error details:', {
      code: error.code,
      message: error.message,
      details: error.details,
      hint: error.hint
    });
  } else {
    console.log('Created data:', data);
  }

  return { data, error };
}

export async function update(id: string, updates: Partial<RoadmapItem>) {
  const { start_date, end_date, ...rest } = updates;
  const { data, error } = await supabase
    .from('roadmap')
    .update({
      ...rest,
      start_date,
      end_date,
      description: updates.description
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating roadmap item:', error);
  }
  return { data, error };
}

export async function remove(id: string) {
  const { error } = await supabase
    .from('roadmap')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting roadmap item:', error);
  }
  return { error };
}
