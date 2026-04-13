import { AssembliesClient } from './clients/assemblies/client'
import { EventsClient } from './clients/events/client'
import { MeetingsClient } from './clients/meetings/client'
import { SpeakersClient } from './clients/speakers/client'
import { ModulesClient } from './clients/modules/client'
import {
  type NotubizClientOptions,
  type ResolvedNotubizClientOptions,
  resolveClientOptions,
} from './configuration'
import { HttpClient } from './http'

export class NotubizClient {
  public readonly assemblies: AssembliesClient
  public readonly events: EventsClient
  public readonly meetings: MeetingsClient
  public readonly speakers: SpeakersClient
  public readonly modules: ModulesClient

  public readonly configuration: ResolvedNotubizClientOptions

  public constructor(options: NotubizClientOptions) {
    this.configuration = resolveClientOptions(options)

    const httpClient = new HttpClient(this.configuration)

    this.assemblies = new AssembliesClient(httpClient)
    this.events = new EventsClient(httpClient)
    this.meetings = new MeetingsClient(httpClient)
    this.speakers = new SpeakersClient(httpClient)
    this.modules = new ModulesClient(httpClient)
  }
}
