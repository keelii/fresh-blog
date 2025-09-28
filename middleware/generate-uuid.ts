import { Next, Context } from "hono"
import { getCookie, setCookie } from 'hono/cookie'
import {enqueue} from "../couch_db.ts"
import {getClientIpAddress} from "../utils/util.ts"

export async function generateUuid(c: Context, next: Next) {
    const uid = crypto.randomUUID()
    const val = getCookie(c, "uid")

    if (!val) {
      setCookie(c, "uid", uid, {
        httpOnly: true,
        sameSite: "Strict",
        expires: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 1 year
      })
      c.set("uid", uid)
      enqueue({
        uid,
        clientIp: getClientIpAddress(c),
        userAgent: c.req.header("User-Agent") || "",
        referer: c.req.header("Referer") || "",
        createdAt: Date.now(),
      })
    } else {
      c.set("uid", val)
    }

    await next()
}
