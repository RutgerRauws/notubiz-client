import { type EventBase } from '../events/model'

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

// A module item (e.g. a council proposal) handled in an agenda item
export interface AgendaItemModuleItem {
  id: number
  // The module item's field that refers to the agenda item
  fieldId: number | null
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
  moduleItems: AgendaItemModuleItem[]
  agendaItems: AgendaItem[]
}

export interface Meeting extends EventBase {
  url: string
  agendaItems: AgendaItem[]
}
