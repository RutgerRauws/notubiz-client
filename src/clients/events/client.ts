import { type HttpClient, type RequestOptions } from '../../http'
import { isRecord, toBoolean, toRecordArray } from '../../utils/utils'
import { type Event } from './model'
import { mapEvent } from './serializer'

export interface ListEventsOptions extends RequestOptions {
  dateFrom: Date
  dateTo: Date
  gremia?: number[]
}

export class EventsClient {
  public constructor(private readonly httpClient: HttpClient) {}

  public async list(options: ListEventsOptions): Promise<Event[]> {
    const events: Event[] = []
    let hasMorePages = true
    let page = 1

    while (hasMorePages) {
      const response = await this.httpClient.getJson<unknown>(
        'events/',
        {
          date_from: options.dateFrom,
          date_to: options.dateTo,
          organisation_id: this.httpClient.organisationId,
          gremia: options.gremia,
          page,
        },
        options
      )

      if (!isRecord(response)) {
        throw new TypeError('Expected the events response to be an object.')
      }

      events.push(...toRecordArray(response.events).map(mapEvent))

      const pagination = isRecord(response.pagination)
        ? response.pagination
        : {}
      hasMorePages = toBoolean(pagination.has_more_pages)
      page += 1
    }

    return events
  }
}
