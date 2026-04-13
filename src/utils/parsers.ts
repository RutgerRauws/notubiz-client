import { isRecord } from './type-guards'

export function toBoolean(value: unknown): boolean {
  return value === true || value === 1 || value === '1'
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
