import { type ResolvedNotubizClientOptions } from './configuration'
import { NotubizApiError } from './errors'
import { formatNotubizDate } from './utils'

export interface RequestOptions {
  signal?: AbortSignal
}

export type QueryPrimitive = string | number | boolean | Date
export type QueryValue = QueryPrimitive | QueryPrimitive[] | null | undefined
export type QueryParams = Record<string, QueryValue>

export class HttpClient {
  private readonly baseUrl: string
  private readonly apiVersion: string
  private readonly fetchImplementation: typeof globalThis.fetch

  public readonly organisationId: number

  public constructor(options: ResolvedNotubizClientOptions) {
    this.baseUrl = options.baseUrl
    this.apiVersion = options.apiVersion
    this.fetchImplementation = options.fetch
    this.organisationId = options.organisationId
  }

  public async getJson<T>(
    path: string,
    params: QueryParams = {},
    options: RequestOptions = {}
  ): Promise<T> {
    const url = new URL(path.replace(/^\//, ''), this.baseUrl)
    const searchParams = this.createBaseSearchParams()

    for (const [key, value] of Object.entries(params)) {
      this.appendSearchParam(searchParams, key, value)
    }

    url.search = searchParams.toString()

    const response = await this.fetchImplementation(url, {
      method: 'GET',
      headers: {
        accept: 'application/json',
      },
      signal: options.signal,
    })

    if (!response.ok) {
      throw new NotubizApiError({
        message: `Notubiz request failed with status ${response.status}.`,
        status: response.status,
        url: url.toString(),
        responseBody: await response.text(),
      })
    }

    return (await response.json()) as T
  }

  private createBaseSearchParams(): URLSearchParams {
    const searchParams = new URLSearchParams()

    searchParams.set('format', 'json')
    searchParams.set('version', this.apiVersion)
    searchParams.set('organisation', String(this.organisationId))

    return searchParams
  }

  private appendSearchParam(
    searchParams: URLSearchParams,
    key: string,
    value: QueryValue
  ): void {
    if (value === null || value === undefined) {
      return
    }

    if (Array.isArray(value)) {
      for (const item of value) {
        this.appendSearchParam(searchParams, key, item)
      }

      return
    }

    if (value instanceof Date) {
      searchParams.append(key, formatNotubizDate(value))
      return
    }

    searchParams.append(key, String(value))
  }
}
