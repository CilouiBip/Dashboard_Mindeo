import { describe, it, expect, vi, beforeEach } from 'vitest';
import { okrV2Service } from '../okrV2Service';
import { supabase } from '../../client';

// Mock Supabase client
vi.mock('../../client', () => ({
  supabase: {
    from: vi.fn(() => ({
      insert: vi.fn(() => ({
        select: vi.fn(() => ({
          single: vi.fn(() => Promise.resolve({
            data: {
              id: '123-test-id',
              title: "Améliorer l'expérience utilisateur du dashboard",
              status: 'active',
              quarter: '2025-Q1'
            },
            error: null
          }))
        }))
      })),
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          order: vi.fn(() => Promise.resolve({
            data: [{
              id: '123-test-id',
              title: "Améliorer l'expérience utilisateur du dashboard",
              status: 'active',
              quarter: '2025-Q1'
            }],
            error: null
          }))
        }))
      }))
    }))
  }
}));

describe('okrV2Service Unit Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Objectives', () => {
    describe('createObjective', () => {
      it('should create an objective successfully', async () => {
        const objective = await okrV2Service.createObjective({
          title: "Améliorer l'expérience utilisateur du dashboard",
          description: "Rendre le dashboard plus intuitif et performant",
          status: 'active',
          quarter: '2025-Q1',
          ai_generated: false
        });

        expect(objective.data).toBeDefined();
        expect(objective.error).toBeNull();
        expect(objective.data?.title).toBe("Améliorer l'expérience utilisateur du dashboard");
      });
    });

    describe('getObjectives', () => {
      it('should fetch objectives for a specific quarter', async () => {
        const objectives = await okrV2Service.getObjectives('2025-Q1');

        expect(objectives.data).toBeDefined();
        expect(objectives.error).toBeNull();
        expect(objectives.data).toHaveLength(1);
        expect(objectives.data?.[0].title).toBe("Améliorer l'expérience utilisateur du dashboard");
      });
    });
  });

  describe('Key Results', () => {
    it('should create a key result', async () => {
      const mockKR = {
        objective_id: '123',
        title: 'Test KR',
        target_value: 100,
        current_value: 0,
        unit: '%',
        status: 'not_started' as const
      };

      const mockResponse = { data: { id: '456', ...mockKR }, error: null };
      vi.mocked(supabase.from).mockImplementation(() => ({
        insert: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue(mockResponse)
      }));

      const result = await okrV2Service.createKeyResult(mockKR);
      expect(result.data?.title).toBe(mockKR.title);
      expect(supabase.from).toHaveBeenCalledWith('key_results');
    });
  });

  describe('Initiatives', () => {
    it('should create an initiative', async () => {
      const mockInitiative = {
        key_result_id: '456',
        title: 'Test Initiative',
        status: 'proposed' as const
      };

      const mockResponse = { data: { id: '789', ...mockInitiative }, error: null };
      vi.mocked(supabase.from).mockImplementation(() => ({
        insert: vi.fn().mockReturnThis(),
        select: vi.fn().mockReturnThis(),
        single: vi.fn().mockResolvedValue(mockResponse)
      }));

      const result = await okrV2Service.createInitiative(mockInitiative);
      expect(result.data?.title).toBe(mockInitiative.title);
      expect(supabase.from).toHaveBeenCalledWith('initiatives');
    });
  });
});
