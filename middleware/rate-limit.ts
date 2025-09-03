import { Context, Next } from "hono"
import { getCookie } from 'hono/cookie'
import {getClientIpAddress} from "../utils/util.ts";
import {APP_RL_LIMIT, APP_RL_WINDOWS} from "../config.ts";

type RateLimitOptions = {
  windowMs: number // 时间窗口，毫秒
  limit: number // 最大请求数
  keyGenerator: (c: Context) => string // 如何生成 key，默认用 IP
}

type Record = {
  count: number
  expires: number
}

export function rateLimit(options: RateLimitOptions) {
  const store = new Map<string, Record>()
  const windowMs = options.windowMs
  const limit = options.limit
  const keyGen = options.keyGenerator

  return async (c: Context, next: Next) => {
    const key = keyGen(c)
    const now = Date.now()

    let record = store.get(key)
    if (!record || record.expires < now) {
      // 新窗口
      record = { count: 1, expires: now + windowMs }
      store.set(key, record)
    } else {
      record.count += 1
    }

    if (record.count > limit) {
      return c.text("Too Many Requests", 429, {
        "Retry-After": Math.ceil((record.expires - now) / 1000).toString()
      })
    }

    await next()
  }
}

export const rateLimitInstance = rateLimit({
  windowMs: APP_RL_WINDOWS,
  limit: APP_RL_LIMIT,
  keyGenerator: (c: Context) => {
    return getCookie(c, "uid") || getClientIpAddress(c)
  }
})