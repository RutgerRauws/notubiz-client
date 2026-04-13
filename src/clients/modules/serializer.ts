import { type Module, ModulesCollection } from './model'
import {
  getString,
  requireNumber,
  requireRecord,
  toRecordArray,
} from '../../utils/utils'

export function mapModule(input: unknown): Module {
  const module = requireRecord(input, 'module')
  const attributes = requireRecord(module['@attributes'], 'module.@attributes')

  return {
    id: requireNumber(attributes.id, 'module.@attributes.id'),
    name: getString(module.name) ?? '',
    customName: getString(module.custom_name),
  }
}

export function mapModulesResponse(input: unknown): ModulesCollection {
  const response = requireRecord(input, 'modules response')
  const modulesRoot = requireRecord(
    response.modules,
    'modules response.modules'
  )

  return new ModulesCollection(toRecordArray(modulesRoot.module).map(mapModule))
}
