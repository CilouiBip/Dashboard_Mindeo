import { supabase } from '../client';
import { logger } from '../../logger';

const SERVICE_TAG = '[OKRCore]';

export interface BasicSessionData {
  name?: string;
  description?: string;
  status?: 'active' | 'archived';
  objectives?: Array<{
    title: string;
    description?: string;
    key_results?: Array<{
      kr_name: string;
      target_value: number;
      target_unit: string;
    }>;
  }>;
}

export const okrCore = {
  async createSession(data: BasicSessionData) {
    logger.info(SERVICE_TAG, 'Creating new session:', { sessionData: data });
    
    try {
      // 1. Create session
      const { data: session, error: sessionError } = await supabase
        .from('okr_sessions')
        .insert({
          name: data.name,
          description: data.description,
          status: 'active'
        })
        .select('id, name, description, status, created_at')
        .single();

      if (sessionError) {
        logger.error(SERVICE_TAG, 'Failed to create session:', { error: sessionError });
        throw sessionError;
      }

      logger.info(SERVICE_TAG, 'Session created successfully:', { sessionId: session.id });

      // 2. Create objectives if any
      if (data.objectives?.length) {
        for (const obj of data.objectives) {
          try {
            // Create objective
            const { data: objective, error: objError } = await supabase
              .from('objectives')
              .insert({
                session_id: session.id,
                title: obj.title,
                description: obj.description,
                status: 'active'
              })
              .select('id, title, description, status')
              .single();

            if (objError) {
              logger.error(SERVICE_TAG, 'Failed to create objective:', { error: objError });
              continue;
            }

            // Create key results if any
            if (obj.key_results?.length) {
              for (const kr of obj.key_results) {
                try {
                  const { error: krError } = await supabase
                    .from('key_results')
                    .insert({
                      objective_id: objective.id,
                      kr_name: kr.kr_name,
                      target_value: kr.target_value,
                      target_unit: kr.target_unit,
                      status: 'active',
                      current: 0
                    })
                    .select('id, kr_name, target_value, target_unit, status, current')
                    .single();

                  if (krError) {
                    logger.error(SERVICE_TAG, 'Failed to create key result:', { error: krError });
                  }
                } catch (krError) {
                  logger.error(SERVICE_TAG, 'Unexpected error creating key result:', { error: krError });
                }
              }
            }
          } catch (objError) {
            logger.error(SERVICE_TAG, 'Unexpected error creating objective:', { error: objError });
          }
        }
      }

      return session;
    } catch (error) {
      logger.error(SERVICE_TAG, 'Unexpected error in createSession:', { error });
      throw error;
    }
  },

  async getSessions() {
    logger.info(SERVICE_TAG, 'Fetching all sessions');
    
    try {
      // 1. Get all sessions
      const { data: sessions, error: sessionError } = await supabase
        .from('okr_sessions')
        .select('id, name, description, status, created_at')
        .order('created_at', { ascending: false });

      if (sessionError) {
        logger.error(SERVICE_TAG, 'Failed to fetch sessions:', { error: sessionError });
        return [];
      }

      // 2. Enrich sessions with objectives and KRs
      const enrichedSessions = await Promise.all(sessions.map(async (session) => {
        try {
          // Get objectives for this session
          const { data: objectives, error: objError } = await supabase
            .from('objectives')
            .select(`
              id, 
              title,
              description,
              status,
              created_at,
              key_results (
                id,
                kr_name,
                target_value,
                target_unit,
                current,
                status
              )
            `)
            .eq('session_id', session.id)
            .order('created_at', { ascending: false });

          if (objError) {
            logger.warn(SERVICE_TAG, `Could not fetch objectives for session ${session.id}:`, { error: objError });
            return { ...session, objectives: [] };
          }

          return { ...session, objectives: objectives || [] };
        } catch (error) {
          logger.warn(SERVICE_TAG, `Unexpected error fetching data for session ${session.id}:`, { error });
          return { ...session, objectives: [] };
        }
      }));

      logger.info(SERVICE_TAG, `Successfully fetched ${enrichedSessions.length} sessions with their data`);
      return enrichedSessions;
    } catch (error) {
      logger.error(SERVICE_TAG, 'Unexpected error in getSessions:', { error });
      return [];
    }
  },

  async updateSession(sessionId: string, updates: Partial<BasicSessionData>) {
    logger.info(SERVICE_TAG, `Updating session ${sessionId}:`, { updates });
    
    try {
      // Vérifier d'abord si la session existe
      const { data: existingSession, error: checkError } = await supabase
        .from('okr_sessions')
        .select('id')
        .eq('id', sessionId)
        .single();

      if (checkError) {
        logger.error(SERVICE_TAG, 'Session not found:', { error: checkError });
        throw new Error('Session not found');
      }

      // Préparer les données de mise à jour
      const updateData: any = {};
      if (updates.name !== undefined) updateData.name = updates.name;
      if (updates.description !== undefined) updateData.description = updates.description;
      if (updates.status !== undefined) updateData.status = updates.status;

      // Mettre à jour la session
      const { data: session, error: updateError } = await supabase
        .from('okr_sessions')
        .update(updateData)
        .eq('id', sessionId)
        .select('id, name, description, status, created_at')
        .single();

      if (updateError) {
        logger.error(SERVICE_TAG, 'Failed to update session:', { error: updateError });
        throw updateError;
      }

      logger.info(SERVICE_TAG, 'Session updated successfully:', { sessionId, updates: updateData });
      return session;
    } catch (error) {
      logger.error(SERVICE_TAG, 'Unexpected error in updateSession:', { error });
      throw error;
    }
  }
};
