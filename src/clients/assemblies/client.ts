import { type RequestOptions, HttpClient } from '../../http'
import { type Assembly } from './model'
import { mapAssemblyResponse } from './serializer'

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
