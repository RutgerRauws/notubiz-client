import { type EventBase, type Planning } from '../events/model'

export interface AssemblyMeeting {
  id: number
  order: number
  plannings: Planning[]
}

export interface Assembly extends EventBase {
  meetings: AssemblyMeeting[]
}
