import { NotubizClient } from '../src'

export const organisationId = 686 // Gemeente Eindhoven

export function createClient(): NotubizClient {
  return new NotubizClient({
    organisationId,
  })
}
