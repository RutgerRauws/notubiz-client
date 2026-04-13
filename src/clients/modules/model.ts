export interface Module {
  id: number
  name: string
  customName: string | null
}

export class ModulesCollection implements Iterable<Module> {
  public readonly modules: Module[]

  public constructor(modules: Module[]) {
    this.modules = modules
  }

  public findByModuleId(moduleId: number): Module | null {
    return this.modules.find((module) => module.id === moduleId) ?? null
  }

  public findByName(name: string): Module | null {
    return this.modules.find((module) => module.name === name) ?? null
  }

  public toArray(): Module[] {
    return [...this.modules]
  }

  public get length(): number {
    return this.modules.length
  }

  public [Symbol.iterator](): Iterator<Module> {
    return this.modules[Symbol.iterator]()
  }
}
