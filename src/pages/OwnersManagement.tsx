import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as ownersService from '../lib/supabase/services/ownersService';

const OwnersManagement = () => {
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState({ name: '', role: '' });

  const { data: owners, isLoading } = useQuery({
    queryKey: ['owners'],
    queryFn: async () => {
      const { data, error } = await ownersService.getAll();
      if (error) throw error;
      return data;
    }
  });

  const createMutation = useMutation({
    mutationFn: async (owner: any) => {
      const { data, error } = await ownersService.create(owner);
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['owners'] });
      setFormData({ name: '', role: '' });
    },
    onError: (error: Error) => {
      console.error('Error creating owner:', error);
      alert('Error creating owner: ' + error.message);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { data, error } = await ownersService.remove(id);
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['owners'] });
    },
    onError: (error: Error) => {
      console.error('Error deleting owner:', error);
      alert('Error deleting owner: ' + error.message);
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    createMutation.mutate(formData);
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this owner?')) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Owners Management</h1>
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="mb-2">
          <label className="block text-sm font-medium mb-1">Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>
        <div className="mb-2">
          <label className="block text-sm font-medium mb-1">Role</label>
          <input
            type="text"
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>
        <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-md">
          Add Owner
        </button>
      </form>
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="border px-4 py-2">Name</th>
            <th className="border px-4 py-2">Role</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {owners?.map((owner) => (
            <tr key={owner.id}>
              <td className="border px-4 py-2">{owner.name}</td>
              <td className="border px-4 py-2">{owner.role || '-'}</td>
              <td className="border px-4 py-2">
                <button
                  onClick={() => handleDelete(owner.id)}
                  className="px-2 py-1 bg-red-500 text-white rounded-md"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OwnersManagement;
