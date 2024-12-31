export const getProgressBarColor = (score: number): string => {
  if (score >= 8) return 'from-emerald-500/20 to-emerald-500';
  if (score >= 6) return 'from-amber-500/20 to-amber-500';
  return 'from-red-500/20 to-red-500';
};

export const getScoreColor = (score: number): string => {
  if (score >= 8) return 'text-emerald-500';
  if (score >= 6) return 'text-amber-500';
  return 'text-red-500';
};
