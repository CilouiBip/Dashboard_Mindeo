import { supabase } from '../client';
import { PostgrestError } from '@supabase/supabase-js';

export interface Initiative {
  id?: string;
  title: string;
  description?: string;
  owner_id?: string;
  status?: 'todo' | 'in_progress' | 'done';
  priority?: number;
  start_date?: string;
  due_date?: string;
}

export interface KeyResult {
  id?: string;
  kr_name: string;
  description?: string;
  target_value: number;
  baseline_value?: number;
  current?: number;
  target_unit: string;
  owner_id?: string;
  status?: 'active' | 'completed' | 'at_risk';
  start_date?: string;
  due_date?: string;
  initiatives?: Initiative[];
}

export interface Objective {
  id?: string;
  title: string;
  description?: string;
  owner_id?: string;
  status?: 'active' | 'completed' | 'cancelled';
  priority?: number;
  key_results?: KeyResult[];
}

export interface OKRSession {
  id?: string;
  name: string;
  description?: string;
  status?: 'active' | 'completed' | 'archived';
  owner_id?: string;
  start_date?: string;
  end_date?: string;
  vision_id?: string;
  objectives?: Objective[];
}

export type SupabaseResponse<T> = {
  data: T | null;
  error: PostgrestError | null;
};

export async function createSession(session: OKRSession): Promise<SupabaseResponse<OKRSession>> {
  try {
    console.log('[DEBUG][Service] Starting createSession with data:', JSON.stringify(session, null, 2));
    
    if (!session.name) {
      throw new Error('Session name is required');
    }

    // Validate dates
    if (session.start_date && session.end_date) {
      const start = new Date(session.start_date);
      const end = new Date(session.end_date);
      if (end < start) {
        throw new Error('End date must be after start date');
      }
    }
    
    // 1. Create session
    const { data: sessionData, error: sessionError } = await supabase
      .from('okr_sessions')
      .insert([{
        name: session.name,
        description: session.description,
        status: session.status || 'active',
        start_date: session.start_date,
        end_date: session.end_date,
        vision_id: session.vision_id
      }])
      .select('*')
      .single();

    if (sessionError) {
      console.error('[ERROR][Service] Failed to create session:', {
        error: sessionError,
        code: sessionError.code,
        details: sessionError.details,
        message: sessionError.message,
        hint: sessionError.hint
      });
      return { data: null, error: sessionError };
    }
    
    if (!sessionData) {
      console.error('[ERROR][Service] No session data returned after insert');
      return { 
        data: null, 
        error: { 
          message: 'Failed to create session - no data returned',
          details: 'Database insert succeeded but returned no data'
        } as PostgrestError 
      };
    }
    
    console.log('[DEBUG][Service] Session created successfully:', sessionData);

    // 2. Create objectives
    if (session.objectives && session.objectives.length > 0) {
      console.log(`[DEBUG][Service] Creating ${session.objectives.length} objectives`);
      
      for (const obj of session.objectives) {
        if (!obj.title) {
          console.warn('[WARN][Service] Skipping objective with no title');
          continue;
        }

        console.log('[DEBUG][Service] Creating objective:', {
          title: obj.title,
          sessionId: sessionData.id
        });
        
        const { data: objData, error: objError } = await supabase
          .from('objectives')
          .insert([{
            session_id: sessionData.id,
            title: obj.title,
            description: obj.description,
            status: obj.status || 'active',
            priority: obj.priority
          }])
          .select('*')
          .single();

        if (objError) {
          console.error('[ERROR][Service] Failed to create objective:', {
            error: objError,
            code: objError.code,
            details: objError.details,
            message: objError.message
          });
          // Continue with other objectives instead of throwing
          continue;
        }
        
        if (!objData) {
          console.warn('[WARN][Service] No data returned for objective insert');
          continue;
        }

        console.log('[DEBUG][Service] Objective created:', objData);

        // 3. Create key results for each objective
        if (obj.key_results && obj.key_results.length > 0) {
          console.log(`[DEBUG][Service] Creating ${obj.key_results.length} key results for objective ${objData.id}`);
          
          for (const kr of obj.key_results) {
            console.log('[DEBUG][Service] Creating key result:', {
              name: kr.kr_name,
              objectiveId: objData.id
            });
            
            const { data: krData, error: krError } = await supabase
              .from('key_results')
              .insert([{
                objective_id: objData.id,
                kr_name: kr.kr_name,
                description: kr.description,
                target_value: kr.target_value,
                baseline_value: kr.baseline_value,
                current: kr.current || 0,
                target_unit: kr.target_unit,
                owner_id: kr.owner_id,
                status: kr.status || 'active',
                start_date: kr.start_date,
                due_date: kr.due_date
              }])
              .select('*')
              .single();

            if (krError) {
              console.error('[ERROR][Service] Failed to create key result:', {
                error: krError,
                code: krError.code,
                details: krError.details,
                message: krError.message
              });
              // Continue with other key results instead of throwing
              continue;
            }
            
            if (!krData) {
              console.warn('[WARN][Service] No data returned for key result insert');
              continue;
            }

            console.log('[DEBUG][Service] Key result created:', krData);

            // 4. Create initiatives for each key result
            if (kr.initiatives && kr.initiatives.length > 0) {
              console.log(`[DEBUG][Service] Creating ${kr.initiatives.length} initiatives for key result ${krData.id}`);
              
              for (const init of kr.initiatives) {
                console.log('[DEBUG][Service] Creating initiative:', {
                  title: init.title,
                  keyResultId: krData.id
                });
                
                const { data: initData, error: initError } = await supabase
                  .from('initiatives')
                  .insert([{
                    key_result_id: krData.id,
                    title: init.title,
                    description: init.description,
                    owner_id: init.owner_id,
                    status: init.status || 'todo',
                    priority: init.priority,
                    start_date: init.start_date,
                    due_date: init.due_date
                  }])
                  .select('*')
                  .single();

                if (initError) {
                  console.error('[ERROR][Service] Failed to create initiative:', {
                    error: initError,
                    code: initError.code,
                    details: initError.details,
                    message: initError.message
                  });
                  // Continue with other initiatives instead of throwing
                  continue;
                }
                
                if (!initData) {
                  console.warn('[WARN][Service] No data returned for initiative insert');
                  continue;
                }

                console.log('[DEBUG][Service] Initiative created:', initData);
              }
            } else {
              console.log('[DEBUG][Service] No initiatives to create for key result:', krData.id);
            }
          }
        } else {
          console.log('[DEBUG][Service] No key results to create for objective:', objData.id);
        }
      }
    } else {
      console.log('[DEBUG][Service] No objectives to create');
    }

    return { data: sessionData, error: null };
  } catch (error) {
    console.error('[ERROR][Service] Unexpected error in createSession:', error);
    return { 
      data: null, 
      error: {
        message: error instanceof Error ? error.message : 'Unknown error occurred',
        details: JSON.stringify(error)
      } as PostgrestError
    };
  }
}

