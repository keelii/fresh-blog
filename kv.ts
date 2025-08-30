let KV: Deno.Kv;

function entryExists(e?: Deno.KvEntry): e is Deno.KvEntry {
  return e && e.value !== null && typeof e.value !== "undefined"
}

class KVStore {
  constructor(ns: string | string[]) {
    this.ns = Array.isArray(ns) ? ns : [ns];
  }

  async set<T = unknown>(k: string, v: T) {
    const r = await KV.set([...this.ns, k], v);
    if (!r.ok) {
      console.error("KV set error:", r);
    }
    return this.get(k);
  }
  async get(...args: string[]) {
    const r = await KV.get([...this.ns, ...args]);
    if (entryExists(r)) {
      return r;
    }
    return null;
  }
  async getAll() {
    const iter = await KV.list({ prefix: [...this.ns] });
    const entries: { k: string; v: unknown }[] = [];
    for await (const entry of iter) {
      entries.push({ k: entry.key[1], v: entry.value })
    }
    return entries;
  }
  async getOrSet(k: string, defaultV: unknown) {
    const v = await KV.get([...this.ns, k]);
    if (entryExists(v)) {
      return v;
    } else {
      const r = await KV.set([...this.ns, k], defaultV);
      if (!r.ok) {
        console.error("KV set error:", r);
      }
      return this.get(k)
    }
  }
  async delete(k: string) {
    await KV.delete([...this.ns, k]);
  }
  async deleteAll() {
    const iter = await KV.list({ prefix: [...this.ns] });
    for await (const entry of iter) {
      await KV.delete(entry.key);
    }
  }
  async inc(k: string) {
    const v = await this.getOrSet(k, 0);
    return this.set(k, v.value + 1);
  }
}

export interface KVItem {
  k: string[];
  v: unknown ;
}

export async function getAll() {
  if (!KV) {
    KV = await Deno.openKv();
  }

  const iter = await KV.list({prefix: []});
  const entries: KVItem[] = [];
  for await (const entry of iter) {
    entries.push({ k: entry.key as string[], v: entry.value })
  }
  return entries;
}

export async function initKV(ns: string[]) {
  if (!KV) {
    KV = await Deno.openKv();
  }

  return new KVStore(ns)
}
