export const REVENUE_MONTHLY_OPTIONS = [
  { value: 'less_5k', label: 'Moins de 5 000 €/mois' },
  { value: '5k_10k', label: 'Entre 5 000 € et 10 000 €/mois' },
  { value: '10k_20k', label: 'Entre 10 000 € et 20 000 €/mois' },
  { value: 'more_20k', label: 'Plus de 20 000 €/mois' },
  { value: 'other', label: 'Autre...' }
] as const;

export const REVENUE_YEARLY_OPTIONS = [
  { value: 'less_50k', label: 'Moins de 50 000 €/an' },
  { value: '50k_100k', label: 'Entre 50 000 € et 100 000 €/an' },
  { value: '100k_300k', label: 'Entre 100 000 € et 300 000 €/an' },
  { value: 'more_300k', label: 'Plus de 300 000 €/an' },
  { value: 'other', label: 'Autre...' }
] as const;

export const PRODUCT_OPTIONS = [
  { value: 'online_course', label: 'Formation en ligne' },
  { value: 'coaching', label: 'Coaching / Consulting' },
  { value: 'membership', label: 'Membership / Abonnement' },
  { value: 'mastermind', label: 'Mastermind' },
  { value: 'other', label: 'Autre...' }
] as const;

export const FORM_LABELS = {
  vision: 'Vision à 3 ans *',
  currentRevenue: 'Revenu actuel',
  targetRevenue: 'Revenu cible',
  mainProduct: 'Produit/Service principal',
  context: 'Contexte (Optionnel)',
  mainChallenges: 'Défis principaux (Optionnel)',
  generateButton: 'Générer mes OKRs',
  validateButton: 'Valider les OKRs',
  otherSpecify: 'Veuillez préciser',
  specifyOffer: 'Préciser votre offre'
} as const;

export const PLACEHOLDERS = {
  vision: 'Décrivez votre vision pour les 3 prochaines années...',
  context: 'Tout contexte additionnel sur votre entreprise...',
  challenges: 'Défis ou obstacles actuels...',
  otherRevenue: 'Ex: 15 000 €/mois',
  otherProduct: 'Ex: Service sur mesure'
} as const;
