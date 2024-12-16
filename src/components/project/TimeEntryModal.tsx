import React from 'react';

interface TimeEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (hours: number) => void;
  type: 'estimate' | 'actual';
  initialValue?: number;
  actionName: string;
}

const PREDEFINED_HOURS = [0.5, 1, 2, 4, 8];

export const TimeEntryModal: React.FC<TimeEntryModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  type,
  initialValue = 0,
  actionName
}) => {
  const [hours, setHours] = React.useState<number>(initialValue || 0);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(hours);
    onClose();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    if (!isNaN(value) && value >= 0) {
      setHours(value);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full">
        <h2 className="text-xl font-bold text-gray-200 mb-4">
          {type === 'estimate' ? 'Estimer le temps' : 'Temps réel passé'}
        </h2>
        <p className="text-gray-300 mb-4">
          {actionName}
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Boutons de durée prédéfinie */}
          <div className="flex flex-wrap gap-2">
            {PREDEFINED_HOURS.map(value => (
              <button
                key={value}
                type="button"
                onClick={() => setHours(value)}
                className={`px-3 py-1 rounded ${
                  hours === value 
                    ? 'bg-purple-600 text-white' 
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {value}h
              </button>
            ))}
          </div>

          {/* Saisie manuelle */}
          <div>
            <label className="block text-gray-300 mb-2">
              {type === 'estimate' ? 'Heures estimées' : 'Heures réelles'}
            </label>
            <input
              type="number"
              min="0"
              step="0.5"
              value={hours}
              onChange={handleInputChange}
              className="w-full px-3 py-2 bg-gray-700 text-white rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-300 hover:text-white"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
            >
              Valider
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
