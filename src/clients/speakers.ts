import { type RequestOptions, HttpClient } from '../http'
import { type SpeakersCollection } from '../models'
import { mapSpeakersResponse } from '../serializers'

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
