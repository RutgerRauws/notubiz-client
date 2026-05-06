import { type RequestOptions, HttpClient } from '../../http'
import { type ModuleItem, ModuleDetails } from './models/module-details'
import { type ModulesOverview } from './models/modules-overview'
import { mapModulePageResponse, mapModulesResponse } from './serializer'

const PAGE_SIZE = 50

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
    dateFrom: Date,
    dateTo: Date,
    options: RequestOptions = {}
  ): Promise<ModuleDetails> {
    const items: ModuleItem[] = []
    let hasMorePages = true
    let offset = 0

    while (hasMorePages) {
      const response = await this.httpClient.getJson<unknown>(
        `modules/${moduleId}/items/`,
        {
          organisation_id: this.httpClient.organisationId,
          date_from: dateFrom,
          date_to: dateTo,
          list_start: offset,
          list_end: offset + PAGE_SIZE,
        },
        options
      )

      const page = mapModulePageResponse(response)
      items.push(...page.items)
      hasMorePages = page.hasMorePages
      offset += PAGE_SIZE
    }

    return new ModuleDetails(items)
  }
}
