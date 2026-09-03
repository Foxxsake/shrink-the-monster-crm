export function calculateClutterPercentage(unwantedCount: number, keptCount: number): number {
  if (unwantedCount === 0 && keptCount === 0) return 0;
  return Math.round((unwantedCount / (unwantedCount + keptCount)) * 100);
}
