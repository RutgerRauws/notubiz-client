export interface Planning {
  startDate: Date
  endDate: Date | null
}

export interface DocumentVersion {
  id: number
  type: string
  url: string | null
  fileName: string | null
  fileSize: number | null
  mimeType: string | null
}

export interface Document {
  id: number | null
  lastModified: Date
  title: string
  version: number
  url: string
  versions: DocumentVersion[]
}

export interface AgendaItem {
  id: number
  lastModified: Date
  title: string | null
  description: string | null
  startDate: Date | null
  endDate: Date | null
  isHeading: boolean
  documents: Document[]
  agendaItems: AgendaItem[]
}

export interface EventBase {
  id: number
  type: string
  permissionGroup: string | null
  body: string | null
  confidential: boolean
  announcement: boolean
  canceled: boolean
  inactive: boolean
  creationDate: Date
  lastModified: Date
  live: boolean
  archiveState: string | null
  archiveStateLastModified: Date | null
  allowSubscriptions: boolean
  plannings: Planning[]
  title: string | null
  location: string | null
  gremiumId: number | null
}

export interface Event extends EventBase {}

export interface Meeting extends EventBase {
  url: string
  agendaItems: AgendaItem[]
}

export interface AssemblyMeeting {
  id: number
  order: number
  plannings: Planning[]
}

export interface Assembly extends EventBase {
  meetings: AssemblyMeeting[]
}

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
