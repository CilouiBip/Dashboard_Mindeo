import React, { useState } from 'react';
import { generateOKRs, type GeneratedOKR, type KeyResult } from '../../lib/supabase/services/aiService';

interface EditableOKR extends GeneratedOKR {
  isEditing: boolean;
}

export const VisionAIGenerator: React.FC = () => {
  const [vision, setVision] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedOKRs, setGeneratedOKRs] = useState<EditableOKR[]>([]);

  const handleGenerate = async () => {
    if (!vision.trim()) return;
    
    setIsGenerating(true);
    try {
      const okrs = await generateOKRs(vision);
      setGeneratedOKRs(okrs.map(okr => ({ ...okr, isEditing: false })));
    } catch (error) {
      console.error('Failed to generate OKRs:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const toggleEdit = (okrId: string) => {
    setGeneratedOKRs(okrs =>
      okrs.map(okr =>
        okr.id === okrId ? { ...okr, isEditing: !okr.isEditing } : okr
      )
    );
  };

  const updateOKR = (okrId: string, field: 'objective' | 'keyResults', value: string | KeyResult[], index?: number) => {
    setGeneratedOKRs(okrs =>
      okrs.map(okr => {
        if (okr.id !== okrId) return okr;
        
        if (field === 'objective') {
          return { ...okr, objective: value as string };
        } else if (field === 'keyResults' && typeof index === 'number') {
          const newKeyResults = [...okr.keyResults];
          newKeyResults[index] = {
            ...newKeyResults[index],
            text: value as string
          };
          return { ...okr, keyResults: newKeyResults };
        }
        return okr;
      })
    );
  };

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-white">Vision AI Generator</h2>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">
            Your 3-Year Vision
          </label>
          <textarea
            value={vision}
            onChange={(e) => setVision(e.target.value)}
            className="w-full h-32 px-3 py-2 bg-gray-800 text-white rounded-lg border border-gray-700 focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
            placeholder="Describe your vision for the next 3 years..."
          />
        </div>
        <button
          onClick={handleGenerate}
          disabled={isGenerating || !vision.trim()}
          className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isGenerating ? 'Generating...' : 'Generate My OKRs'}
        </button>
      </div>

      {generatedOKRs.length > 0 && (
        <div className="space-y-6">
          <h3 className="text-lg font-medium text-white">Generated OKRs</h3>
          {generatedOKRs.map((okr) => (
            <div key={okr.id} className="p-4 bg-gray-800 rounded-lg space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-medium text-gray-300">Objective</label>
                  <button
                    onClick={() => toggleEdit(okr.id)}
                    className="text-sm text-violet-400 hover:text-violet-300"
                  >
                    {okr.isEditing ? 'Save' : 'Edit'}
                  </button>
                </div>
                {okr.isEditing ? (
                  <input
                    type="text"
                    value={okr.objective}
                    onChange={(e) => updateOKR(okr.id, 'objective', e.target.value)}
                    className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-violet-500"
                  />
                ) : (
                  <p className="text-white">{okr.objective}</p>
                )}
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium text-gray-300">Key Results</label>
                {okr.keyResults.map((kr, index) => (
                  <div key={kr.id} className="pl-4 border-l-2 border-gray-700">
                    {okr.isEditing ? (
                      <input
                        type="text"
                        value={kr.text}
                        onChange={(e) => updateOKR(okr.id, 'keyResults', e.target.value, index)}
                        className="w-full px-3 py-2 bg-gray-700 text-white rounded border border-gray-600 focus:border-violet-500"
                      />
                    ) : (
                      <p className="text-white">{kr.text}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VisionAIGenerator;
