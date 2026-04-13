export interface SpeakerAttributes {
  id: number
  personId: number
  active: boolean
  lastModified: Date
}

export interface Speaker {
  photo: string
  party: string
  email: string
  initials: string
  firstname: string
  lastname: string
  sex: string
  function: string
  url: string
  fullName: string
  attributes: SpeakerAttributes
}

export class SpeakersCollection implements Iterable<Speaker> {
  public readonly speakers: Speaker[]

  public constructor(speakers: Speaker[]) {
    this.speakers = speakers
  }

  public findBySpeakerId(speakerId: number): Speaker | null {
    return (
      this.speakers.find((speaker) => speaker.attributes.id === speakerId) ??
      null
    )
  }

  public findByPersonId(personId: number): Speaker | null {
    return (
      this.speakers.find(
        (speaker) => speaker.attributes.personId === personId
      ) ?? null
    )
  }

  public toArray(): Speaker[] {
    return [...this.speakers]
  }

  public get length(): number {
    return this.speakers.length
  }

  public [Symbol.iterator](): Iterator<Speaker> {
    return this.speakers[Symbol.iterator]()
  }
}
