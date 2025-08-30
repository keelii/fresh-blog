// export type Count = [Deno.KvEntryMaybe<number>, Deno.KvEntryMaybe<number>]
export interface Count {
  pv: Deno.KvEntryMaybe<number>;
  uv: Deno.KvEntryMaybe<number>;
}
