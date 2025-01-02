import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as roadmapService from '../lib/supabase/services/roadmapService';
import * as ownersService from '../lib/supabase/services/ownersService';
import { RoadmapItem } from '../lib/supabase/services/roadmapService';
import { format, differenceInDays } from 'date-fns';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import OwnersPanel from '../components/owners/OwnersPanel';

const STATUS_OPTIONS = ['Not Started', 'In Progress', 'Completed'];
const PRIORITY_OPTIONS = ['High', 'Medium', 'Low'];

interface RoadmapFormData {
  title: string;
  owner: string;
  status: string;
  due_date: string;
  priority: string;
  description: string;
  start_date?: string;
  end_date?: string;
}

const initialFormData: RoadmapFormData = {
  title: '',
  owner: '',
  status: 'Not Started',
  due_date: '',
  priority: 'Medium',
  description: '',
  start_date: '',
  end_date: '',
};

const RoadmapPage = () => {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<RoadmapItem | null>(null);
  const [formData, setFormData] = useState<RoadmapFormData>(initialFormData);

  const { data: roadmapItems, isLoading } = useQuery({
    queryKey: ['roadmap'],
    queryFn: async () => {
      const { data, error } = await roadmapService.getAll();
      if (error) throw error;
      return data;
    }
  });

  const { data: owners } = useQuery({
    queryKey: ['owners'],
    queryFn: async () => {
      const { data, error } = await ownersService.getAll();
      if (error) throw error;
      return data;
    }
  });

  const createMutation = useMutation({
    mutationFn: async (item: RoadmapItem) => {
      const { data, error } = await roadmapService.create(item);
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roadmap'] });
      setShowForm(false);
      setFormData(initialFormData);
    },
    onError: (error: Error) => {
      console.error('Error creating roadmap item:', error);
      alert('Error creating roadmap item: ' + error.message);
    }
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<RoadmapItem> }) => {
      const { data, error } = await roadmapService.update(id, updates);
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roadmap'] });
      setEditingItem(null);
      setShowForm(false);
    },
    onError: (error: Error) => {
      console.error('Error updating roadmap item:', error);
      alert('Error updating roadmap item: ' + error.message);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await roadmapService.remove(id);
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['roadmap'] });
    },
    onError: (error: Error) => {
      console.error('Error deleting roadmap item:', error);
      alert('Error deleting roadmap item: ' + error.message);
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem) {
      updateMutation.mutate({
        id: editingItem.id!,
        updates: formData,
      });
    } else {
      createMutation.mutate(formData);
    }
  };

  const handleEdit = (item: RoadmapItem) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      owner: item.owner,
      status: item.status,
      due_date: item.due_date || '',
      priority: item.priority || 'Medium',
      description: item.description || '',
      start_date: item.start_date || '',
      end_date: item.end_date || '',
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) {
    return <div className="p-6 text-white">Loading...</div>;
  }

  return (
    <div className="p-6">
      <div className="flex">
        <div className="flex-1 mr-4">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-white">Roadmap</h1>
            <button
              onClick={() => {
                setEditingItem(null);
                setFormData(initialFormData);
                setShowForm(true);
              }}
              className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-md flex items-center gap-2"
            >
              <span className="text-lg">+</span>
              Add Item
            </button>
          </div>

          {showForm && (
            <div className="mb-6 p-4 bg-[#1C1D24] rounded-lg border border-[#2D2E3A]">
              <h2 className="text-lg font-semibold text-white mb-4">
                {editingItem ? 'Edit Item' : 'Add New Item'}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Title</label>
                    <input
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                      className="w-full px-3 py-2 bg-[#141517] border border-[#2D2E3A] rounded-md text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Owner</label>
                    <select
                      value={formData.owner}
                      onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
                      className="w-full px-3 py-2 bg-[#141517] border border-[#2D2E3A] rounded-md text-white"
                    >
                      <option value="">-- Select Owner --</option>
                      {owners?.map(o => (
                        <option key={o.id} value={o.name}>
                          {o.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                      required
                      className="w-full px-3 py-2 bg-[#141517] border border-[#2D2E3A] rounded-md text-white"
                    >
                      {STATUS_OPTIONS.map((status) => (
                        <option key={status} value={status}>
                          {status}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Due Date</label>
                    <DatePicker
                      selected={formData.due_date ? new Date(formData.due_date) : null}
                      onChange={(date: Date | null) => {
                        setFormData({ ...formData, due_date: date ? date.toISOString().split('T')[0] : '' });
                      }}
                      dateFormat="dd/MM/yyyy"
                      className="w-full px-3 py-2 bg-[#141517] border border-[#2D2E3A] rounded-md text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Start Date</label>
                    <DatePicker
                      selected={formData.start_date ? new Date(formData.start_date) : null}
                      onChange={(date: Date | null) => {
                        setFormData({ ...formData, start_date: date ? date.toISOString().split('T')[0] : '' });
                      }}
                      dateFormat="dd/MM/yyyy"
                      className="w-full px-3 py-2 bg-[#141517] border border-[#2D2E3A] rounded-md text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">End Date</label>
                    <DatePicker
                      selected={formData.end_date ? new Date(formData.end_date) : null}
                      onChange={(date: Date | null) => {
                        setFormData({ ...formData, end_date: date ? date.toISOString().split('T')[0] : '' });
                      }}
                      dateFormat="dd/MM/yyyy"
                      className="w-full px-3 py-2 bg-[#141517] border border-[#2D2E3A] rounded-md text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Priority</label>
                    <select
                      value={formData.priority}
                      onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                      required
                      className="w-full px-3 py-2 bg-[#141517] border border-[#2D2E3A] rounded-md text-white"
                    >
                      {PRIORITY_OPTIONS.map((priority) => (
                        <option key={priority} value={priority}>
                          {priority}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-400 mb-1">Description</label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={3}
                      className="w-full px-3 py-2 bg-[#141517] border border-[#2D2E3A] rounded-md text-white resize-none"
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setEditingItem(null);
                      setFormData(initialFormData);
                    }}
                    className="px-4 py-2 border border-[#2D2E3A] text-gray-400 hover:text-white rounded-md"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-violet-600 hover:bg-violet-700 text-white rounded-md"
                  >
                    {editingItem ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="bg-[#1C1D24] rounded-lg border border-[#2D2E3A] overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-[#2D2E3A] bg-[#141517]">
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Title</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Owner</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Due Date</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Start Date</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">End Date</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Priority</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Description</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Actions</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-400">Duration</th>
                </tr>
              </thead>
              <tbody>
                {roadmapItems?.map((item) => (
                  <tr key={item.id} className="border-b border-[#2D2E3A] hover:bg-[#1C1D24]/60">
                    <td className="px-4 py-3 text-sm text-white">{item.title}</td>
                    <td className="px-4 py-3 text-sm text-gray-300">{item.owner}</td>
                    <td className="px-4 py-3 text-sm">
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          item.status === 'Completed'
                            ? 'bg-green-500/10 text-green-400'
                            : item.status === 'In Progress'
                            ? 'bg-blue-500/10 text-blue-400'
                            : 'bg-gray-500/10 text-gray-400'
                        }`}
                      >
                        {item.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-300">
                      {item.due_date ? format(new Date(item.due_date), 'dd/MM/yyyy') : '-'}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-300">{item.start_date}</td>
                    <td className="px-4 py-3 text-sm text-gray-300">{item.end_date}</td>
                    <td className="px-4 py-3 text-sm">
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          item.priority === 'High'
                            ? 'bg-red-500/10 text-red-400'
                            : item.priority === 'Medium'
                            ? 'bg-yellow-500/10 text-yellow-400'
                            : 'bg-blue-500/10 text-blue-400'
                        }`}
                      >
                        {item.priority}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-300">{item.description || '-'}</td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEdit(item)}
                          className="p-1 text-gray-400 hover:text-violet-400"
                        >
                          ✏️
                        </button>
                        <button
                          onClick={() => handleDelete(item.id!)}
                          className="p-1 text-gray-400 hover:text-red-400"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                    {item.start_date && item.end_date && (
                      <td className="px-4 py-3 text-sm text-gray-300">
                        {differenceInDays(new Date(item.end_date), new Date(item.start_date))} jours
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Right panel */}
        <div className="w-80">
          <OwnersPanel roadmapItems={roadmapItems || []} />
        </div>
      </div>
    </div>
  );
};

export default RoadmapPage;
