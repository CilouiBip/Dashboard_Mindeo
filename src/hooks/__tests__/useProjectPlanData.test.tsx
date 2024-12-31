import { renderHook, act } from '@testing-library/react';
import { useProjectPlanData } from '../useProjectPlanData';
import { fetchProjectItems, updateProjectItem } from '../../api/projectApi';
import { createQueryWrapper } from '../../test/utils';
import { ProjectItem } from '../../types/airtable';

// Mock the API functions
vi.mock('../../api/projectApi', () => ({
  fetchProjectItems: vi.fn(),
  updateProjectItem: vi.fn(),
}));

// Mock debug mode hook
vi.mock('../useDebugMode', () => ({
  useDebugMode: () => ({ isDebugMode: false }),
}));

describe('useProjectPlanData', () => {
  const mockProjectItems: ProjectItem[] = [
    {
      ID_Project: '1',
      Title: 'Task 1',
      Description: 'Description 1',
      Priority: 'High',
      Status: 'Not Started',
      Owner: 'John',
      Due_Date: '2024-12-25',
    },
    {
      ID_Project: '2',
      Title: 'Task 2',
      Description: 'Description 2',
      Priority: 'Medium',
      Status: 'In Progress',
      Owner: 'Jane',
      Due_Date: '2024-12-20',
    },
    {
      ID_Project: '3',
      Title: 'Task 3',
      Description: 'Description 3',
      Priority: 'Low',
      Status: 'Completed',
      Owner: 'John',
      Due_Date: '2024-12-15',
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    (fetchProjectItems as jest.Mock).mockResolvedValue(mockProjectItems);
  });

  it('fetches and returns project items', async () => {
    const { result } = renderHook(() => useProjectPlanData(), {
      wrapper: createQueryWrapper(),
    });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.projectItems).toEqual([]);

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.projectItems).toHaveLength(3);
    expect(result.current.statistics.total).toBe(3);
  });

  it('filters by priority', async () => {
    const { result } = renderHook(
      () => useProjectPlanData({ priority: 'High' }),
      { wrapper: createQueryWrapper() }
    );

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(result.current.projectItems).toHaveLength(1);
    expect(result.current.projectItems[0].Priority).toBe('High');
  });

  it('filters by status', async () => {
    const { result } = renderHook(
      () => useProjectPlanData({ status: 'In Progress' }),
      { wrapper: createQueryWrapper() }
    );

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(result.current.projectItems).toHaveLength(1);
    expect(result.current.projectItems[0].Status).toBe('In Progress');
  });

  it('filters by owner', async () => {
    const { result } = renderHook(
      () => useProjectPlanData({ owner: 'John' }),
      { wrapper: createQueryWrapper() }
    );

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(result.current.projectItems).toHaveLength(2);
    expect(result.current.projectItems.every(item => item.Owner === 'John')).toBe(true);
  });

  it('filters by search query', async () => {
    const { result } = renderHook(
      () => useProjectPlanData({ search: 'Task 1' }),
      { wrapper: createQueryWrapper() }
    );

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(result.current.projectItems).toHaveLength(1);
    expect(result.current.projectItems[0].Title).toBe('Task 1');
  });

  it('sorts by due date', async () => {
    const { result } = renderHook(
      () => useProjectPlanData(undefined, { field: 'Due_Date', direction: 'asc' }),
      { wrapper: createQueryWrapper() }
    );

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    const dates = result.current.projectItems.map(item => item.Due_Date);
    expect(dates).toEqual([...dates].sort());
  });

  it('calculates statistics correctly', async () => {
    const { result } = renderHook(() => useProjectPlanData(), {
      wrapper: createQueryWrapper(),
    });

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(result.current.statistics).toEqual({
      total: 3,
      byPriority: {
        High: 1,
        Medium: 1,
        Low: 1,
      },
      byStatus: {
        'Not Started': 1,
        'In Progress': 1,
        'Completed': 1,
      },
      overdue: expect.any(Number),
    });
  });

  it('updates project items', async () => {
    const { result } = renderHook(() => useProjectPlanData(), {
      wrapper: createQueryWrapper(),
    });

    const updateData = {
      ID_Project: '1',
      Status: 'In Progress' as const,
    };

    (updateProjectItem as jest.Mock).mockResolvedValueOnce(updateData);

    await act(async () => {
      result.current.updateItem(updateData);
    });

    expect(updateProjectItem).toHaveBeenCalledWith(updateData);
  });
});
