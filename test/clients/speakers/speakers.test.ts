import { describe, expect, it } from 'vitest'

import { mapSpeakersResponse } from '../../../src/serializers'
import speakersFixture from './data/speakers.json'

describe('speakers serializer', () => {
  it('maps the speakers payload', () => {
    const speakers = mapSpeakersResponse(speakersFixture)

    expect(speakers.length).toBe(3)
    expect(speakers.toArray()[1].firstname).toBe('Rutger')
  })

  it('finds speakers by person id', () => {
    const speakers = mapSpeakersResponse(speakersFixture)

    expect(speakers.findByPersonId(2)?.firstname).toBe('Jans')
    expect(speakers.findByPersonId(3)).toBeNull()
    expect(speakers.findByPersonId(1)?.function).toBe('Commissielid')
  })

  it('finds speakers by speaker id', () => {
    const speakers = mapSpeakersResponse(speakersFixture)

    expect(speakers.findBySpeakerId(1)?.firstname).toBe('Rutger')
    expect(speakers.findBySpeakerId(3)?.firstname).toBe('Jans')
  })
})
