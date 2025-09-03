import { Next, Context } from "hono"
import {REDIRECTS} from "../config.ts";

export async function internalRedirect(c: Context, next: Next) {
  if (REDIRECTS[c.req.path]) {
    console.info("internal mapping redirect:", REDIRECTS[c.req.path])
    return c.redirect(REDIRECTS[c.req.path], 301)
  }
  await next()
}