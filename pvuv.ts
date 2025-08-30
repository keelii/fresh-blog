import {getCookies} from "jsr:@std/http/cookie"
import {setCookie} from "jsr:@std/http"
import {initKV} from "./kv.ts"
import {APP_DISALLOW_SE} from "./config.ts"

const pv = await initKV("PV")
const uv = await initKV("UV")

// await pv.deleteAll()
// await uv.deleteAll()

export async function setUV(k: string, uid: string) {
  const uuids = await uv.getOrSet(k, [])
  return uuids.value.includes(uid)
    ? await uv.get(k)
    : await uv.set(k, [...uuids.value, uid]);
}

export async function setPV(k: string) {
 return await pv.inc(k)
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
