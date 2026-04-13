export interface Planning {
  startDate: Date
  endDate: Date | null
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
