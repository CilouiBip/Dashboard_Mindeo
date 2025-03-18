import { Database } from '../supabase/database.types';

export type AIGeneratedKeyResult = {
    id?: string;
    title: string;
    description?: string;
    metrics?: string;
    target_value?: number;
    current_value?: number;
};

export type AIGeneratedObjective = {
    id?: string;
    title: string;
    description?: string;
    key_results: AIGeneratedKeyResult[];
    timeframe?: string;
};

export type AIGeneratedOKRSet = {
    id?: string;
    objectives: AIGeneratedObjective[];
    created_at?: string;
    prompt?: string;
    metadata?: {
        model?: string;
        temperature?: number;
        company_context?: string;
        additional_context?: string;
    };
    status?: 'draft' | 'validated' | 'transferred';
};

// Type pour la table Supabase
export type AIGeneratedOKRRecord = Database['public']['Tables']['ai_generated_okrs']['Row'];

// Type pour l'insertion
export type AIGeneratedOKRInsert = Database['public']['Tables']['ai_generated_okrs']['Insert'];
