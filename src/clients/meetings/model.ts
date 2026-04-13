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

export interface Meeting extends EventBase {
  url: string
  agendaItems: AgendaItem[]
}
