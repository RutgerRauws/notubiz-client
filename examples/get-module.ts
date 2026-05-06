import { createClient } from './client'

async function main(): Promise<void> {
  //await listAllModules()
  //await fetchMotions()
  await fetchCouncilProposals()
}

void main().catch((error: unknown) => {
  console.error(error)
  process.exitCode = 1
})

async function listAllModules(): Promise<void> {
  const client = createClient()
  const modules = await client.modules.getAll()

  for (const module of modules) {
    console.log(`Module ${module.id}: ${module.name}`)
  }
}

async function fetchMotions(): Promise<void> {
  const client = createClient()
  const modules = await client.modules.getAll()

  const motionsModuleId = modules.findByName('Moties')?.id
  if (motionsModuleId === undefined) {
    console.error('Motions module not found.')
    return
  }

  const startDate = new Date(2025, 1, 1)
  const endDate = new Date(2025, 2, 1)

  const motionsModule = await client.modules.getById(
    motionsModuleId,
    startDate,
    endDate
  )
  console.log(motionsModule)
}

async function fetchCouncilProposals(): Promise<void> {
  const client = createClient()

  const startDate = new Date(2025, 1, 1)
  const endDate = new Date(2025, 2, 1)

  const proposals = await client.modules.getById(19, startDate, endDate) //For Eindhoven this contains the council proposals

  for (const proposal of proposals) {
    console.log(proposal.name)
    for (const attribute of proposal.attributes) {
      console.log(`- ${attribute.label}: ${attribute.value}`)
    }
  }
}
