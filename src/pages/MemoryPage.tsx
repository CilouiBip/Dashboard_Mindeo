import { useQuery } from '@tanstack/react-query';
import * as memoryService from '../lib/supabase/services/memoryService';

export default function MemoryPage() {
  const { data: memories, isLoading, error } = useQuery({
    queryKey: ['memories'],
    queryFn: () => memoryService.getAll(),
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Memory Log</h1>

      <div className="space-y-4">
        {memories?.data?.map((memory) => (
          <div key={memory.id} className="p-4 border rounded">
            <div className="flex items-start gap-4">
              <span className="px-2 py-1 rounded bg-gray-100 text-gray-800 text-sm">
                {memory.role}
              </span>
              <div className="flex-1">
                <p className="whitespace-pre-wrap">{memory.content}</p>
                <p className="text-sm text-gray-500 mt-2">
                  Session: {memory.session_id}
                  <br />
                  Created: {new Date(memory.created_at).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
