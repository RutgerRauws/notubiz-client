export interface ModuleItem {
  id: number
  name: string
  customName: string | null
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
