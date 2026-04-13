import { type RequestOptions, HttpClient } from '../../http'
import { Module, type ModulesCollection } from './model'
import { mapModule, mapModulesResponse } from './serializer'

export class ModulesClient {
  public constructor(private readonly httpClient: HttpClient) {}

  public async getAll(
    options: RequestOptions = {}
  ): Promise<ModulesCollection> {
    const response = await this.httpClient.getJson<unknown>(
      'modules',
      {},
      options
    )

    return mapModulesResponse(response)
  }

  public async getById(
    moduleId: number,
    options: RequestOptions = {}
  ): Promise<Module> {
    const response = await this.httpClient.getJson<unknown>(
      `modules/${moduleId}`,
      {},
      options
    )

    return mapModule(response)
  }
}
