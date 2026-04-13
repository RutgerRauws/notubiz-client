import { describe, expect, it, vi } from 'vitest'

import { NotubizClient } from '../src/notubiz-client'
import modulesFixture from './data/modules.json'

function createJsonResponse(payload: unknown, status = 200): Response {
	return new Response(JSON.stringify(payload), {
		status,
		headers: {
			'content-type': 'application/json',
		},
	})
}

describe('ModulesClient', () => {
	it('fetches all modules and maps the response payload', async () => {
		const fetchMock = vi.fn(async (_input: RequestInfo | URL) =>
			createJsonResponse(modulesFixture)
		)

		const client = new NotubizClient({
			organisationId: 686,
			fetch: fetchMock as typeof globalThis.fetch,
		})

		const modules = await client.modules.getAll()

		expect(modules.length).toBe(19)
		expect(modules.findByModuleId(1)).toMatchObject({
			id: 1,
			name: 'Ingekomen stukken',
			customName: '',
		})
		expect(modules.findByModuleId(20)).toMatchObject({
			id: 20,
			name: 'Burgerbrieven',
			customName: '',
		})

		expect(fetchMock).toHaveBeenCalledTimes(1)

		const firstRequestInput = fetchMock.mock.calls[0]?.[0]

		if (firstRequestInput === undefined) {
			throw new Error('Expected fetch to be called with a request URL.')
		}

		const requestUrl = new URL(firstRequestInput.toString())
		expect(requestUrl.pathname).toBe('/modules')
	})
})
