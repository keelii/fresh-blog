import {join} from "https://deno.land/std/path/mod.ts"

export const CONTENT_DIR = join(Deno.cwd(), "blog")
export const POST_DIR = join(CONTENT_DIR, "posts")

export const BLOG_CONFIG = {
  url: "https://keelii.com",
  title: "臨池不輟",
  description: "__ you don&#39;t know yet",
  author: "keelii",
  keywords: "前端开发,编程,javascript,typescript,css,html,nodejs,python,java",
  rss: "/atom.xml"
}
