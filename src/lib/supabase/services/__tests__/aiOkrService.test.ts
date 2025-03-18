import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AIOKRService } from '../aiOkrService';
import { createClient } from '@supabase/supabase-js';

// Mock Supabase client
vi.mock('@supabase/supabase-js', () => ({
    createClient: vi.fn(),
}));

describe('AIOKRService', () => {
    let service: AIOKRService;
    let mockSupabase: any;

    beforeEach(() => {
        // Reset mocks
        mockSupabase = {
            from: vi.fn().mockReturnThis(),
            select: vi.fn().mockReturnThis(),
            insert: vi.fn().mockReturnThis(),
            update: vi.fn().mockReturnThis(),
            eq: vi.fn().mockReturnThis(),
            single: vi.fn(),
            order: vi.fn().mockReturnThis(),
        };

        (createClient as any).mockReturnValue(mockSupabase);
        service = new AIOKRService(mockSupabase);
    });

    it('should save generated OKRs', async () => {
        const mockOKRSet = {
            objectives: [
                {
                    title: 'Test Objective',
                    key_results: [
                        {
                            title: 'Test KR',
                        },
                    ],
                },
            ],
        };

        mockSupabase.single.mockResolvedValue({
            data: { id: '123', content: mockOKRSet },
            error: null,
        });

        const result = await service.saveGenerated(mockOKRSet);

        expect(result.data).toBeDefined();
        expect(result.error).toBeNull();
        expect(mockSupabase.from).toHaveBeenCalledWith('ai_generated_okrs');
    });

    it('should get generated OKRs by id', async () => {
        const mockOKRSet = {
            objectives: [
                {
                    title: 'Test Objective',
                    key_results: [
                        {
                            title: 'Test KR',
                        },
                    ],
                },
            ],
        };

        mockSupabase.single.mockResolvedValue({
            data: { id: '123', content: mockOKRSet },
            error: null,
        });

        const result = await service.getGenerated('123');

        expect(result.data).toEqual(mockOKRSet);
        expect(result.error).toBeNull();
    });
});
