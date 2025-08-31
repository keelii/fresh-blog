import { join } from "jsr:@std/path";
import { warn } from "jsr:@std/log";
import {maskPass} from "./utils/util.ts"

export const APP_PORT = Number(Deno.env.get("APP_PORT")) || 80;
export const APP_ENV = Deno.env.get("APP_ENV") || "prd";
export const APP_DISALLOW_SE = Boolean(Deno.env.get("APP_DISALLOW_SE") || false);
export const APP_IS_PRD = APP_ENV === "prd";
export const BLOG_DIR = join(Deno.cwd(), Deno.env.get("BLOG_DIR") || "blog");
export const BLOG_URL = Deno.env.get("BLOG_URL") || "https://keelii.com";
export const BLOG_TITLE = Deno.env.get("BLOG_TITLE") || "臨池不輟"
export const BLOG_DESCRIPTION = Deno.env.get("BLOG_DESCRIPTION") || "芝兰生于深林，不以无人而不芳，君子修道立德，不为穷困而败节。"
export const BLOG_AUTHOR = Deno.env.get("BLOG_AUTHOR") || "keelii"
export const BLOG_KEYWORDS = Deno.env.get("BLOG_KEYWORDS") || "前端开发,编程,javascript,typescript,css,html,nodejs,python,java"
export const BLOG_RSS = Deno.env.get("BLOG_RSS") || "/atom.xml"
export const APP_TOKEN = Deno.env.get("APP_TOKEN")

export const REDIRECTS = {
  "/2019/07/03/nestjs-framework-tutorial-8": "/2019/07/04/nestjs-framework-tutorial-8",
  "/2020/05/10/frontend-dev-bottleneck-and-future": "/2020/05/11/frontend-dev-bottleneck-and-future"
}

warn("CONFIG:" + JSON.stringify({
  APP_ENV,
  APP_PORT,
  APP_DISALLOW_SE,
  BLOG_DIR: BLOG_DIR,
  BLOG_URL,
  BLOG_TITLE,
  BLOG_DESCRIPTION,
  BLOG_AUTHOR,
  BLOG_KEYWORDS,
  BLOG_RSS,
  APP_TOKEN: maskPass(APP_TOKEN)
}))
