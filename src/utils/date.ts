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

export function formatDate(date: Date | null | undefined): string {
  return date?.toISOString() ?? 'Unknown date'
}
