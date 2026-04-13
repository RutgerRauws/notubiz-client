import { describe, expect, it } from 'vitest'

import { mapAssemblyResponse } from '../../../src/serializers'
import assemblyFixture from './data/assembly.json'

describe('assembly serializer', () => {
  it('preserves the shared event fields', () => {
    const assembly = mapAssemblyResponse(assemblyFixture)

    expect(assembly).toMatchObject({
      id: 1253866,
      title: 'Raadsavond',
      location: 'Raadzaal / commissiekamer',
    })
    expect(assembly.plannings).toHaveLength(1)
    expect(assembly.plannings[0].startDate).toEqual(
      new Date(2025, 0, 7, 14, 0, 0)
    )
    expect(assembly.plannings[0].endDate).toBeNull()
  })

  it('maps the assembly meeting list', () => {
    const assembly = mapAssemblyResponse(assemblyFixture)

    expect(assembly.meetings).toHaveLength(3)
    expect(assembly.meetings[0]).toMatchObject({
      id: 1253869,
      order: 1,
    })
    expect(assembly.meetings[2]).toMatchObject({
      id: 1253868,
      order: 6,
    })
    expect(assembly.meetings[2].plannings[0].startDate).toEqual(
      new Date(2025, 0, 7, 14, 0, 0)
    )
    expect(assembly.meetings[2].plannings[0].endDate).toEqual(
      new Date(2025, 0, 7, 21, 0, 0)
    )
  })
})
