export function getInitials(name?: string | null): string {
  if (!name) return 'NA'
  const letters = name
    .trim()
    .split(/\s+/)
    .map((w) => w[0]?.toUpperCase())
    .filter(Boolean)
    .slice(0, 2)
    .join('')
  return letters || 'NA'
}
