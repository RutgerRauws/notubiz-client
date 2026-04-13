import { type RequestOptions, HttpClient } from '../../http'
import { type Meeting } from './model'
import { mapMeetingResponse } from './serializer'

export class MeetingsClient {
  public constructor(private readonly httpClient: HttpClient) {}

  public async get(
    meetingId: number,
    options: RequestOptions = {}
  ): Promise<Meeting> {
    const response = await this.httpClient.getJson<unknown>(
      `events/meetings/${meetingId}`,
      {},
      options
    )

    return mapMeetingResponse(response)
  }
}
