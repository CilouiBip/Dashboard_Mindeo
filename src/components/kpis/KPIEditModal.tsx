import React, { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { X } from 'lucide-react';

interface KPIEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentValue: number;
  previousValue: number | string;
  onValidate: (newValue: number) => Promise<void>;
}

const KPIEditModal: React.FC<KPIEditModalProps> = ({
  isOpen,
  onClose,
  currentValue,
  previousValue,
  onValidate,
}) => {
  const [newValue, setNewValue] = useState(currentValue.toString());
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleValidate = async () => {
    try {
      setIsSubmitting(true);
      await onValidate(Number(newValue));
      onClose();
    } catch (error) {
      console.error('Error updating KPI:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setNewValue(currentValue.toString());
    onClose();
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="relative z-50"
    >
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="mx-auto max-w-sm rounded-lg bg-[#1C1D24] border border-[#2D2E3A]">
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <Dialog.Title className="text-lg font-medium text-white">
                Modifier la valeur
              </Dialog.Title>
              <button
                onClick={handleCancel}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="block text-sm text-gray-400">
                  Valeur Précédente
                </label>
                <div className="text-white font-medium">
                  {previousValue}
                </div>
              </div>
              <div className="space-y-2">
                <label className="block text-sm text-gray-400">
                  Nouvelle Valeur
                </label>
                <input
                  type="number"
                  value={newValue}
                  onChange={(e) => setNewValue(e.target.value)}
                  className="w-full px-3 py-2 bg-[#2D2E3A] border border-[#3E3F4A] rounded-md text-white focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <button
                onClick={handleCancel}
                className="px-4 py-2 text-sm font-medium text-gray-400 hover:text-white transition-colors"
                disabled={isSubmitting}
              >
                Annuler
              </button>
              <button
                onClick={handleValidate}
                disabled={isSubmitting}
                className="px-4 py-2 text-sm font-medium bg-violet-500 text-white rounded-md hover:bg-violet-600 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:ring-offset-2 focus:ring-offset-[#1C1D24] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? 'Mise à jour...' : 'Valider'}
              </button>
            </div>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};

export default KPIEditModal;
