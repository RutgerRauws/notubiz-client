import { ModuleOverviewItem, ModulesOverview } from './models/modules-overview'
import {
  getString,
  requireNumber,
  requireRecord,
  toRecordArray,
} from '../../utils/utils'
import { ModuleDetails } from './models/module-details'

function mapModuleOverviewItem(input: unknown): ModuleOverviewItem {
  const module = requireRecord(input, 'module')
  const attributes = requireRecord(module['@attributes'], 'module.@attributes')

  return {
    id: requireNumber(attributes.id, 'module.@attributes.id'),
    name: getString(module.name) ?? '',
    customName: getString(module.custom_name),
  }
}

export function mapModulesResponse(input: unknown): ModulesOverview {
  const response = requireRecord(input, 'modules response')
  const modulesRoot = requireRecord(
    response.modules,
    'modules response.modules'
  )

  return new ModulesOverview(
    toRecordArray(modulesRoot.module).map(mapModuleOverviewItem)
  )
}

export function mapModuleResponse(input: unknown): ModuleDetails {
  //TODO
}
