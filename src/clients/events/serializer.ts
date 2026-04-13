import { type Event, type Planning } from './model'
import {
	getNumber,
	getString,
	parseNotubizDate,
	requireDate,
	requireNumber,
	requireRecord,
	toBoolean,
	toRecordArray,
} from '../../utils'

const TITLE_ATTRIBUTE_ID = 1
const LOCATION_ATTRIBUTE_ID = 50

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

export function mapEventBase(input: unknown): Event {
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
