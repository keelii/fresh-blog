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
import {removePVUV, updatePVUV} from "./pvuv.ts";
import {HonoApp} from "./types.ts";
import {KVTable} from "./component/KVTable.tsx";
import {getAll} from "./kv.ts";
import {NotFound} from "./component/NotFound.tsx"
import { rateLimitInstance } from "./middleware/rate-limit.ts";
import {trailingSlash} from "./middleware/trailing-slash.ts";
import {adminAuth} from "./middleware/admin-auth.ts";
import {generateUuid} from "./middleware/generate-uuid.ts";
import {internalRedirect} from "./middleware/internal-redirect.ts";


const rss = await generateRSS()
await Deno.writeTextFile("./static/atom.xml", rss)

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

app.on(
  "GET",
  ['/', '/:page', '/admin/kv', '/:year{\\d{4}}/:month{\\d{2}}/:date{\\d{2}}/:title{[A-Za-z0-9_-]+}'],
  jsxRenderer(({ children }, context) => {
    return <html lang="zh_CN">{children}</html>
  })
)

app.use('/static/*', serveStatic({ root: './' }))
// app.use('/favicon.ico', serveStatic({ path: './static/favicon.ico' }))
app.use(BLOG_RSS, serveStatic({ path: './static/atom.xml' }))

app.get('/', async (c) => {
  const posts = await getCachedPosts()
  // const {pv, uv} = await updatePVUV(c)
  return c.render(<Home posts={posts} count={{pv: null, uv: null}} />)
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

    // const {pv, uv} = await updatePVUV(c)
    return c.render(<ArticleDetail count={{ pv: null, uv: null }} {...post} />)
  }
})
app.get('/:page', async (c) => {
  const { page } = c.req.param()
  const file = join(BLOG_DIR, page + ".md")

  if (!await exists(file, { isFile: true })) {
    return c.notFound()
  } else {
    // const {pv, uv} = await updatePVUV(c)
    const post = await parseYamlFile(file, true)
    if (!post) return c.notFound()

    return c.render(<ArticleDetail count={{pv: null, uv: null}} {...post} />)
  }
})

app.get("/admin/kv", async (c) => {
  const kStr = c.req.query()["k"]

  const kv = await getAll()

  if (kStr) {
    const keys = kStr.split(":")

    await removePVUV(keys)
    return c.redirect(c.req.path, 302)
  }

  return c.render(<KVTable title="KV" kv={kv} />)
})

Deno.serve({ port: APP_PORT }, app.fetch)
