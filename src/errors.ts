export class NotubizApiError extends Error {
  public readonly status: number
  public readonly url: string
  public readonly responseBody: string

  public constructor(options: {
    message: string
    status: number
    url: string
    responseBody?: string
  }) {
    super(options.message)
    this.name = 'NotubizApiError'
    this.status = options.status
    this.url = options.url
    this.responseBody = options.responseBody ?? ''
  }
}
