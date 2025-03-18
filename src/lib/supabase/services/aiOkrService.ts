import { SupabaseClient } from '@supabase/supabase-js';
import { Database } from '../database.types';
import { AIGeneratedOKRSet, AIGeneratedOKRRecord } from '../../types/ai-okr';

export class AIOKRService {
    private supabase: SupabaseClient<Database>;

    constructor(supabase: SupabaseClient<Database>) {
        this.supabase = supabase;
    }

    /**
     * Sauvegarde un ensemble d'OKRs générés par l'IA
     * Les données sont stockées en JSONB dans la colonne 'content'
     */
    async saveGenerated(okrSet: AIGeneratedOKRSet): Promise<{ data: AIGeneratedOKRRecord | null; error: any }> {
        const { data, error } = await this.supabase
            .from('ai_generated_okrs')
            .insert({
                content: okrSet,
                status: okrSet.status || 'draft',
                created_at: new Date().toISOString(),
            })
            .select()
            .single();

        return { data, error };
    }

    /**
     * Récupère un ensemble d'OKRs générés par son ID
     */
    async getGenerated(id: string): Promise<{ data: AIGeneratedOKRSet | null; error: any }> {
        const { data, error } = await this.supabase
            .from('ai_generated_okrs')
            .select('*')
            .eq('id', id)
            .single();

        return {
            data: data?.content as AIGeneratedOKRSet,
            error,
        };
    }

    /**
     * Récupère tous les ensembles d'OKRs générés
     * Possibilité de filtrer par status
     */
    async getAllGenerated(status?: 'draft' | 'validated' | 'transferred'): Promise<{
        data: AIGeneratedOKRSet[];
        error: any;
    }> {
        let query = this.supabase.from('ai_generated_okrs').select('*');

        if (status) {
            query = query.eq('status', status);
        }

        const { data, error } = await query.order('created_at', { ascending: false });

        return {
            data: data?.map((record) => record.content as AIGeneratedOKRSet) || [],
            error,
        };
    }

    /**
     * Valide et transfère les OKRs générés vers les tables objectives/key_results
     * Cette fonction sera enrichie plus tard avec plus de validation
     */
    async validateAndTransfer(
        id: string,
        roadmapId: string
    ): Promise<{ success: boolean; error: any }> {
        const { data: okrSet, error: fetchError } = await this.getGenerated(id);

        if (fetchError || !okrSet) {
            return { success: false, error: fetchError };
        }

        // Début d'une transaction
        const { error } = await this.supabase.rpc('transfer_ai_generated_okrs', {
            p_ai_generated_id: id,
            p_roadmap_id: roadmapId
        });

        if (error) {
            return { success: false, error };
        }

        // Mise à jour du status
        const { error: updateError } = await this.supabase
            .from('ai_generated_okrs')
            .update({ status: 'transferred' })
            .eq('id', id);

        return {
            success: !updateError,
            error: updateError,
        };
    }
}
