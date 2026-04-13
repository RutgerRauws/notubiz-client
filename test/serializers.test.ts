import { describe, expect, it } from 'vitest'

import {
  mapAssemblyResponse,
  mapEvent,
  mapMeetingResponse,
  mapSpeakersResponse,
} from '../src/serializers'
import assemblyFixture from './clients/assemblies/data/assembly.json'
import eventsFixture from './clients/events/data/events.json'
import meetingFixture from './clients/meetings/data/meeting.json'
import speakersFixture from './clients/speakers/data/speakers.json'

describe('serializers', () => {
  it('maps paginated events into typed domain objects', () => {
    const events = eventsFixture.events.map((event) => mapEvent(event))

    expect(events).toHaveLength(200)
    expect(events[2]).toMatchObject({
      id: 1011864,
      title: 'Nieuwjaarsbijeenkomst Raad en College',
      location: 'Stadhuis',
      gremiumId: 6024,
    })
    expect(events[2].plannings[0].startDate).toEqual(
      new Date(2019, 0, 7, 16, 15, 0)
    )
    expect(events[2].plannings[0].endDate).toBeNull()
  })

  it('maps a meeting with nested agenda items and documents', () => {
    const meeting = mapMeetingResponse(meetingFixture)

    expect(meeting).toMatchObject({
      id: 1147925,
      title: 'Meningsvorming Raadzaal',
      location: 'Raadzaal',
      url: 'https://eindhoven.raadsinformatie.nl/vergadering/1147925/Meningsvorming+Raadzaal',
    })
    expect(meeting.agendaItems).toHaveLength(7)
    expect(meeting.agendaItems[2]).toMatchObject({
      id: 8329704,
      title: 'Pauze',
      description: null,
      isHeading: true,
    })
    expect(meeting.agendaItems[2].startDate).toEqual(
      new Date(2024, 3, 16, 18, 0, 0)
    )
    expect(meeting.agendaItems[2].endDate).toEqual(
      new Date(2024, 3, 16, 19, 0, 0)
    )
    expect(meeting.agendaItems[3].agendaItems).toHaveLength(1)
    expect(meeting.agendaItems[4].agendaItems).toHaveLength(2)
    expect(meeting.agendaItems[5].documents[1]).toMatchObject({
      title: 'Concept Vrije Motie Woonraad (GL)',
    })
    expect(meeting.agendaItems[5].documents[1].versions[0]).toMatchObject({
      id: 1,
      mimeType: 'application/pdf',
    })
  })

  it('maps an assembly and preserves shared event fields', () => {
    const assembly = mapAssemblyResponse(assemblyFixture)

    expect(assembly).toMatchObject({
      id: 1253866,
      title: 'Raadsavond',
      location: 'Raadzaal / commissiekamer',
    })
    expect(assembly.plannings[0].startDate).toEqual(
      new Date(2025, 0, 7, 14, 0, 0)
    )
    expect(assembly.meetings).toHaveLength(3)
    expect(assembly.meetings[0]).toMatchObject({ id: 1253869, order: 1 })
    expect(assembly.meetings[2].plannings[0].endDate).toEqual(
      new Date(2025, 0, 7, 21, 0, 0)
    )
  })

  it('maps speakers and provides lookup helpers', () => {
    const speakers = mapSpeakersResponse(speakersFixture)

    expect(speakers.length).toBe(3)
    expect(speakers.findBySpeakerId(1)?.firstname).toBe('Rutger')
    expect(speakers.findBySpeakerId(3)?.firstname).toBe('Jans')
    expect(speakers.findByPersonId(2)?.firstname).toBe('Jans')
    expect(speakers.findByPersonId(99)).toBeNull()
    expect(speakers.findBySpeakerId(2)?.fullName).toBe('Rutger Rauws')
  })
})
