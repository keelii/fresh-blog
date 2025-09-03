import { exists } from "jsr:@std/fs/exists";
import { Hono } from "hono"
import { serveStatic } from "hono/deno"
import { compress } from 'hono/compress'
import { csrf } from 'hono/csrf'
import { secureHeaders } from 'hono/secure-headers'
import { trimTrailingSlash } from 'hono/trailing-slash'
import { jsxRenderer } from 'hono/jsx-renderer'
import { basicAuth } from 'hono/basic-auth'
import * as bcrypt from "https://deno.land/x/bcrypt/mod.ts";
import { getCookie, setCookie } from 'hono/cookie'
import { APP_PASS, APP_PORT, APP_SALT, BLOG_DIR, BLOG_RSS, REDIRECTS } from "./config.ts"
import {generateRSS} from "./utils/rss.ts";
import { join } from "jsr:@std/path";
import {getCachedPosts, parseYamlFile} from "./utils/post.ts";
import {ArticleDetail} from "./component/ArticleDetail.tsx";
import {Home} from "./component/Home.tsx";
import {removePVUV, updatePVUV} from "./pvuv.ts";
import {HonoApp} from "./types.ts";
import {KVTable} from "./component/KVTable.tsx";
import {getAll} from "./kv.ts";
import { languageDetector } from 'hono/language'
import {NotFound} from "./component/NotFound.tsx"


const rss = await generateRSS()
await Deno.writeTextFile("./static/atom.xml", rss)

const app = new Hono<HonoApp>()
app.notFound((c) => {
  const url = c.req.url
  return c.redirect("/404?url=" + url, 302)
})

app.use(compress())
app.use(csrf())
app.use(secureHeaders())
app.use(trimTrailingSlash())
app.use(
  '/admin/*',
  basicAuth({
    username: 'admin',
    password: APP_PASS,
    verifyUser: (username, password) => {
      const salt = bcrypt.genSaltSync(APP_SALT);
      const hash = bcrypt.hashSync(password, salt);
      return (
        username === 'admin' && bcrypt.compareSync(password, hash)
      )
    },
  })
)
app.use(
  languageDetector({
    supportedLanguages: ["zh_CN", "cn", "zh-CN", "en"],
    fallbackLanguage: 'en',
  })
)

app.use(async (c, next) => {
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
})
app.use(async (c, next) => {
  if (REDIRECTS[c.req.path]) {
    return c.redirect(REDIRECTS[c.req.path], 301)
  }
  await next()
})
app.on(
  "GET",
  ['/', '/:page', '/admin/kv', '/:year{\\d{4}}/:month{\\d{2}}/:date{\\d{2}}/:title{[A-Za-z0-9_-]+}'],
  jsxRenderer(({ children }, context) => {
    return <html lang={context.get('language')}>{children}</html>
  })
)

app.use('/static/*', serveStatic({ root: './' }))
// app.use('/favicon.ico', serveStatic({ path: './static/favicon.ico' }))
app.use(BLOG_RSS, serveStatic({ path: './static/atom.xml' }))

app.get('/', async (c) => {
  const posts = await getCachedPosts()
  const {pv, uv} = await updatePVUV(c)
  return c.render(<Home posts={posts} count={{pv, uv}} />)
})
app.get('/404', async (c) => {
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

    const {pv, uv} = await updatePVUV(c)
    return c.render(<ArticleDetail count={{pv, uv }} {...post} />)
  }
})
app.get('/:page', async (c) => {
  const { page } = c.req.param()
  const file = join(BLOG_DIR, page + ".md")

  if (!await exists(file, { isFile: true })) {
    return c.notFound()
  } else {
    const {pv, uv} = await updatePVUV(c)
    const post = await parseYamlFile(file, true)
    if (!post) return c.notFound()

    return c.render(<ArticleDetail count={{pv, uv}} {...post} />)
  }
})

app.get("/admin/kv", async (c) => {
  const kStr = c.req.query()["k"]

  const kv = await getAll()

  if (kStr) {
    const keys = kStr.split(":")

    await removePVUV(keys)
    return c.render(<KVTable title="KV" kv={kv} />)
  }

  return c.render(<KVTable title="KV" kv={kv} />)
})

Deno.serve({ port: APP_PORT }, app.fetch)
