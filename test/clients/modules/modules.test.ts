import { describe, expect, it, vi } from 'vitest'

import { NotubizClient } from '../../../src/notubiz-client'
import module4DetailsFixture from './data/module-4-details.json'
import module8DetailsFixture from './data/module-8-details.json'
import modulesFixture from './data/modules.json'

function createJsonResponse(payload: unknown, status = 200): Response {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      'content-type': 'application/json',
    },
  })
}

describe('ModulesClient', () => {
  it('fetches all modules and maps the response payload', async () => {
    const fetchMock = vi.fn(async (_input: RequestInfo | URL) =>
      createJsonResponse(modulesFixture)
    )

    const client = new NotubizClient({
      organisationId: 686,
      fetch: fetchMock as typeof globalThis.fetch,
    })

    const modules = await client.modules.getAll()

    expect(modules.length).toBe(19)
    expect(modules.findByModuleId(1)).toMatchObject({
      id: 1,
      name: 'Ingekomen stukken',
      customName: '',
    })
    expect(modules.findByModuleId(20)).toMatchObject({
      id: 20,
      name: 'Burgerbrieven',
      customName: '',
    })

    expect(fetchMock).toHaveBeenCalledTimes(1)

    const firstRequestInput = fetchMock.mock.calls[0]?.[0]

    if (firstRequestInput === undefined) {
      throw new Error('Expected fetch to be called with a request URL.')
    }

    const requestUrl = new URL(firstRequestInput.toString())
    expect(requestUrl.pathname).toBe('/modules')
  })

  it('fetches module details by id', async () => {
    const fetchMock = vi.fn(async (_input: RequestInfo | URL) =>
      createJsonResponse(module4DetailsFixture)
    )

    const client = new NotubizClient({
      organisationId: 686,
      fetch: fetchMock as typeof globalThis.fetch,
    })

    const moduleDetails = await client.modules.getById(6)

    expect(moduleDetails.items).toHaveLength(5)

    const firstItem = moduleDetails.toArray()[0]
    expect(firstItem).toMatchObject({
      id: 1008339,
      name: 'Toegankelijkheid - OV concessie (Agenderingsverzoek 50PLUS, SP, LPF, Volt, FvD en VVD)',
      confidential: false,
      permissionGroup: 'public',
    })
    expect(firstItem.creationDate).toBeNull()
    expect(firstItem.lastModified).toEqual(new Date(2025, 0, 9, 15, 23, 18))
    expect(firstItem.attributes).toHaveLength(8)
    expect(firstItem.attachments).toHaveLength(0)

    // Check a multi-valued attribute (Portefeuillehouder)
    const portefeuillehouder = firstItem.attributes.find(
      (a) => a.label === 'Portefeuillehouder'
    )
    expect(portefeuillehouder).toBeDefined()
    expect(portefeuillehouder!.multiple).toBe(true)
    expect(portefeuillehouder!.references).toHaveLength(1)
    expect(portefeuillehouder!.references[0]).toMatchObject({
      id: 248564,
      value: 'R. Strijk (Wethouder)',
      referenceModel: 'role',
    })

    const lastItem = moduleDetails.toArray()[4]
    expect(lastItem).toMatchObject({
      id: 1008309,
      name: 'Uniforme gebiedskaders - Rekenkamerrapport - Woningbouw in Eindhoven: lerend tot versnelling komen',
    })

    expect(fetchMock).toHaveBeenCalledTimes(1)

    const firstRequestInput = fetchMock.mock.calls[0]?.[0]

    if (firstRequestInput === undefined) {
      throw new Error('Expected fetch to be called with a request URL.')
    }

    const requestUrl = new URL(firstRequestInput.toString())
    expect(requestUrl.pathname).toBe('/modules/6/items/')
  })

  it('fetches module details with attachments', async () => {
    const fetchMock = vi.fn(async (_input: RequestInfo | URL) =>
      createJsonResponse(module8DetailsFixture)
    )

    const client = new NotubizClient({
      organisationId: 686,
      fetch: fetchMock as typeof globalThis.fetch,
    })

    const moduleDetails = await client.modules.getById(
      8,
      new Date(2025, 0, 1),
      new Date(2026, 11, 31)
    )

    expect(moduleDetails.items).toHaveLength(48)

    const firstItem = moduleDetails.toArray()[0]
    expect(firstItem).toMatchObject({
      id: 1139066,
      confidential: false,
      permissionGroup: 'public',
    })
    expect(firstItem.name).toContain(
      'Raadsbrief Voortgang optimaliseren Ondernemers Dienstverlening'
    )
    expect(firstItem.lastModified).toEqual(new Date(2026, 2, 4, 11, 4, 16))
    expect(firstItem.attributes).toHaveLength(5)
    expect(firstItem.attachments).toHaveLength(2)
    expect(firstItem.attachments[0]).toMatchObject({
      type: 'document',
      title: 'Bijlage 1 -Flyer Regeldruk verlagen door Snappen of Schrappen',
      filetype: 'pdf',
      url: 'https://api.notubiz.nl/document/16668794/1',
    })

    // Item without attachments
    const secondItem = moduleDetails.toArray()[1]
    expect(secondItem).toMatchObject({
      id: 1139068,
    })
    expect(secondItem.attachments).toHaveLength(0)

    expect(fetchMock).toHaveBeenCalledTimes(1)

    const firstRequestInput = fetchMock.mock.calls[0]?.[0]

    if (firstRequestInput === undefined) {
      throw new Error('Expected fetch to be called with a request URL.')
    }

    const requestUrl = new URL(firstRequestInput.toString())
    expect(requestUrl.pathname).toBe('/modules/8/items/')
  })
})
