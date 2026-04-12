export function normalizeBaseUrl(baseUrl: string): string {
  return baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`
}

export function formatNotubizDate(date: Date): string {
  const pad = (value: number): string => String(value).padStart(2, '0')

  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(
    date.getDate()
  )} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(
    date.getSeconds()
  )}`
}

export function parseNotubizDate(value: unknown): Date | null {
  if (typeof value !== 'string' || value.trim() === '') {
    return null
  }

  const match = /^(\d{4})-(\d{2})-(\d{2}) (\d{2}):(\d{2}):(\d{2})$/.exec(
    value.trim()
  )

  if (match === null) {
    throw new TypeError(`Invalid Notubiz date value: ${String(value)}`)
  }

  const [, year, month, day, hour, minute, second] = match

  return new Date(
    Number(year),
    Number(month) - 1,
    Number(day),
    Number(hour),
    Number(minute),
    Number(second)
  )
}

export function toBoolean(value: unknown): boolean {
  return value === true || value === 1 || value === '1'
}

export function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

export function getNumber(value: unknown): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value
  }

  if (typeof value === 'string' && value.trim() !== '') {
    const parsedValue = Number(value)

    return Number.isFinite(parsedValue) ? parsedValue : null
  }

  return null
}

export function getString(value: unknown): string | null {
  return typeof value === 'string' ? value : null
}

export function toRecordArray(value: unknown): Array<Record<string, unknown>> {
  if (!Array.isArray(value)) {
    return []
  }

  return value.filter(isRecord)
}

export function requireRecord(
  value: unknown,
  context: string
): Record<string, unknown> {
  if (!isRecord(value)) {
    throw new TypeError(`Expected ${context} to be an object.`)
  }

  return value
}

export function requireNumber(value: unknown, context: string): number {
  const parsedValue = getNumber(value)

  if (parsedValue === null) {
    throw new TypeError(`Expected ${context} to be a number.`)
  }

  return parsedValue
}

export function requireDate(value: unknown, context: string): Date {
  const parsedValue = parseNotubizDate(value)

  if (parsedValue === null) {
    throw new TypeError(`Expected ${context} to be a Notubiz date string.`)
  }

  return parsedValue
}
