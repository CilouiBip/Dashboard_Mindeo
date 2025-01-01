import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import type { Vision } from '../../lib/supabase/services/visionService';
import type { GeneratedOKR } from '../../lib/supabase/services/aiService';
import { generateOKRs } from '../../lib/supabase/services/aiService';
import * as visionService from '../../lib/supabase/services/visionService';
import * as okrService from '../../lib/supabase/services/okrService';
import { useToast } from '../common/Toast';
import { SelectWithOther } from '../common/SelectWithOther';
import OKREditCard from './OKREditCard';
import {
  REVENUE_MONTHLY_OPTIONS,
  REVENUE_YEARLY_OPTIONS,
  PRODUCT_OPTIONS,
  FORM_LABELS,
  PLACEHOLDERS
} from '../../constants/visionFormConstants';

interface VisionFormData {
  vision_text: string;
  context?: string;
  main_challenges?: string;
  current_revenue?: string;
  target_revenue?: string;
  main_product?: string;
}

interface VisionAISectionProps {
  onComplete?: () => void;
}

export const VisionAISection: React.FC<VisionAISectionProps> = ({ onComplete }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<VisionFormData>({
    vision_text: '',
    context: '',
    main_challenges: '',
    current_revenue: '',
    target_revenue: '',
    main_product: ''
  });
  const [generatedOKRs, setGeneratedOKRs] = useState<GeneratedOKR[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const { addToast } = useToast();

  // Form validation
  const isFormValid = formData.vision_text.trim().length > 0;
  const hasGeneratedOKRs = generatedOKRs.length > 0;

  // Mutation to save vision and OKRs
  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!hasGeneratedOKRs) {
        throw new Error('Veuillez d\'abord générer les OKRs');
      }

      // First, create the vision
      const { data: vision, error: visionError } = await visionService.create(formData);
      if (visionError) throw new Error(`Échec de la création de la vision: ${visionError.message}`);
      if (!vision) throw new Error('Échec de la création de la vision: Aucune donnée retournée');

      // Then, create OKRs
      await Promise.all(
        generatedOKRs.map(async (okr) => {
          const { error } = await okrService.create({
            vision_id: vision.id,
            objective: okr.objective,
            key_results: okr.keyResults.map(kr => ({
              metric: kr.metric,
              target: kr.target || 0,
              current: kr.current || 0,
              unit: kr.unit || ''
            })),
            status: 'active',
            iteration: 1
          });
          if (error) throw new Error(`Échec de la création des OKRs: ${error.message}`);
        })
      );

      return vision;
    },
    onSuccess: () => {
      addToast('OKRs sauvegardés avec succès!', 'success');
      navigate('/okr-tools/okr');
      onComplete?.();
      setFormData({
        vision_text: '',
        context: '',
        main_challenges: '',
        current_revenue: '',
        target_revenue: '',
        main_product: ''
      });
      setGeneratedOKRs([]);
    },
    onError: (error) => {
      console.error('Erreur lors de la sauvegarde des OKRs:', error);
      addToast(error instanceof Error ? error.message : 'Échec de la sauvegarde des OKRs', 'error');
    }
  });

  const handleGenerate = async () => {
    if (!isFormValid) {
      addToast('Veuillez saisir votre vision', 'error');
      return;
    }

    setIsGenerating(true);
    try {
      const okrs = await generateOKRs(formData as Vision);
      setGeneratedOKRs(okrs);
      addToast('OKRs générés avec succès!', 'success');
    } catch (error) {
      let errorMessage = 'Échec de la génération des OKRs';
      if (error instanceof Error) {
        if (error.message.includes('OpenAI request failed')) {
          errorMessage = 'La requête OpenAI a échoué. Veuillez réessayer.';
        } else if (error.message.includes('Invalid JSON')) {
          errorMessage = 'Format de réponse invalide. Veuillez réessayer.';
        }
      }
      addToast(errorMessage, 'error');
      console.error('Échec de la génération des OKRs:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (field: keyof VisionFormData) => (value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleOKRChange = (index: number, updatedOKR: GeneratedOKR) => {
    setGeneratedOKRs((prev) => {
      const newOKRs = [...prev];
      newOKRs[index] = updatedOKR;
      return newOKRs;
    });
  };

  return (
    <div className="space-y-8">
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            {FORM_LABELS.vision}
          </label>
          <textarea
            name="vision_text"
            value={formData.vision_text}
            onChange={handleInputChange}
            className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
            rows={4}
            placeholder={PLACEHOLDERS.vision}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SelectWithOther
            options={REVENUE_MONTHLY_OPTIONS}
            value={formData.current_revenue || ''}
            onChange={handleSelectChange('current_revenue')}
            label={FORM_LABELS.currentRevenue}
            otherPlaceholder={PLACEHOLDERS.otherRevenue}
          />

          <SelectWithOther
            options={REVENUE_YEARLY_OPTIONS}
            value={formData.target_revenue || ''}
            onChange={handleSelectChange('target_revenue')}
            label={FORM_LABELS.targetRevenue}
            otherPlaceholder={PLACEHOLDERS.otherRevenue}
          />
        </div>

        <SelectWithOther
          options={PRODUCT_OPTIONS}
          value={formData.main_product || ''}
          onChange={handleSelectChange('main_product')}
          label={FORM_LABELS.mainProduct}
          otherPlaceholder={PLACEHOLDERS.otherProduct}
        />

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            {FORM_LABELS.context}
          </label>
          <textarea
            name="context"
            value={formData.context}
            onChange={handleInputChange}
            className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
            rows={3}
            placeholder={PLACEHOLDERS.context}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            {FORM_LABELS.mainChallenges}
          </label>
          <textarea
            name="main_challenges"
            value={formData.main_challenges}
            onChange={handleInputChange}
            className="w-full px-3 py-2 bg-gray-700 text-white rounded-lg border border-gray-600 focus:border-violet-500 focus:ring-1 focus:ring-violet-500"
            rows={3}
            placeholder={PLACEHOLDERS.challenges}
          />
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <button
          onClick={handleGenerate}
          disabled={!isFormValid || isGenerating}
          className="px-4 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isGenerating ? 'Génération...' : FORM_LABELS.generateButton}
        </button>
      </div>

      {hasGeneratedOKRs && (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-white">OKRs Générés</h2>
          <div className="space-y-6">
            {generatedOKRs.map((okr, index) => (
              <OKREditCard
                key={okr.id}
                okr={okr}
                onChange={(updatedOKR) => handleOKRChange(index, updatedOKR)}
              />
            ))}
          </div>
          <div className="flex justify-end">
            <button
              onClick={() => saveMutation.mutate()}
              disabled={saveMutation.isLoading}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {saveMutation.isLoading ? 'Sauvegarde...' : FORM_LABELS.validateButton}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VisionAISection;
