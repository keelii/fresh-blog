import { Next, Context } from "hono"
import { getCookie, setCookie } from 'hono/cookie'

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
    } else {
      c.set("uid", val)
    }

    await next()
}