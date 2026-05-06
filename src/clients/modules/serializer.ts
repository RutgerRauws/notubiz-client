import { ModuleOverviewItem, ModulesOverview } from './models/modules-overview'
import {
  getNumber,
  getString,
  isRecord,
  parseNotubizDate,
  requireNumber,
  requireRecord,
  toBoolean,
  toRecordArray,
} from '../../utils/utils'
import {
  type DocumentModuleAttachment,
  type ModuleItem,
  type ModuleItemAttribute,
  type ModuleItemAttributeReference,
} from './models/module-details'

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

export interface ModulePageResponse {
  items: ModuleItem[]
  hasMorePages: boolean
}

export function mapModulePageResponse(input: unknown): ModulePageResponse {
  const response = requireRecord(input, 'module details response')

  const items = toRecordArray(response.item).map(mapModuleItem)
  const hasMorePages = parseHasMorePages(response.pagination)

  return { items, hasMorePages }
}

function parseHasMorePages(input: unknown): boolean {
  if (!isRecord(input)) {
    return false
  }

  const attributes = isRecord(input['@attributes'])
    ? input['@attributes']
    : {}

  const listEnd = getNumber(attributes.list_end)
  const totalResults = getNumber(attributes.total_results)

  if (listEnd === null || totalResults === null) {
    return false
  }

  return listEnd < totalResults
}

function mapModuleItem(input: unknown, index: number): ModuleItem {
  const item = requireRecord(input, `item[${index}]`)
  const itemAttributes = requireRecord(
    item['@attributes'],
    `item[${index}].@attributes`
  )

  const attributesRoot = requireRecord(
    item.attributes,
    `item[${index}].attributes`
  )
  const attributes = toRecordArray(attributesRoot.attribute).map((attr, i) =>
    mapModuleItemAttribute(
      attr,
      `item[${index}].attributes.attribute[${i}]`
    )
  )

  const titleAttribute = attributes.find((a) => a.label === 'Titel')

  let attachments: DocumentModuleAttachment[] = []
  if (isRecord(item.attachments)) {
    attachments = toRecordArray(item.attachments.document).map((doc, i) =>
      mapDocumentAttachment(
        doc,
        `item[${index}].attachments.document[${i}]`
      )
    )
  }

  return {
    id: requireNumber(itemAttributes.id, `item[${index}].@attributes.id`),
    name: getString(titleAttribute?.value) ?? '',
    creationDate: parseNotubizDate(itemAttributes.creation_date),
    lastModified: parseNotubizDate(itemAttributes.last_modified),
    confidential: toBoolean(itemAttributes.confidential),
    permissionGroup: getString(itemAttributes.permission_group) ?? '',
    attributes,
    attachments,
  }
}

function mapModuleItemAttribute(
  input: unknown,
  context: string
): ModuleItemAttribute {
  const attr = requireRecord(input, context)
  const meta = requireRecord(attr['@attributes'], `${context}.@attributes`)

  const isMultiple = toBoolean(meta.multiple)

  let value: string | null = null
  const references: ModuleItemAttributeReference[] = []

  if (isMultiple && isRecord(attr.values)) {
    references.push(
      ...toRecordArray(attr.values.value).map((ref, i) =>
        mapAttributeReference(ref, `${context}.values.value[${i}]`)
      )
    )
  } else {
    value = getString(attr.value)
  }

  return {
    id: requireNumber(meta.id, `${context}.@attributes.id`),
    label: getString(attr.label) ?? '',
    datatype: getString(meta.datatype) ?? '',
    order: requireNumber(meta.order, `${context}.@attributes.order`),
    multiple: isMultiple,
    visible: getString(meta.visible) ?? '',
    value,
    references,
  }
}

function mapAttributeReference(
  input: unknown,
  context: string
): ModuleItemAttributeReference {
  const ref = requireRecord(input, context)
  const refAttributes = requireRecord(
    ref['@attributes'],
    `${context}.@attributes`
  )

  return {
    id: requireNumber(refAttributes.id, `${context}.@attributes.id`),
    value: getString(ref['@cdata']) ?? '',
    referenceModel: getString(refAttributes.reference_model),
  }
}

function mapDocumentAttachment(
  input: unknown,
  context: string
): DocumentModuleAttachment {
  const doc = requireRecord(input, context)

  return {
    type: 'document',
    title: getString(doc.title) ?? '',
    filetype: getString(doc.filetype) ?? '',
    url: getString(doc.url) ?? '',
  }
}
