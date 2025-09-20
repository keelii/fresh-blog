import { exists } from "jsr:@std/fs/exists";
import { Hono } from "hono"
import { serveStatic } from "hono/deno"
import { compress } from 'hono/compress'
import { csrf } from 'hono/csrf'
import { secureHeaders } from 'hono/secure-headers'
import { jsxRenderer } from 'hono/jsx-renderer'
import { APP_PORT, BLOG_DIR, BLOG_RSS } from "./config.ts"
import {generateRSS} from "./utils/rss.ts";
import { join } from "jsr:@std/path";
import {getCachedPosts, parseYamlFile} from "./utils/post.ts";
import {ArticleDetail} from "./component/ArticleDetail.tsx";
import {Home} from "./component/Home.tsx";
import {updatePageView} from "./pv.ts";
import {HonoApp} from "./types.ts";
import {KVTable} from "./component/KVTable.tsx";
import {deleteItem, getAll} from "./kv.ts";
import {NotFound} from "./component/NotFound.tsx"
import { rateLimitInstance } from "./middleware/rate-limit.ts";
import {trailingSlash} from "./middleware/trailing-slash.ts";
import {adminAuth} from "./middleware/admin-auth.ts";
import {generateUuid} from "./middleware/generate-uuid.ts";
import {internalRedirect} from "./middleware/internal-redirect.ts";
import {showTasks} from "./couch_db.ts"


const rss = await generateRSS()
// await Deno.writeTextFile(join(Deno.cwd(), "static/atom.xml"), rss)

const app = new Hono<HonoApp>()
app.notFound((c) => {
  const yes = trailingSlash(c)
  if (yes) return yes

  const url = "/404?url=" + encodeURIComponent(c.req.url)
  console.info("404 redirect", url)
  return c.redirect(url, 302)
})

app.use(compress())
app.use(csrf())
app.use(secureHeaders())
app.use(generateUuid)

app.use("*", rateLimitInstance)
app.use(internalRedirect)
app.use('/admin/*', adminAuth)

app.get("*",
  // ['/', '/:page', '/admin/kv', '/:year{\\d{4}}/:month{\\d{2}}/:date{\\d{2}}/:title{[A-Za-z0-9_-]+}'],
  jsxRenderer(({ children }, c) => {
    return <html lang="zh_CN">{children}</html>
  })
)

app.use('/static/*', serveStatic({ root: './' }))
app.use('/favicon.ico', serveStatic({ path: './static/favicon.ico' }))
// app.use(BLOG_RSS, serveStatic({ path: './static/atom.xml' }))
app.get(BLOG_RSS, (c) => {
  c.header('Content-Type', 'application/xml')
  return c.newResponse(rss)
})

app.get('/', async (c) => {
  const posts = await getCachedPosts()
  const pv = await updatePageView(c.req.path)
  return c.render(<Home posts={posts} pv={pv} />)
});
app.get('/404', (c) => {
  c.status(404)
  return c.render(<NotFound url={c.req.query()["url"]} />)
})
app.get('/:year{\\d{4}}/:month{\\d{2}}/:date{\\d{2}}/:title{[A-Za-z0-9_-]+}', async (c) => {
  const { year, month, date, title } = c.req.param()

  const file = join(BLOG_DIR, year, month, date, title + ".md")

  if (!await exists(file, { isFile: true })) {
    return c.notFound()
  } else {
    const post = await parseYamlFile(file, true)
    if (!post) return c.notFound()

    const pv = await updatePageView(c.req.path)
    return c.render(<ArticleDetail pv={pv} {...post} />)
  }
})
app.get('/:page', async (c) => {
  const { page } = c.req.param()
  const file = join(BLOG_DIR, page + ".md")

  if (!await exists(file, { isFile: true })) {
    return c.notFound()
  } else {

    const pv = await updatePageView(c.req.path)
    const post = await parseYamlFile(file, true)
    if (!post) return c.notFound()

    return c.render(<ArticleDetail pv={pv} {...post} />)
  }
})

app.get("/admin/kv", async (c) => {
  const kStr = c.req.query()["k"]

  const kv = await getAll()

  if (kStr) {
    const keys = kStr.split(":")

    await deleteItem(keys)
    return c.redirect(c.req.path, 302)
  }

  const items = showTasks()

  return c.render(<KVTable title="KV" kv={kv} items={items} />)
})

export function startApp() {
  Deno.serve({ port: APP_PORT }, app.fetch)
}
