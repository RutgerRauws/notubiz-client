import { createClient } from './client'
import { formatDate } from '../src/utils/utils'

async function main(): Promise<void> {
  const client = createClient()
  const modules = await client.modules.getAll()

  for (const module of modules) {
    console.log(`Module ${module.id}: ${module.name}`)
  }
}

void main().catch((error: unknown) => {
  console.error(error)
  process.exitCode = 1
})
