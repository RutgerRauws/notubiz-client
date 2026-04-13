import {
	type Speaker,
	type SpeakerAttributes,
	SpeakersCollection,
} from './model'
import {
	getString,
	requireDate,
	requireNumber,
	requireRecord,
	toBoolean,
	toRecordArray,
} from '../../utils'

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
