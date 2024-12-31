import React, { useState } from 'react';
import { useProjectPlanData } from '../hooks/useProjectPlanData';
import { Card } from '../components/ui/card';
import { Select } from '../components/ui/select';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/Button';
import { Priority, Status, ProjectItem } from '../types/airtable';
import { Calendar, Search, Filter, AlertCircle } from 'lucide-react';

const ProjectPlan: React.FC = () => {
  // Filter state
  const [filters, setFilters] = useState({
    priority: undefined as Priority | undefined,
    status: undefined as Status | undefined,
    owner: undefined as string | undefined,
    search: '',
  });

  // Sort state
  const [sortConfig, setSortConfig] = useState({
    field: 'Due_Date' as keyof ProjectItem,
    direction: 'asc' as 'asc' | 'desc',
  });

  // Fetch data with filters and sorting
  const {
    projectItems,
    isLoading,
    error,
    updateItem,
    isUpdating,
    availableOwners,
    statistics
  } = useProjectPlanData(filters, sortConfig);

  const handleStatusChange = async (itemId: string, newStatus: Status) => {
    updateItem({ ID_Project: itemId, Status: newStatus });
  };

  const getStatusColor = (status: Status) => {
    switch (status) {
      case 'Not Started': return 'bg-gray-200 text-gray-800';
      case 'In Progress': return 'bg-blue-200 text-blue-800';
      case 'Completed': return 'bg-green-200 text-green-800';
      default: return 'bg-gray-200 text-gray-800';
    }
  };

  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case 'High': return 'text-red-500';
      case 'Medium': return 'text-yellow-500';
      case 'Low': return 'text-green-500';
      default: return 'text-gray-500';
    }
  };

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-red-500 flex items-center gap-2">
          <AlertCircle className="w-5 h-5" />
          <span>Error loading project plan: {error instanceof Error ? error.message : 'Unknown error'}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <h1 className="text-2xl font-bold text-white">Project Plan</h1>
        <Button variant="outline" className="flex items-center gap-2">
          <Calendar className="w-4 h-4" />
          Export Calendar
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 bg-[#1C1D24]">
          <h3 className="text-sm text-gray-400">Total Tasks</h3>
          <p className="text-2xl font-bold text-white">{statistics.total}</p>
        </Card>
        <Card className="p-4 bg-[#1C1D24]">
          <h3 className="text-sm text-gray-400">In Progress</h3>
          <p className="text-2xl font-bold text-blue-400">{statistics.byStatus['In Progress']}</p>
        </Card>
        <Card className="p-4 bg-[#1C1D24]">
          <h3 className="text-sm text-gray-400">Completed</h3>
          <p className="text-2xl font-bold text-green-400">{statistics.byStatus['Completed']}</p>
        </Card>
        <Card className="p-4 bg-[#1C1D24]">
          <h3 className="text-sm text-gray-400">Overdue</h3>
          <p className="text-2xl font-bold text-red-400">{statistics.overdue}</p>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <div className="flex-1 min-w-[200px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Search tasks..."
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
              className="pl-10"
            />
          </div>
        </div>
        <Select
          value={filters.priority}
          onValueChange={(value) => setFilters(prev => ({ ...prev, priority: value as Priority }))}
          placeholder="Priority"
          options={[
            { label: 'High', value: 'High' },
            { label: 'Medium', value: 'Medium' },
            { label: 'Low', value: 'Low' },
          ]}
          className="w-32"
        />
        <Select
          value={filters.status}
          onValueChange={(value) => setFilters(prev => ({ ...prev, status: value as Status }))}
          placeholder="Status"
          options={[
            { label: 'Not Started', value: 'Not Started' },
            { label: 'In Progress', value: 'In Progress' },
            { label: 'Completed', value: 'Completed' },
          ]}
          className="w-40"
        />
        <Select
          value={filters.owner}
          onValueChange={(value) => setFilters(prev => ({ ...prev, owner: value }))}
          placeholder="Owner"
          options={availableOwners.map(owner => ({ label: owner, value: owner }))}
          className="w-40"
        />
        <Button
          variant="ghost"
          onClick={() => setFilters({
            priority: undefined,
            status: undefined,
            owner: undefined,
            search: '',
          })}
          className="flex items-center gap-2"
        >
          <Filter className="w-4 h-4" />
          Clear Filters
        </Button>
      </div>

      {/* Project Items Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-violet-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {projectItems.map((item) => (
            <Card key={item.ID_Project} className="p-4 bg-[#1C1D24]">
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-semibold text-white">{item.Title}</h3>
                  <span className={`text-sm ${getPriorityColor(item.Priority)}`}>
                    {item.Priority}
                  </span>
                </div>
                
                <p className="text-sm text-gray-400">{item.Description}</p>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">
                    Due: {new Date(item.Due_Date).toLocaleDateString()}
                  </span>
                  <span className="text-sm text-gray-400">{item.Owner}</span>
                </div>

                <Select
                  value={item.Status}
                  onValueChange={(value) => handleStatusChange(item.ID_Project, value as Status)}
                  options={[
                    { label: 'Not Started', value: 'Not Started' },
                    { label: 'In Progress', value: 'In Progress' },
                    { label: 'Completed', value: 'Completed' },
                  ]}
                  className={`w-full ${getStatusColor(item.Status)}`}
                  disabled={isUpdating}
                />
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectPlan;
