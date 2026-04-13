import { type RequestOptions, HttpClient } from '../../http'
import { ModuleDetails } from './models/module-details'
import { type ModulesOverview } from './models/modules-overview'
import { mapModuleResponse, mapModulesResponse } from './serializer'

export class ModulesClient {
  public constructor(private readonly httpClient: HttpClient) {}

  public async getAll(options: RequestOptions = {}): Promise<ModulesOverview> {
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
  ): Promise<ModuleDetails> {
    const response = await this.httpClient.getJson<unknown>(
      `modules/${moduleId}`,
      {},
      options
    )

    return mapModuleResponse(response)
  }
}
