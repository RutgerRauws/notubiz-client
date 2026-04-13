export function normalizeBaseUrl(baseUrl: string): string {
  return baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`
}
