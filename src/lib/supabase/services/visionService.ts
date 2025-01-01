import { supabase } from '../client';

export interface Vision {
  id?: string;
  vision_text: string;
  current_revenue: string;
  target_revenue: string;
  main_product: string;
  main_challenges?: string;
  context?: string;
  created_at?: string;
}

export async function getAll() {
  const { data, error } = await supabase
    .from('vision')
    .select('*')
    .order('created_at', { ascending: false });

  return { data, error };
}

export async function create(vision: Vision) {
  const { data, error } = await supabase
    .from('vision')
    .insert([
      {
        vision_text: vision.vision_text,
        current_revenue: vision.current_revenue,
        target_revenue: vision.target_revenue,
        main_produc/Users/mehdi/Documents/Screenshot 2024-12-31 at 21.40.10.pngt: vision.main_product,
        main_challenges: vision.main_challenges || null,
        context: vision.context || null,
      }
    ])
    .select()
    .single();

  return { data, error };
}

export async function getById(id: string) {
  const { data, error } = await supabase
    .from('vision')
    .select('*')
    .eq('id', id)
    .single();

  return { data, error };
}

export async function update(id: string, updates: Partial<Vision>) {
  const { data, error } = await supabase
    .from('vision')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  return { data, error };
}


  // D'abord, supprimons les OKRs associés
  const { error: okrError } = await supabase
    .from('okr')
    .delete()
    .eq('vision_id', id);

  if (okrError) {
    console.error('Error deleting associated OKRs:', okrError);
    return { error: okrError };
  }

  // Ensuite, supprimons la vision
  const { error: visionError } = await supabase
    .from('vision')
    .delete()
    .eq('id', id);

  if (visionError) {
    console.error('Error deleting vision:', visionError);
    return { error: visionError };
  }

  return { error: null };
}
