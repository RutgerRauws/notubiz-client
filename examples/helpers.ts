export function formatDate(date: Date | null | undefined): string {
  return date?.toISOString() ?? 'Unknown date'
}
