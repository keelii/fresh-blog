import { Context } from "hono"

export function trailingSlash(c: Context) {
  if (
    (c.req.method === 'GET' || c.req.method === 'HEAD') &&
    c.req.path !== '/' &&
    c.req.path.at(-1) === '/'
  ) {
    const url = new URL(c.req.url)
    url.pathname = url.pathname.substring(0, url.pathname.length - 1)

    console.info("trailing slash redirect:", url.toString())
    return c.redirect(url.toString(), 301)
  }
}