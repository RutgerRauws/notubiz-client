import { describe, expect, it } from 'vitest'

import { mapMeetingResponse } from '../../../src/serializers'
import meetingFixture from './data/meeting.json'

describe('meeting serializer', () => {
  it('maps general meeting information', () => {
    const meeting = mapMeetingResponse(meetingFixture)

    expect(meeting).toMatchObject({
      id: 1147925,
      url: 'https://eindhoven.raadsinformatie.nl/vergadering/1147925/Meningsvorming+Raadzaal',
      title: 'Meningsvorming Raadzaal',
      location: 'Raadzaal',
    })
    expect(meeting.agendaItems).toHaveLength(7)
  })

  it('maps a basic agenda item', () => {
    const meeting = mapMeetingResponse(meetingFixture)
    const agendaItem = meeting.agendaItems[2]

    expect(agendaItem).toMatchObject({
      id: 8329704,
      title: 'Pauze',
      description: null,
      isHeading: true,
    })
    expect(agendaItem.lastModified).toEqual(new Date(2024, 2, 29, 10, 8, 56))
    expect(agendaItem.startDate).toEqual(new Date(2024, 3, 16, 18, 0, 0))
    expect(agendaItem.endDate).toEqual(new Date(2024, 3, 16, 19, 0, 0))
  })

  it('maps nested agenda items', () => {
    const meeting = mapMeetingResponse(meetingFixture)
    const agendaItems = meeting.agendaItems

    expect(agendaItems[0].agendaItems).toHaveLength(0)
    expect(agendaItems[1].agendaItems).toHaveLength(0)
    expect(agendaItems[2].agendaItems).toHaveLength(0)
    expect(agendaItems[3].agendaItems).toHaveLength(1)
    expect(agendaItems[4].agendaItems).toHaveLength(2)
    expect(agendaItems[5].agendaItems).toHaveLength(0)
    expect(agendaItems[6].agendaItems).toHaveLength(0)

    expect(agendaItems[3]).toMatchObject({
      title: 'Hamerstukken',
      description: 'Woordmelding',
    })
    expect(agendaItems[4]).toMatchObject({
      title: 'In samenhang behandelen (agendapunt 4.1 en 4.2):',
      description: null,
    })

    expect(agendaItems[3].agendaItems[0].agendaItems).toHaveLength(0)
    expect(agendaItems[4].agendaItems[0].agendaItems).toHaveLength(0)
    expect(agendaItems[4].agendaItems[1].agendaItems).toHaveLength(0)
  })

  it('maps documents on agenda items', () => {
    const meeting = mapMeetingResponse(meetingFixture)

    expect(meeting.agendaItems[0].documents).toHaveLength(0)
    expect(meeting.agendaItems[5].documents).toHaveLength(4)
    expect(meeting.agendaItems[5].documents[1]).toMatchObject({
      title: 'Concept Vrije Motie Woonraad (GL)',
    })
    expect(meeting.agendaItems[5].documents[1].versions[0]).toMatchObject({
      mimeType: 'application/pdf',
      id: 1,
    })
  })
})
