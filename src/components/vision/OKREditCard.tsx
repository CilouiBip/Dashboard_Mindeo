import React from 'react';
import type { GeneratedOKR, KeyResult } from '../../lib/supabase/services/aiService';

interface OKREditCardProps {
  okr: GeneratedOKR;
  onChange?: (updatedOKR: GeneratedOKR) => void;
  onAddKeyResult?: () => void;
  onRemoveKeyResult?: (krIndex: number) => void;
}

const OKREditCard: React.FC<OKREditCardProps> = ({
  okr,
  onChange,
  onAddKeyResult,
  onRemoveKeyResult
}) => {
  const handleObjectiveChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (onChange) {
      onChange({
        ...okr,
        objective: e.target.value
      });
    }
  };

  const handleKeyResultChange = (index: number, field: keyof KeyResult, value: string | number | string[]) => {
    if (onChange) {
      const updatedKeyResults = [...okr.keyResults];
      updatedKeyResults[index] = {
        ...updatedKeyResults[index],
        [field]: value
      };
      onChange({
        ...okr,
        keyResults: updatedKeyResults
      });
    }
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Objective
        </label>
        <textarea
          value={okr.objective}
          onChange={handleObjectiveChange}
          className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
          rows={2}
        />
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="block text-sm font-medium text-gray-300">
            Key Results
          </label>
          {onAddKeyResult && (
            <button
              onClick={onAddKeyResult}
              className="text-sm px-3 py-1 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors"
            >
              Add Key Result
            </button>
          )}
        </div>

        <div className="space-y-6">
          {okr.keyResults.map((kr, krIndex) => (
            <div key={kr.id} className="space-y-4 p-4 bg-gray-700 rounded-lg">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Key Result {krIndex + 1}
                </label>
                <textarea
                  value={kr.kr}
                  onChange={(e) => handleKeyResultChange(krIndex, 'kr', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-600 text-white rounded-lg border border-gray-500 focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
                  rows={2}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Target
                </label>
                <input
                  type="text"
                  value={kr.target || ''}
                  onChange={(e) => handleKeyResultChange(krIndex, 'target', e.target.value)}
                  className="w-full px-3 py-2 bg-gray-600 text-white rounded-lg border border-gray-500 focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
                  placeholder="e.g. 100000"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Initiatives (2-4)
                </label>
                <div className="space-y-2">
                  {kr.initiatives.map((initiative, initIndex) => (
                    <div key={initIndex} className="flex gap-2">
                      <textarea
                        value={initiative}
                        onChange={(e) => {
                          const newInitiatives = [...kr.initiatives];
                          newInitiatives[initIndex] = e.target.value;
                          handleKeyResultChange(krIndex, 'initiatives', newInitiatives);
                        }}
                        className="flex-1 px-3 py-2 bg-gray-600 text-white rounded-lg border border-gray-500 focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
                        rows={2}
                      />
                      {kr.initiatives.length > 2 && (
                        <button
                          onClick={() => {
                            const newInitiatives = kr.initiatives.filter((_, i) => i !== initIndex);
                            handleKeyResultChange(krIndex, 'initiatives', newInitiatives);
                          }}
                          className="p-2 text-gray-400 hover:text-red-500"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                      )}
                    </div>
                  ))}
                  {kr.initiatives.length < 4 && (
                    <button
                      onClick={() => {
                        const newInitiatives = [...kr.initiatives, ''];
                        handleKeyResultChange(krIndex, 'initiatives', newInitiatives);
                      }}
                      className="w-full py-2 px-4 bg-gray-600 text-gray-300 rounded-lg hover:bg-gray-500 transition-colors"
                    >
                      + Add Initiative
                    </button>
                  )}
                </div>
              </div>

              {onRemoveKeyResult && okr.keyResults.length > 2 && (
                <button
                  onClick={() => onRemoveKeyResult(krIndex)}
                  className="text-red-500 hover:text-red-400"
                >
                  Remove Key Result
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OKREditCard;
