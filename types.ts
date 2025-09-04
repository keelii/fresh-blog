// export type Count = [Deno.KvEntryMaybe<number>, Deno.KvEntryMaybe<number>]
export interface Count {
  pv: Deno.KvEntry<number> | null;
  uv: Deno.KvEntry<string[]> | null;
}

type HonoVariables = {
  uid: string
}
export interface HonoApp {
  Variables: HonoVariables
}