export type Status = 'active' | 'completed' | 'pending' | 'cancelled';
export type Priority = 'low' | 'medium' | 'high' | 'critical';

export interface BaseRecord {
  id: string;
  created_at: string;
}

export interface Memory extends BaseRecord {
  session_id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface Vision extends BaseRecord {
  vision_text: string;
}

export interface KeyResult {
  metric: string;
  target: number;
  current: number;
  weight: number;
}

export interface OKR extends BaseRecord {
  objective: string;
  key_results: KeyResult[];
  status: Status;
  iteration: number;
  vision_id: string;
  vision?: Vision;  // For joined queries
}

export interface ProjectPlan extends BaseRecord {
  name: string;
  description: string;
  owner: string;
  due_date: string;
  priority: Priority;
  status: Status;
  okr_ref: string;
  okr?: OKR;  // For joined queries
}

// Error handling types
export interface ServiceError {
  code: string;
  message: string;
  details?: unknown;
}

export interface ServiceResult<T> {
  data: T | null;
  error: ServiceError | null;
}

// Input types for create/update operations
export type CreateMemoryInput = Omit<Memory, keyof BaseRecord>;
export type CreateVisionInput = Omit<Vision, keyof BaseRecord>;
export type CreateOKRInput = Omit<OKR, keyof BaseRecord | 'vision'>;
export type CreateProjectPlanInput = Omit<ProjectPlan, keyof BaseRecord | 'okr'>;

export type UpdateMemoryInput = Partial<CreateMemoryInput>;
export type UpdateVisionInput = Partial<CreateVisionInput>;
export type UpdateOKRInput = Partial<CreateOKRInput>;
export type UpdateProjectPlanInput = Partial<CreateProjectPlanInput>;
