import {
  type AgendaItem,
  type Document,
  type DocumentVersion,
  type Meeting,
} from './model'
import { mapEventBase } from '../events/serializer'
import {
  getNumber,
  getString,
  parseNotubizDate,
  requireDate,
  requireNumber,
  requireRecord,
  toBoolean,
  toRecordArray,
} from '../../utils/utils'

const TITLE_ATTRIBUTE_ID = 1
const DESCRIPTION_ATTRIBUTE_ID = 3
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
