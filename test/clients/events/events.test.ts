import { describe, expect, it } from 'vitest'

import { mapEvent } from '../../../src/serializers'
import eventsFixture from './data/events.json'

describe('events serializer', () => {
  it('maps the paginated events payload', () => {
    const events = eventsFixture.events.map((event) => mapEvent(event))

    expect(events).toHaveLength(200)
  })

  it('maps general event information', () => {
    const events = eventsFixture.events.map((event) => mapEvent(event))
    const event = events[2]

    expect(event).toMatchObject({
      id: 1011864,
      title: 'Nieuwjaarsbijeenkomst Raad en College',
      location: 'Stadhuis',
      gremiumId: 6024,
    })
    expect(event.plannings).toHaveLength(1)
    expect(event.plannings[0].startDate).toEqual(
      new Date(2019, 0, 7, 16, 15, 0)
    )
    expect(event.plannings[0].endDate).toBeNull()
  })
})
