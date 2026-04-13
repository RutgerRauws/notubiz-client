export interface ModuleOverviewItem {
  id: number
  name: string
  customName: string | null
}

export class ModulesOverview implements Iterable<ModuleOverviewItem> {
  public readonly modules: ModuleOverviewItem[]

  public constructor(modules: ModuleOverviewItem[]) {
    this.modules = modules
  }

  public findByModuleId(moduleId: number): ModuleOverviewItem | null {
    return this.modules.find((module) => module.id === moduleId) ?? null
  }

  public findByName(name: string): ModuleOverviewItem | null {
    return this.modules.find((module) => module.name === name) ?? null
  }

  public toArray(): ModuleOverviewItem[] {
    return [...this.modules]
  }

  public get length(): number {
    return this.modules.length
  }

  public [Symbol.iterator](): Iterator<ModuleOverviewItem> {
    return this.modules[Symbol.iterator]()
  }
}
