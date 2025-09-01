let KV: Deno.Kv;

function entryExists<T>(e: Deno.KvEntryMaybe<T>): e is Deno.KvEntry<T> {
  return e && e.value !== null && typeof e.value !== "undefined"
}

class KVStore<T = unknown> {
  private ns: string[];

  constructor(ns: string | string[]) {
    this.ns = Array.isArray(ns) ? ns : [ns];
  }

  async set(k: string, v: any) {
    const r = await KV.set([...this.ns, k], v);
    if (!r.ok) {
      console.error("KV set error:", r);
    }
    return await KV.get([...this.ns, k]) as Deno.KvEntry<T>;
  }
  async get(...args: string[]) {
    const r = await KV.get<T>([...this.ns, ...args]);
    if (entryExists(r)) {
      return r;
    }
    return null;
  }
  async getAll() {
    const iter = KV.list({ prefix: [...this.ns] });
    const entries: { k: Deno.KvKeyPart; v: unknown }[] = [];
    for await (const entry of iter) {
      entries.push({ k: entry.key[1], v: entry.value })
    }
    return entries;
  }
  async getOrSet<T>(k: string, defaultV: unknown): Promise<Deno.KvEntry<T>> {
    const v = await KV.get<T>([...this.ns, k]);
    if (entryExists(v)) {
      return v;
    } else {
      const r = await KV.set([...this.ns, k], defaultV);
      if (!r.ok) {
        console.error("KV set error:", r);
      }
      return await KV.get([...this.ns, k]) as Deno.KvEntry<T>
    }
  }
  async delete(k: string) {
    await KV.delete([...this.ns, k]);
  }
  async deleteAll() {
    const iter = KV.list({ prefix: [...this.ns] });
    for await (const entry of iter) {
      await KV.delete(entry.key);
    }
  }
  async inc(k: string) {
    const v = await this.getOrSet<number>(k, 0);
    return this.set(k, v.value + 1);
  }
}

export interface KVItem<T = unknown> {
  k: string[];
  v: T ;
}

export async function getAll() {
  if (!KV) {
    KV = await Deno.openKv();
  }

  const iter = KV.list({ prefix: [] });
  const entries: KVItem[] = [];
  for await (const entry of iter) {
    entries.push({ k: entry.key as string[], v: entry.value })
  }
  return entries;
}
export async function deleteItem(key: Deno.KvKey) {
  await KV.delete(key);
}


export async function initKV<V = any>(ns: string | string[]) {
  if (!KV) {
    KV = await Deno.openKv();
  }

  return new KVStore<V>(ns)
}
