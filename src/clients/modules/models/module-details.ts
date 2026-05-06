export interface ModuleItemAttributeReference {
  id: number
  value: string
  referenceModel: string | null
}

export interface ModuleItemAttribute {
  id: number
  label: string
  datatype: string
  order: number
  multiple: boolean
  visible: string
  value: string | null
  references: ModuleItemAttributeReference[]
}

export interface ModuleAttachment {
  type: string
  title: string
}

//TODO: This one has not been tested yet.
export interface LinkModuleAttachment extends ModuleAttachment {
  type: 'link'
  url: string
}

export interface DocumentModuleAttachment extends ModuleAttachment {
  type: 'document'
  filetype: string
  url: string
}

export interface ModuleItem {
  id: number
  name: string

  creationDate: Date | null
  lastModified: Date | null
  confidential: boolean
  permissionGroup: string

  attributes: ModuleItemAttribute[]
  attachments: DocumentModuleAttachment[]
}

export class ModuleDetails implements Iterable<ModuleItem> {
  public readonly items: ModuleItem[]

  public constructor(items: ModuleItem[]) {
    this.items = items
  }

  public toArray(): ModuleItem[] {
    return [...this.items]
  }

  public [Symbol.iterator](): Iterator<ModuleItem> {
    return this.items[Symbol.iterator]()
  }
}
