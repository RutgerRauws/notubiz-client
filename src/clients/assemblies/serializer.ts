import { type Assembly, type AssemblyMeeting } from './model'
import { mapEventBase, mapPlanning } from '../events/serializer'
import { requireNumber, requireRecord, toRecordArray } from '../../utils'

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
