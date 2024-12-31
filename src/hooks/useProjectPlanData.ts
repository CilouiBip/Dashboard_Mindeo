import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchProjectItems, updateProjectItem } from '../api/projectApi';
import { ProjectItem, Priority, Status } from '../types/airtable';
import { useDebugMode } from './useDebugMode';

interface ProjectPlanFilters {
  priority?: Priority;
  status?: Status;
  owner?: string;
  search?: string;
  startDate?: Date;
  endDate?: Date;
}

interface SortConfig {
  field: keyof ProjectItem;
  direction: 'asc' | 'desc';
}

export function useProjectPlanData(filters?: ProjectPlanFilters, sort?: SortConfig) {
  const queryClient = useQueryClient();
  const { isDebugMode } = useDebugMode();

  const { data: projectItems = [], isLoading, error } = useQuery({
    queryKey: ['projectPlan', filters],
    queryFn: () => fetchProjectItems(),
    select: (data) => {
      let filteredData = [...data];

      // Apply filters
      if (filters) {
        if (filters.priority) {
          filteredData = filteredData.filter(item => item.Priority === filters.priority);
        }
        if (filters.status) {
          filteredData = filteredData.filter(item => item.Status === filters.status);
        }
        if (filters.owner) {
          filteredData = filteredData.filter(item => item.Owner === filters.owner);
        }
        if (filters.search) {
          const searchLower = filters.search.toLowerCase();
          filteredData = filteredData.filter(item =>
            item.Title.toLowerCase().includes(searchLower) ||
            item.Description?.toLowerCase().includes(searchLower)
          );
        }
        if (filters.startDate) {
          filteredData = filteredData.filter(item =>
            new Date(item.Due_Date) >= filters.startDate!
          );
        }
        if (filters.endDate) {
          filteredData = filteredData.filter(item =>
            new Date(item.Due_Date) <= filters.endDate!
          );
        }
      }

      // Apply sorting
      if (sort) {
        filteredData.sort((a, b) => {
          const aValue = a[sort.field];
          const bValue = b[sort.field];
          
          if (aValue === bValue) return 0;
          
          const comparison = aValue < bValue ? -1 : 1;
          return sort.direction === 'asc' ? comparison : -comparison;
        });
      } else {
        // Default sort by due date
        filteredData.sort((a, b) => 
          new Date(a.Due_Date).getTime() - new Date(b.Due_Date).getTime()
        );
      }

      return filteredData;
    }
  });

  const { mutate: updateItem, isLoading: isUpdating } = useMutation({
    mutationFn: updateProjectItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projectPlan'] });
    },
  });

  // Debug logging
  if (isDebugMode) {
    console.log('🔍 Project Plan Data:', {
      totalItems: projectItems.length,
      filters,
      sort
    });
  }

  // Get unique owners for filtering
  const availableOwners = [...new Set(projectItems.map(item => item.Owner))];

  // Calculate statistics
  const statistics = {
    total: projectItems.length,
    byPriority: {
      High: projectItems.filter(item => item.Priority === 'High').length,
      Medium: projectItems.filter(item => item.Priority === 'Medium').length,
      Low: projectItems.filter(item => item.Priority === 'Low').length,
    },
    byStatus: {
      'Not Started': projectItems.filter(item => item.Status === 'Not Started').length,
      'In Progress': projectItems.filter(item => item.Status === 'In Progress').length,
      'Completed': projectItems.filter(item => item.Status === 'Completed').length,
    },
    overdue: projectItems.filter(item => 
      new Date(item.Due_Date) < new Date() && item.Status !== 'Completed'
    ).length,
  };

  return {
    projectItems,
    isLoading,
    error,
    updateItem,
    isUpdating,
    availableOwners,
    statistics,
  };
}
