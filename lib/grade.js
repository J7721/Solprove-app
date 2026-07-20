// Rough accuracy → estimated GCSE grade mapping.
//
// This is NOT an official exam board grade boundary lookup. Real boundaries are set per exam
// series against raw marks totalled across all three papers, and can't be reconstructed
// from topic-quiz accuracy. This is a simplified estimate from marked-question accuracy,
// and must always be labelled as an estimate in the UI — never presented as a prediction.

const BANDS = [
  { min: 0.90, grade: 9 },
  { min: 0.80, grade: 8 },
  { min: 0.70, grade: 7 },
  { min: 0.60, grade: 6 },
  { min: 0.50, grade: 5 },
  { min: 0.40, grade: 4 },
  { min: 0.30, grade: 3 },
  { min: 0.20, grade: 2 },
  { min: 0, grade: 1 },
];

// Below this many marked attempts, the estimate is too noisy to show.
export const MIN_ATTEMPTS_FOR_ESTIMATE = 5;

export function estimateGrade(accuracy, attemptsCount) {
  if (accuracy == null || attemptsCount == null || attemptsCount < MIN_ATTEMPTS_FOR_ESTIMATE) return null;
  const band = BANDS.find(b => accuracy >= b.min) || BANDS[BANDS.length - 1];
  return { grade: band.grade, accuracy };
}
