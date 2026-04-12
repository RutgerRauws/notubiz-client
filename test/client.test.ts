import { describe, expect, it, vi } from 'vitest'

import { NotubizApiError } from '../src/errors'
import { NotubizClient } from '../src/notubiz-client'
import assemblyFixture from './data/assembly.json'
import eventsFixture from './data/events.json'
import meetingFixture from './data/meeting.json'
import speakersFixture from './data/speakers.json'

function createJsonResponse(payload: unknown, status = 200): Response {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      'content-type': 'application/json',
    },
  })
}

describe('NotubizClient', () => {
  it('paginates the events endpoint and includes required query parameters', async () => {
    const firstPage = {
      ...eventsFixture,
      events: eventsFixture.events.slice(0, 2),
      pagination: {
        ...eventsFixture.pagination,
        page: 1,
        has_more_pages: true,
      },
    }
    const secondPage = {
      ...eventsFixture,
      events: eventsFixture.events.slice(2, 4),
      pagination: {
        ...eventsFixture.pagination,
        page: 2,
        has_more_pages: false,
      },
    }

    const fetchMock = vi.fn(async (input: RequestInfo | URL) => {
      const url = new URL(input.toString())
      const page = url.searchParams.get('page')

      return createJsonResponse(page === '2' ? secondPage : firstPage)
    })

    const client = new NotubizClient({
      organisationId: 686,
      fetch: fetchMock as typeof globalThis.fetch,
    })

    const events = await client.events.list({
      dateFrom: new Date(2019, 0, 1, 0, 0, 0),
      dateTo: new Date(2020, 2, 31, 23, 59, 59),
      gremia: [6024],
    })

    expect(events).toHaveLength(4)
    expect(events[0].id).toBe(1011862)
    expect(fetchMock).toHaveBeenCalledTimes(2)

    const firstRequestUrl = new URL(fetchMock.mock.calls[0][0].toString())
    expect(firstRequestUrl.pathname).toBe('/events/')
    expect(firstRequestUrl.searchParams.get('format')).toBe('json')
    expect(firstRequestUrl.searchParams.get('version')).toBe('1.10.8')
    expect(firstRequestUrl.searchParams.get('organisation')).toBe('686')
    expect(firstRequestUrl.searchParams.get('organisation_id')).toBe('686')
    expect(firstRequestUrl.searchParams.get('date_from')).toBe(
      '2019-01-01 00:00:00'
    )
    expect(firstRequestUrl.searchParams.get('date_to')).toBe(
      '2020-03-31 23:59:59'
    )
    expect(firstRequestUrl.searchParams.getAll('gremia')).toEqual(['6024'])
  })

  it('hydrates typed objects from the dedicated endpoints', async () => {
    const fetchMock = vi.fn(async (input: RequestInfo | URL) => {
      const url = new URL(input.toString())

      if (url.pathname.endsWith('/events/meetings/1147925')) {
        return createJsonResponse(meetingFixture)
      }

      if (url.pathname.endsWith('/events/assemblies/1253866')) {
        return createJsonResponse(assemblyFixture)
      }

      if (url.pathname.endsWith('/speakers')) {
        return createJsonResponse(speakersFixture)
      }

      return createJsonResponse({}, 404)
    })

    const client = new NotubizClient({
      organisationId: 686,
      fetch: fetchMock as typeof globalThis.fetch,
    })

    const [meeting, assembly, speakers] = await Promise.all([
      client.meetings.get(1147925),
      client.assemblies.get(1253866),
      client.speakers.get(),
    ])

    expect(meeting.title).toBe('Meningsvorming Raadzaal')
    expect(assembly.meetings[1].order).toBe(4)
    expect(speakers.findByPersonId(1)?.function).toBe('Commissielid')
  })

  it('raises a dedicated API error for failing requests', async () => {
    const fetchMock = vi.fn(async () =>
      createJsonResponse({ error: 'unavailable' }, 503)
    )
    const client = new NotubizClient({
      organisationId: 686,
      fetch: fetchMock as typeof globalThis.fetch,
    })

    await expect(client.meetings.get(1147925)).rejects.toMatchObject({
      name: 'NotubizApiError',
      status: 503,
    } satisfies Partial<NotubizApiError>)
  })
})