export async function getSession(id: string): Promise<SupabaseResponse<OKRSession>> {
  const { data, error } = await supabase
    .from('okr_sessions')
    .select(`
      *,
      objectives (
        *,
        key_results (
          *,
          initiatives (*)
        )
      )
    `)
    .eq('id', id)
    .single();

  return { data, error };
}

export async function getAllSessions(): Promise<SupabaseResponse<OKRSession[]>> {
  console.log('[DEBUG][Service] Fetching all OKR sessions with explicit fields');
  const { data, error } = await supabase
    .from('okr_sessions')
    .select(`
      id,
      name,
      description,
      status,
      start_date,
      end_date,
      vision_id,
      created_at,
      updated_at,
      objectives (
        id,
        title,
        description,
        status,
        priority,
        key_results (
          id,
          kr_name,
          description,
          target_value,
          baseline_value,
          current,
          target_unit,
          status,
          start_date,
          due_date
        )
      )
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('[ERROR][Service] Failed to fetch sessions:', error);
  } else {
    console.log('[DEBUG][Service] Successfully fetched sessions:', 
      data?.map(s => ({
        id: s.id,
        name: s.name,
        objectiveCount: s.objectives?.length,
        krCount: s.objectives?.reduce((acc, obj) => acc + (obj.key_results?.length || 0), 0)
      }))
    );
  }

  return { data, error };
}

export async function updateSession(
  id: string,
  updates: Partial<OKRSession>
): Promise<SupabaseResponse<OKRSession>> {
  const { data, error } = await supabase
    .from('okr_sessions')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  return { data, error };
}

export async function deleteSession(id: string): Promise<SupabaseResponse<null>> {
  const { error } = await supabase
    .from('okr_sessions')
    .delete()
    .eq('id', id);

  return { data: null, error };
}
