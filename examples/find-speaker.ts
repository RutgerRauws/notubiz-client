import { createClient } from './client'

async function main(): Promise<void> {
  const client = createClient()
  const speakers = await client.speakers.get()
  const speaker = speakers.findByPersonId(194366)

  if (speaker == null) {
    console.log('No speaker found for person 194366.')
    return
  }

  console.log(speaker.fullName)
}

void main().catch((error: unknown) => {
  console.error(error)
  process.exitCode = 1
})
