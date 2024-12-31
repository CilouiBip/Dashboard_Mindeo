import { z } from 'zod';

// Enum schemas with transformations
export const KPITypeSchema = z.union([
  z.literal('Principal'),
  z.literal('Secondaire'),
  z.literal('Input'),
  z.literal('Output')
]).transform((val) => {
  if (val === 'Principal') return 'Input';
  if (val === 'Secondaire') return 'Output';
  return val;
});

export const PrioritySchema = z.enum(['High', 'Medium', 'Low']);
export const StatusSchema = z.enum(['Not Started', 'In Progress', 'Completed']);

// Function field schema that handles both string and array inputs
const FunctionsSchema = z.union([
  z.string(),
  z.array(z.string())
]).transform((val) => {
  if (Array.isArray(val)) {
    return val.join(', ');
  }
  return val || '';
});

// Base schemas for common fields
const baseRecordSchema = z.object({
  createdTime: z.string().optional(),
  id: z.string().optional(),
});

// KPI Schema with flexible field handling
export const KPISchema = baseRecordSchema.extend({
  ID_KPI: z.string(),
  Nom_KPI: z.string(),
  Type: KPITypeSchema,
  Valeur_Actuelle: z.union([z.number(), z.string()]).transform(val => 
    typeof val === 'string' ? parseFloat(val) || 0 : val
  ),
  Valeur_Cible: z.union([z.number(), z.string()]).transform(val => 
    typeof val === 'string' ? parseFloat(val) || 0 : val
  ).optional().default(0),
  Fonctions: FunctionsSchema.optional().default(''),
  Description: z.string().optional().default(''),
  Unite: z.string().optional().default(''),
  Format: z.string().optional().default('number'),
  Impact_Type: z.string().optional().default('linear'),
  Impact_Revenue: z.union([z.number(), z.string(), z.null()]).transform(val => {
    if (val === null) return 0;
    return typeof val === 'string' ? parseFloat(val) || 0 : val;
  }).default(0),
  Impact_EBITDA: z.union([z.number(), z.string(), z.null()]).transform(val => {
    if (val === null) return 0;
    return typeof val === 'string' ? parseFloat(val) || 0 : val;
  }).default(0),
}).transform((data) => ({
  ...data,
  // Ensure numeric fields are always numbers
  Valeur_Actuelle: Number(data.Valeur_Actuelle) || 0,
  Valeur_Cible: Number(data.Valeur_Cible) || 0,
  Impact_Revenue: Number(data.Impact_Revenue) || 0,
  Impact_EBITDA: Number(data.Impact_EBITDA) || 0,
}));

// Project Item Schema
export const ProjectItemSchema = baseRecordSchema.extend({
  ID_Project: z.string(),
  Title: z.string(),
  Description: z.string().optional().default(''),
  Priority: PrioritySchema,
  Status: StatusSchema,
  Owner: z.string(),
  Due_Date: z.string(), // ISO date string
  Parent_ID: z.string().optional(),
  Dependencies: z.array(z.string()).optional().default([]),
});

// Audit Item Schema
export const AuditItemSchema = baseRecordSchema.extend({
  ID_Audit: z.string(),
  Title: z.string(),
  Description: z.string().optional().default(''),
  Status: StatusSchema,
  Owner: z.string(),
  Due_Date: z.string(),
  Function: z.string().optional().default(''),
  Evidence: z.string().optional().default(''),
});

// Schema for arrays of records
export const KPIArraySchema = z.array(KPISchema);
export const ProjectItemArraySchema = z.array(ProjectItemSchema);
export const AuditItemArraySchema = z.array(AuditItemSchema);

// Infer types from schemas
export type KPI = z.infer<typeof KPISchema>;
export type ProjectItem = z.infer<typeof ProjectItemSchema>;
export type AuditItem = z.infer<typeof AuditItemSchema>;
export type Priority = z.infer<typeof PrioritySchema>;
export type Status = z.infer<typeof StatusSchema>;
export type KPIType = 'Input' | 'Output';

// Validation functions with detailed error handling and data transformation
interface ValidationResult<T> {
  success: boolean;
  data?: T;
  errors?: z.ZodError;
}

export function validateKPI(data: unknown): ValidationResult<KPI> {
  try {
    const validated = KPISchema.parse(data);
    return { success: true, data: validated };
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.warn('KPI validation failed:', {
        error: error.errors,
        data: data
      });
      return { success: false, errors: error };
    }
    throw error;
  }
}

export function validateKPIs(data: unknown): ValidationResult<KPI[]> {
  try {
    const validated = KPIArraySchema.parse(data);
    return { success: true, data: validated };
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.warn('KPIs validation failed:', {
        error: error.errors,
        data: data
      });
      return { success: false, errors: error };
    }
    throw error;
  }
}

export function validateProjectItem(data: unknown): ValidationResult<ProjectItem> {
  try {
    const validated = ProjectItemSchema.parse(data);
    return { success: true, data: validated };
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.warn('Project item validation failed:', error.errors);
      return { success: false, errors: error };
    }
    throw error;
  }
}

export function validateProjectItems(data: unknown): ValidationResult<ProjectItem[]> {
  try {
    const validated = ProjectItemArraySchema.parse(data);
    return { success: true, data: validated };
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.warn('Project items validation failed:', error.errors);
      return { success: false, errors: error };
    }
    throw error;
  }
}

export function validateAuditItem(data: unknown): ValidationResult<AuditItem> {
  try {
    const validated = AuditItemSchema.parse(data);
    return { success: true, data: validated };
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.warn('Audit item validation failed:', error.errors);
      return { success: false, errors: error };
    }
    throw error;
  }
}

export function validateAuditItems(data: unknown): ValidationResult<AuditItem[]> {
  try {
    const validated = AuditItemArraySchema.parse(data);
    return { success: true, data: validated };
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.warn('Audit items validation failed:', error.errors);
      return { success: false, errors: error };
    }
    throw error;
  }
}
