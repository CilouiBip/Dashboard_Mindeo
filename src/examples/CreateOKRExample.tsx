import React, { useState } from 'react';
import { okrService } from '../lib/supabase/services';
import { CreateOKRInput, KeyResult, ServiceError } from '../types/supabase';

export default function CreateOKRExample() {
  const [objective, setObjective] = useState('');
  const [keyResults, setKeyResults] = useState<KeyResult[]>([
    { metric: '', target: 0, current: 0, weight: 1 }
  ]);
  const [error, setError] = useState<ServiceError | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleAddKeyResult = () => {
    setKeyResults([...keyResults, { metric: '', target: 0, current: 0, weight: 1 }]);
  };

  const handleKeyResultChange = (index: number, field: keyof KeyResult, value: string | number) => {
    const newKeyResults = [...keyResults];
    newKeyResults[index] = {
      ...newKeyResults[index],
      [field]: field === 'metric' ? value : Number(value)
    };
    setKeyResults(newKeyResults);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Validate input
      if (!objective.trim()) {
        throw { code: 'VALIDATION_ERROR', message: 'Objective is required' };
      }

      if (!keyResults.every(kr => kr.metric.trim())) {
        throw { code: 'VALIDATION_ERROR', message: 'All key results must have a metric' };
      }

      const newOKR: CreateOKRInput = {
        objective,
        key_results: keyResults,
        status: 'active',
        iteration: 1,
        vision_id: '/* Add your vision ID here */'
      };

      const result = await okrService.create(newOKR);
      setSuccess(true);
      
      // Reset form
      setObjective('');
      setKeyResults([{ metric: '', target: 0, current: 0, weight: 1 }]);
      
    } catch (err) {
      setError(err as ServiceError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Create New OKR</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error.message}
        </div>
      )}

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          OKR created successfully!
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Objective */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Objective
          </label>
          <input
            type="text"
            value={objective}
            onChange={(e) => setObjective(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            placeholder="Enter your objective"
            disabled={loading}
          />
        </div>

        {/* Key Results */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Key Results
          </label>
          {keyResults.map((kr, index) => (
            <div key={index} className="grid grid-cols-4 gap-4 mb-4">
              <div className="col-span-2">
                <input
                  type="text"
                  value={kr.metric}
                  onChange={(e) => handleKeyResultChange(index, 'metric', e.target.value)}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  placeholder="Metric"
                  disabled={loading}
                />
              </div>
              <div>
                <input
                  type="number"
                  value={kr.target}
                  onChange={(e) => handleKeyResultChange(index, 'target', e.target.value)}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  placeholder="Target"
                  disabled={loading}
                />
              </div>
              <div>
                <input
                  type="number"
                  value={kr.weight}
                  onChange={(e) => handleKeyResultChange(index, 'weight', e.target.value)}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  placeholder="Weight"
                  min="0"
                  max="1"
                  step="0.1"
                  disabled={loading}
                />
              </div>
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddKeyResult}
            className="mt-2 inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            disabled={loading}
          >
            Add Key Result
          </button>
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create OKR'}
          </button>
        </div>
      </form>
    </div>
  );
}
