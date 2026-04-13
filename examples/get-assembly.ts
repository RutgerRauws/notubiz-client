import { createClient } from './client'
import { formatDate } from '../src/utils/utils'

async function main(): Promise<void> {
  const client = createClient()
  const assembly = await client.assemblies.get(1253866)

  for (const assemblyMeeting of assembly.meetings) {
    const meeting = await client.meetings.get(assemblyMeeting.id)
    const startDate = assemblyMeeting.plannings[0]?.startDate
    const title = meeting.title ?? 'Untitled meeting'
    const location = meeting.location ?? 'Unknown location'

    console.log(`${formatDate(startDate)} - ${title} (${location})`)
  }
}

void main().catch((error: unknown) => {
  console.error(error)
  process.exitCode = 1
})
