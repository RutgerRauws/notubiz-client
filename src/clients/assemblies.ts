import { type RequestOptions, HttpClient } from '../http'
import { type Assembly } from '../models'
import { mapAssemblyResponse } from '../serializers'

export class AssembliesClient {
  public constructor(private readonly httpClient: HttpClient) {}

  public async get(
    assemblyId: number,
    options: RequestOptions = {}
  ): Promise<Assembly> {
    const response = await this.httpClient.getJson<unknown>(
      `events/assemblies/${assemblyId}`,
      {},
      options
    )

    return mapAssemblyResponse(response)
  }
}
