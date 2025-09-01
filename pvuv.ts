import {getCookies} from "jsr:@std/http/cookie"
import {setCookie} from "jsr:@std/http"
import {deleteItem, initKV} from "./kv.ts"
import {APP_DISALLOW_SE} from "./config.ts"
import { HonoApp } from "./types.ts";
import type { Context } from "hono";

const pv = await initKV<number>("PV")
const uv = await initKV<string[]>("UV")

// await pv.deleteAll()
// await uv.deleteAll()

export async function updatePVUV(c: Context<HonoApp, "/">) {
  const pv = await setPV(c.req.path)
  const uv = await setUV(c.req.path, c.get("uid"))
  return {pv, uv}
}

export async function removePVUV(keys: Deno.KvKey) {
  return await deleteItem(keys)
}

export async function setUV(k: string, uid: string) {
  const uuids = await uv.getOrSet<string[]>(k, [])
  return uuids.value.includes(uid)
    ? await uv.get(k) as Deno.KvEntry<string[]>
    : await uv.set(k, [...uuids.value, uid]) as Deno.KvEntry<string[]>;
}

export function setPV(k: string) {
 return pv.inc(k)
}

export async function writeUUID(req: Request, headers: Headers, uuid: string) {
  const uid = getCookies(req.headers)["uid"]
  if (!uid) {
    setCookie(headers, {
      name: "uid",
      value: uuid,
      httpOnly: true,
      sameSite: "Strict",
      expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 1 year
    })
    console.info("cookie set uid for new visitor:", uuid)
  }
  return uid || uuid
}

export function writeRobotsHeader(headers: Headers) {
  if (APP_DISALLOW_SE) {
    headers.set("X-Robots-Tag", "noindex, nofollow, noarchive, nosnippet, noimageindex")
  }
}
