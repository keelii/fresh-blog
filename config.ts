import {join} from "https://deno.land/std/path/mod.ts"
import * as log from "https://deno.land/std/log/mod.ts"

export const CONTENT_DIR = join(Deno.cwd(), "blog")
export const POST_DIR = join(CONTENT_DIR, "posts")

export type AppEnv = "prd" | "dev"

const APP_ENV = Deno.env.get("APP_ENV") || "dev"

log.info("APP_ENV: ", APP_ENV)

const url = APP_ENV === "prd"
  ? "https://keelii.com"
  : "http://localhost:8000"

export const BLOG_CONFIG = {
  url: url,
  title: "臨池不輟",
  description: "__ you don&#39;t know yet",
  author: "keelii",
  keywords: "前端开发,编程,javascript,typescript,css,html,nodejs,python,java",
  rss: "atom.xml"
}
