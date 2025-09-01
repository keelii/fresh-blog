// export type Count = [Deno.KvEntryMaybe<number>, Deno.KvEntryMaybe<number>]
export interface Count {
  pv: Deno.KvEntry<number>;
  uv: Deno.KvEntry<string[]>;
}

type HonoVariables = {
  uid: string
}
export interface HonoApp {
  Variables: HonoVariables
}