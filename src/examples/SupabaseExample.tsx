import React, { useEffect, useState } from 'react';
import { visionService, okrService, projectPlanService } from '../lib/supabase/services';
import { Vision, OKR, ProjectPlan } from '../types/supabase';

export default function SupabaseExample() {
  const [visions, setVisions] = useState<Vision[]>([]);
  const [selectedVision, setSelectedVision] = useState<string | null>(null);
  const [okrs, setOkrs] = useState<OKR[]>([]);
  const [projects, setProjects] = useState<ProjectPlan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadVisions();
  }, []);

  useEffect(() => {
    if (selectedVision) {
      loadOkrs(selectedVision);
    }
  }, [selectedVision]);

  const loadVisions = async () => {
    try {
      const data = await visionService.getAll();
      setVisions(data);
      setLoading(false);
    } catch (error) {
      console.error('Error loading visions:', error);
      setLoading(false);
    }
  };

  const loadOkrs = async (visionId: string) => {
    try {
      const data = await okrService.getByVisionId(visionId);
      setOkrs(data);
      
      // Load projects for each OKR
      const projectPromises = data.map(okr => projectPlanService.getByOkrId(okr.id));
      const projectsData = await Promise.all(projectPromises);
      setProjects(projectsData.flat());
    } catch (error) {
      console.error('Error loading OKRs:', error);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Vision & OKRs Dashboard</h1>
      
      {/* Vision Selection */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2">Select Vision</h2>
        <select 
          className="w-full p-2 border rounded"
          value={selectedVision || ''}
          onChange={(e) => setSelectedVision(e.target.value)}
        >
          <option value="">Select a vision...</option>
          {visions.map(vision => (
            <option key={vision.id} value={vision.id}>
              {vision.vision_text}
            </option>
          ))}
        </select>
      </div>

      {/* OKRs List */}
      {selectedVision && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">OKRs</h2>
          <div className="space-y-4">
            {okrs.map(okr => (
              <div key={okr.id} className="p-4 border rounded">
                <h3 className="font-medium">{okr.objective}</h3>
                <div className="mt-2">
                  <strong>Status:</strong> {okr.status}
                </div>
                <div className="mt-2">
                  <strong>Iteration:</strong> {okr.iteration}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Projects List */}
      {projects.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-2">Related Projects</h2>
          <div className="space-y-4">
            {projects.map(project => (
              <div key={project.id} className="p-4 border rounded">
                <h3 className="font-medium">{project.name}</h3>
                <p className="text-gray-600">{project.description}</p>
                <div className="mt-2">
                  <strong>Owner:</strong> {project.owner}
                </div>
                <div className="mt-1">
                  <strong>Due Date:</strong> {new Date(project.due_date).toLocaleDateString()}
                </div>
                <div className="mt-1">
                  <strong>Status:</strong> {project.status}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
