import {
  type AgendaItem,
  type Assembly,
  type AssemblyMeeting,
  type Document,
  type DocumentVersion,
  type Event,
  type Meeting,
  type Planning,
  type Speaker,
  type SpeakerAttributes,
  SpeakersCollection,
} from './models'
import {
  getNumber,
  getString,
  parseNotubizDate,
  requireDate,
  requireNumber,
  requireRecord,
  toBoolean,
  toRecordArray,
} from './utils'

const TITLE_ATTRIBUTE_ID = 1
const DESCRIPTION_ATTRIBUTE_ID = 3
const LOCATION_ATTRIBUTE_ID = 50
const AGENDA_ITEM_START_ATTRIBUTE_ID = 82
const AGENDA_ITEM_END_ATTRIBUTE_ID = 83

function getAttributeValue(attributes: unknown, id: number): string | null {
  const matchedAttributes = toRecordArray(attributes).filter(
    (attribute) => getNumber(attribute.id) === id
  )

  if (matchedAttributes.length === 0) {
    return null
  }

  if (matchedAttributes.length > 1) {
    throw new Error(`Expected attribute ${id} to be unique.`)
  }

  return getString(matchedAttributes[0].value)
}

export function mapPlanning(input: unknown): Planning {
  const planning = requireRecord(input, 'planning')

  return {
    startDate: requireDate(planning.start_date, 'planning.start_date'),
    endDate: parseNotubizDate(planning.end_date),
  }
}

function mapEventBase(input: unknown): Event {
  const event = requireRecord(input, 'event')
  const gremium =
    event.gremium === undefined
      ? null
      : requireRecord(event.gremium, 'event.gremium')

  return {
    id: requireNumber(event.id, 'event.id'),
    type: getString(event.type) ?? '',
    permissionGroup: getString(event.permission_group),
    body: getString(event.body),
    confidential: toBoolean(event.confidential),
    announcement: toBoolean(event.announcement),
    canceled: toBoolean(event.canceled),
    inactive: toBoolean(event.inactive),
    creationDate: requireDate(event.creation_date, 'event.creation_date'),
    lastModified: requireDate(event.last_modified, 'event.last_modified'),
    live: toBoolean(event.live),
    archiveState: getString(event.archive_state),
    archiveStateLastModified: parseNotubizDate(
      event.archive_state_last_modified
    ),
    allowSubscriptions: toBoolean(event.allow_subscriptions),
    plannings: toRecordArray(event.plannings).map(mapPlanning),
    title: getAttributeValue(event.attributes, TITLE_ATTRIBUTE_ID),
    location: getAttributeValue(event.attributes, LOCATION_ATTRIBUTE_ID),
    gremiumId: gremium === null ? null : getNumber(gremium.id),
  }
}

export function mapEvent(input: unknown): Event {
  return mapEventBase(input)
}

export function mapDocumentVersion(input: unknown): DocumentVersion {
  const version = requireRecord(input, 'document version')

  return {
    id: requireNumber(version.id, 'documentVersion.id'),
    type: getString(version.type) ?? '',
    url: getString(version.url),
    fileName: getString(version.file_name),
    fileSize: getNumber(version.file_size),
    mimeType: getString(version.mime_type),
  }
}

export function mapDocument(input: unknown): Document {
  const document = requireRecord(input, 'document')

  return {
    id: getNumber(document.id),
    lastModified: requireDate(document.last_modified, 'document.last_modified'),
    title: getString(document.title) ?? '',
    version: requireNumber(document.version, 'document.version'),
    url: getString(document.url) ?? '',
    versions: toRecordArray(document.versions).map(mapDocumentVersion),
  }
}

export function mapAgendaItem(input: unknown): AgendaItem {
  const agendaItem = requireRecord(input, 'agenda item')
  const typeData = requireRecord(agendaItem.type_data, 'agenda item.type_data')
  const attributes = typeData.attributes

  return {
    id: requireNumber(agendaItem.id, 'agendaItem.id'),
    lastModified: requireDate(
      agendaItem.last_modified,
      'agendaItem.last_modified'
    ),
    title: getAttributeValue(attributes, TITLE_ATTRIBUTE_ID),
    description: getAttributeValue(attributes, DESCRIPTION_ATTRIBUTE_ID),
    startDate: parseNotubizDate(
      getAttributeValue(attributes, AGENDA_ITEM_START_ATTRIBUTE_ID)
    ),
    endDate: parseNotubizDate(
      getAttributeValue(attributes, AGENDA_ITEM_END_ATTRIBUTE_ID)
    ),
    isHeading: toBoolean(typeData.heading),
    documents: toRecordArray(agendaItem.documents).map(mapDocument),
    agendaItems: toRecordArray(agendaItem.agenda_items).map(mapAgendaItem),
  }
}

export function mapMeeting(input: unknown): Meeting {
  const meeting = requireRecord(input, 'meeting')
  const baseMeeting = mapEventBase(meeting)

  return {
    ...baseMeeting,
    url: getString(meeting.url) ?? '',
    agendaItems: toRecordArray(meeting.agenda_items).map(mapAgendaItem),
  }
}

export function mapMeetingResponse(input: unknown): Meeting {
  const response = requireRecord(input, 'meeting response')

  return mapMeeting(response.meeting)
}

export function mapAssemblyMeeting(input: unknown): AssemblyMeeting {
  const meeting = requireRecord(input, 'assembly meeting')

  return {
    id: requireNumber(meeting.id, 'assemblyMeeting.id'),
    order: requireNumber(meeting.order, 'assemblyMeeting.order'),
    plannings: toRecordArray(meeting.plannings).map(mapPlanning),
  }
}

export function mapAssembly(input: unknown): Assembly {
  const assembly = requireRecord(input, 'assembly')
  const baseAssembly = mapEventBase(assembly)

  return {
    ...baseAssembly,
    meetings: toRecordArray(assembly.meetings).map(mapAssemblyMeeting),
  }
}

export function mapAssemblyResponse(input: unknown): Assembly {
  const response = requireRecord(input, 'assembly response')

  return mapAssembly(response.assembly)
}

export function mapSpeakerAttributes(input: unknown): SpeakerAttributes {
  const attributes = requireRecord(input, 'speaker attributes')

  return {
    id: requireNumber(attributes.id, 'speakerAttributes.id'),
    personId: requireNumber(
      attributes.person_id,
      'speakerAttributes.person_id'
    ),
    active: toBoolean(attributes.active),
    lastModified: requireDate(
      attributes.last_modified,
      'speakerAttributes.last_modified'
    ),
  }
}

export function mapSpeaker(input: unknown): Speaker {
  const speaker = requireRecord(input, 'speaker')
  const firstname = getString(speaker.firstname) ?? ''
  const lastname = getString(speaker.lastname) ?? ''

  return {
    photo: getString(speaker.photo) ?? '',
    party: getString(speaker.party) ?? '',
    email: getString(speaker.email) ?? '',
    initials: getString(speaker.initials) ?? '',
    firstname,
    lastname,
    sex: getString(speaker.sex) ?? '',
    function: getString(speaker.function) ?? '',
    url: getString(speaker.url) ?? '',
    fullName: `${firstname} ${lastname}`.trim(),
    attributes: mapSpeakerAttributes(speaker['@attributes']),
  }
}

export function mapSpeakersResponse(input: unknown): SpeakersCollection {
  const response = requireRecord(input, 'speakers response')
  const speakersRoot = requireRecord(
    response.speakers,
    'speakers response.speakers'
  )

  return new SpeakersCollection(
    toRecordArray(speakersRoot.speaker).map(mapSpeaker)
  )
}
