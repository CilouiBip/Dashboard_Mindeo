export interface Objective {
  id: string;
  title: string;
  description?: string;
  status: 'draft' | 'active' | 'archived';
  quarter: string;
  ai_generated: boolean;
  created_at: string;
  updated_at: string;
}

export interface KeyResult {
  id: string;
  objective_id: string;
  title: string;
  description?: string;
  target_value: number;
  current_value: number;
  unit: string;
  status: 'not_started' | 'in_progress' | 'completed';
  created_at: string;
  updated_at: string;
  objective?: Objective;
}

export interface Initiative {
  id: string;
  key_result_id: string;
  title: string;
  description?: string;
  status: 'proposed' | 'approved' | 'in_progress' | 'completed';
  created_at: string;
  updated_at: string;
  key_result?: KeyResult;
}

// Types pour la création/mise à jour
export type CreateObjective = Omit<Objective, 'id' | 'created_at' | 'updated_at'>;
export type CreateKeyResult = Omit<KeyResult, 'id' | 'created_at' | 'updated_at' | 'objective'>;
export type CreateInitiative = Omit<Initiative, 'id' | 'created_at' | 'updated_at' | 'key_result'>;

// Types pour les réponses API
export interface ObjectiveWithKRs extends Objective {
  key_results: KeyResult[];
}

export interface KeyResultWithInitiatives extends KeyResult {
  initiatives: Initiative[];
}
