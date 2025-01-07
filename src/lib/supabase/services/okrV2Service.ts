import { supabase } from '../client';
import type {
  Objective,
  KeyResult,
  Initiative,
  CreateObjective,
  CreateKeyResult,
  CreateInitiative,
  ObjectiveWithKRs,
  KeyResultWithInitiatives
} from '../../types/okr';

export const okrV2Service = {
  // Objectives
  async createObjective(objective: CreateObjective) {
    const { data, error } = await supabase
      .from('objectives')
      .insert(objective)
      .select()
      .single();
    
    return { data, error };
  },

  async getObjectives(quarter?: string) {
    let query = supabase
      .from('objectives')
      .select(`
        *,
        key_results (
          *,
          initiatives (*)
        )
      `);

    if (quarter) {
      query = query.eq('quarter', quarter);
    }

    const { data, error } = await query.order('created_at', { ascending: false });
    return { data: data as ObjectiveWithKRs[] | null, error };
  },

  async updateObjective(id: string, updates: Partial<Objective>) {
    const { data, error } = await supabase
      .from('objectives')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    return { data, error };
  },

  // Key Results
  async createKeyResult(keyResult: CreateKeyResult) {
    const { data, error } = await supabase
      .from('key_results')
      .insert(keyResult)
      .select(`
        *,
        objective:objective_id (*)
      `)
      .single();
    
    return { data, error };
  },

  async updateKeyResult(id: string, updates: Partial<KeyResult>) {
    const { data, error } = await supabase
      .from('key_results')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    return { data, error };
  },

  async getKeyResultsByObjective(objectiveId: string) {
    const { data, error } = await supabase
      .from('key_results')
      .select(`
        *,
        initiatives (*)
      `)
      .eq('objective_id', objectiveId)
      .order('created_at', { ascending: true });
    
    return { data: data as KeyResultWithInitiatives[] | null, error };
  },

  // Initiatives
  async createInitiative(initiative: CreateInitiative) {
    const { data, error } = await supabase
      .from('initiatives')
      .insert(initiative)
      .select(`
        *,
        key_result:key_result_id (
          *,
          objective:objective_id (*)
        )
      `)
      .single();
    
    return { data, error };
  },

  async updateInitiative(id: string, updates: Partial<Initiative>) {
    const { data, error } = await supabase
      .from('initiatives')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    
    return { data, error };
  },

  // Migration helper (à utiliser avec précaution)
  async migrateFromV1() {
    const { data: oldOkrs } = await supabase
      .from('okr')
      .select('*')
      .order('created_at', { ascending: true });

    if (!oldOkrs) return { error: 'No OKRs to migrate' };

    for (const okr of oldOkrs) {
      // Créer l'objectif
      const { data: objective } = await this.createObjective({
        title: okr.objective,
        status: okr.status === 'active' ? 'active' : 
               okr.status === 'completed' ? 'archived' : 'draft',
        quarter: new Date(okr.created_at).getFullYear() + '-Q' + 
                (Math.floor(new Date(okr.created_at).getMonth() / 3) + 1),
        ai_generated: false,
        description: `Migrated from v1. Original vision_id: ${okr.vision_id}`
      });

      if (objective && okr.key_results) {
        // Créer les key results
        for (const kr of okr.key_results) {
          await this.createKeyResult({
            objective_id: objective.id,
            title: kr.metric,
            target_value: kr.target,
            current_value: kr.current,
            unit: kr.unit,
            status: 'in_progress',
            description: 'Migrated from v1'
          });
        }
      }
    }

    return { success: true };
  }
};
