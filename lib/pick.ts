/** Picks n distinct items in random order (partial Fisher-Yates). */
export function pickRandom<T>(pool: readonly T[], n: number, random: () => number = Math.random): T[] {
  const a = [...pool];
  const count = Math.min(n, a.length);
  for (let i = 0; i < count; i++) {
    const j = i + Math.floor(random() * (a.length - i));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a.slice(0, count);
}
