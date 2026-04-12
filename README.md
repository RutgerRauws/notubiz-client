# notubiz-client

An **unofficial** typed TypeScript API client for [Notubiz](https://www.notubiz.nl/).
Disclaimer: I do not work for Notubiz and all information here came from publicly-available sources and my own deductions.

The package is inspired by my [initial Python implementation](https://github.com/RutgerRauws/python-notubiz) and provides a modern Node.js-friendly interface for the most common Notubiz endpoints:

- Events
- Meetings
- Assemblies
- Speakers

## Installation

```bash
npm install notubiz-client
```

## Quick start

```ts
import { NotubizClient } from 'notubiz-client'

const client = new NotubizClient({
  organisationId: 686,
})

const events = await client.events.list({
  dateFrom: new Date(2025, 0, 5),
  dateTo: new Date(2025, 0, 7, 23, 59, 59),
})

for (const event of events) {
  console.log(event.title, event.location)
}
```

## API overview

### Create a client

```ts
import { NotubizClient } from 'notubiz-client'

const client = new NotubizClient({
  organisationId: 686,
  apiVersion: '1.10.8',
  baseUrl: 'https://api.notubiz.nl/',
})
```

### List events

```ts
const events = await client.events.list({
  dateFrom: new Date(2025, 0, 1),
  dateTo: new Date(2025, 0, 31, 23, 59, 59),
  gremia: [6024, 8203],
})
```

### Get a meeting

```ts
const meeting = await client.meetings.get(1147925)

console.log(meeting.title)
console.log(meeting.agendaItems.length)
```

### Get an assembly

```ts
const assembly = await client.assemblies.get(1253866)

console.log(assembly.title)
console.log(assembly.meetings.map((meeting) => meeting.id))
```

### Get speakers

```ts
const speakers = await client.speakers.get()

console.log(speakers.findBySpeakerId(1)?.fullName)
console.log(speakers.findByPersonId(2)?.function)
```

## Public exports

The package exports:

- `NotubizClient`
- `ApiClient` as an alias for `NotubizClient`
- typed models such as `Event`, `Meeting`, `Assembly`, `AgendaItem`, and `Speaker`
- `SpeakersCollection`
- `NotubizApiError`

## Error handling

Non-successful API responses throw `NotubizApiError` with:

- `status`
- `url`
- `responseBody`

## Development

### Scripts

- `npm run build` — compile the library
- `npm run dev` — watch-mode compilation
- `npm run test` — run the test suite
- `npm run test:watch` — run tests in watch mode
- `npm run lint` — lint TypeScript files
- `npm run format` — format source and test files

### Repository structure

```
src/
	clients/          Endpoint-specific clients
	configuration.ts  Runtime configuration defaults and validation
	errors.ts         API error types
	http.ts           Shared HTTP request layer
	models.ts         Public TypeScript domain models
	serializers.ts    Response-to-model mapping logic
	index.ts          Public entry point
test/
	*.test.ts         Automated tests
```

## Compatibility

- Node.js 18+
- Notubiz API version `1.10.8` by default
