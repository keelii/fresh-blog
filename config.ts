import { join, warn } from "./deps.ts";

export const APP_PORT = Number(Deno.env.get("APP_PORT")) || 80;
export const APP_ENV = Deno.env.get("APP_ENV") || "prd";
export const IS_PRD = APP_ENV === "prd";
export const POST_DIR = join(Deno.cwd(), Deno.env.get("POST_DIR") || "blog");
export const BLOG_URL = Deno.env.get("BLOG_URL") || "https://keelii.com";
export const BLOG_TITLE = Deno.env.get("BLOG_TITLE") || "臨池不輟"
export const BLOG_DESCRIPTION = Deno.env.get("BLOG_DESCRIPTION") || "芝兰生于深林，不以无人而不芳，君子修道立德，不为穷困而败节。"
export const BLOG_AUTHOR = Deno.env.get("BLOG_AUTHOR") || "keelii"
export const BLOG_KEYWORDS = Deno.env.get("BLOG_KEYWORDS") || "前端开发,编程,javascript,typescript,css,html,nodejs,python,java"
export const BLOG_RSS = Deno.env.get("BLOG_RSS") || "/atom.xml"

warn("CONFIG:" + JSON.stringify({
  APP_ENV,
  APP_PORT,
  POST_DIR,
  BLOG_URL,
  BLOG_TITLE,
  BLOG_DESCRIPTION,
  BLOG_AUTHOR,
  BLOG_KEYWORDS,
  BLOG_RSS,
}))
