import { parseNotubizDate } from './date'
import { getNumber } from './parsers'
import { isRecord } from './type-guards'

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
