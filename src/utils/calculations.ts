export const getScoreColor = (score: number): string => {
  if (score >= 7) return 'text-green-500';
  if (score >= 4) return 'text-yellow-500';
  return 'text-red-500';
};

export const formatScore = (score: number): string => {
  return score.toFixed(1);
};