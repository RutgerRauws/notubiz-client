import { normalizeBaseUrl } from './utils/utils'

export const DEFAULT_NOTUBIZ_BASE_URL = 'https://api.notubiz.nl/'
export const DEFAULT_NOTUBIZ_API_VERSION = '1.10.8'

export interface NotubizClientOptions {
  organisationId: number
  apiVersion?: string
  baseUrl?: string
  fetch?: typeof globalThis.fetch
}

export interface ResolvedNotubizClientOptions {
  organisationId: number
  apiVersion: string
  baseUrl: string
  fetch: typeof globalThis.fetch
}

export function resolveClientOptions(
  options: NotubizClientOptions
): ResolvedNotubizClientOptions {
  if (
    typeof options.organisationId !== 'number' ||
    !Number.isFinite(options.organisationId)
  ) {
    throw new TypeError('`organisationId` must be a finite number.')
  }

  const fetchImplementation = options.fetch ?? globalThis.fetch

  if (typeof fetchImplementation !== 'function') {
    throw new TypeError(
      'No fetch implementation is available. Provide one through the client options.'
    )
  }

  return {
    organisationId: options.organisationId,
    apiVersion: options.apiVersion ?? DEFAULT_NOTUBIZ_API_VERSION,
    baseUrl: normalizeBaseUrl(options.baseUrl ?? DEFAULT_NOTUBIZ_BASE_URL),
    fetch: fetchImplementation,
  }
}
