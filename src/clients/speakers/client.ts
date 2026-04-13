import { type RequestOptions, HttpClient } from '../../http'
import { type SpeakersCollection } from './model'
import { mapSpeakersResponse } from './serializer'

export class SpeakersClient {
  public constructor(private readonly httpClient: HttpClient) {}

  public async get(options: RequestOptions = {}): Promise<SpeakersCollection> {
    const response = await this.httpClient.getJson<unknown>(
      'speakers',
      {},
      options
    )

    return mapSpeakersResponse(response)
  }
}
