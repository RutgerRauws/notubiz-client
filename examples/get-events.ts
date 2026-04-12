import { createClient } from './client'
import { formatDate } from './helpers'

async function main(): Promise<void> {
  const client = createClient()
  const dateFrom = new Date(2025, 0, 5)
  const dateTo = new Date(2025, 0, 7, 23, 59, 59)
  const events = await client.events.list({
    dateFrom,
    dateTo,
  })

  for (const event of events) {
    const startDate = event.plannings[0]?.startDate
    const title = event.title ?? 'Untitled event'
    const location = event.location ?? 'Unknown location'

    console.log(`${formatDate(startDate)} - ${title} (${location})`)
  }
}

void main().catch((error: unknown) => {
  console.error(error)
  process.exitCode = 1
})
