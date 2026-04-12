import { createClient } from './client'
import { formatDate } from './helpers'

async function main(): Promise<void> {
  const client = createClient()
  const meeting = await client.meetings.get(1147925)

  console.log(meeting.title ?? 'Untitled meeting')

  for (const agendaItem of meeting.agendaItems) {
    const title = agendaItem.title ?? 'Untitled agenda item'
    console.log(`  ${formatDate(agendaItem.startDate)} - ${title}`)

    for (const subAgendaItem of agendaItem.agendaItems) {
      const subAgendaItemTitle = subAgendaItem.title ?? 'Untitled agenda item'
      console.log(`                      - ${subAgendaItemTitle}`)
    }
  }
}

void main().catch((error: unknown) => {
  console.error(error)
  process.exitCode = 1
})
