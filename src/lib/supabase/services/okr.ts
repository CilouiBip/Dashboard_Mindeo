import { supabase } from '../client';
import { 
  OKR, 
  CreateOKRInput, 
  UpdateOKRInput, 
  ServiceResult, 
  ServiceError 
} from '../../../types/supabase';

const handleError = (error: any): ServiceError => {
  if (error.code === '23503') {
    return {
      code: 'FOREIGN_KEY_VIOLATION',
      message: 'Referenced vision does not exist',
      details: error
    };
  }
  if (error.code === '23505') {
    return {
      code: 'UNIQUE_VIOLATION',
      message: 'An OKR with these details already exists',
      details: error
    };
  }
  return {
    code: 'UNKNOWN_ERROR',
    message: error.message || 'An unexpected error occurred',
    details: error
  };
};

export const okrService = {
  async create(input: CreateOKRInput): Promise<ServiceResult<OKR>> {
    try {
      // Validate input
      if (!input.objective?.trim()) {
        return {
          data: null,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Objective is required'
          }
        };
      }

      if (!input.vision_id) {
        return {
          data: null,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Vision ID is required'
          }
        };
      }

      if (!Array.isArray(input.key_results) || input.key_results.length === 0) {
        return {
          data: null,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'At least one key result is required'
          }
        };
      }

      const { data, error } = await supabase
        .from('okr')
        .insert(input)
        .select()
        .single();
      
      if (error) throw error;
      
      return { data, error: null };
    } catch (error) {
      return {
        data: null,
        error: handleError(error)
      };
    }
  },

  async getAll(): Promise<ServiceResult<OKR[]>> {
    try {
      const { data, error } = await supabase
        .from('okr')
        .select(`
          *,
          vision:vision_id(*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return {
        data: null,
        error: handleError(error)
      };
    }
  },

  async getById(id: string): Promise<ServiceResult<OKR>> {
    try {
      const { data, error } = await supabase
        .from('okr')
        .select(`
          *,
          vision:vision_id(*)
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return {
        data: null,
        error: handleError(error)
      };
    }
  },

  async getByVisionId(visionId: string): Promise<ServiceResult<OKR[]>> {
    try {
      const { data, error } = await supabase
        .from('okr')
        .select('*')
        .eq('vision_id', visionId)
        .order('iteration', { ascending: true });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return {
        data: null,
        error: handleError(error)
      };
    }
  },

  async update(id: string, updates: UpdateOKRInput): Promise<ServiceResult<OKR>> {
    try {
      // Validate updates
      if (updates.objective === '') {
        return {
          data: null,
          error: {
            code: 'VALIDATION_ERROR',
            message: 'Objective cannot be empty'
          }
        };
      }

      const { data, error } = await supabase
        .from('okr')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return {
        data: null,
        error: handleError(error)
      };
    }
  },

  async delete(id: string): Promise<ServiceResult<void>> {
    try {
      const { error } = await supabase
        .from('okr')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return { data: null, error: null };
    } catch (error) {
      return {
        data: null,
        error: handleError(error)
      };
    }
  }
};
