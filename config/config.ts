import {info, join, setupEnvironment, warning} from "../deps.ts"
import {DotenvConfig} from "std/dotenv/mod.ts"

export interface BlogConfig extends DotenvConfig {
  url: string,
  title: string
  description: string
  author: string
  keywords: string
  rss: string
}
interface BlogEnv extends DotenvConfig {
  BLOG_TITLE: string
  BLOG_DESCRIPTION: string
  BLOG_AUTHOR: string
  BLOG_KEYWORDS: string
  BLOG_RSS: string
}
export interface EnvConfig extends DotenvConfig {
  APP_ENV: "prd" | "dev"
  APP_URL: string
  CONTENT_DIR: string
  POST_DIR: string
}

type DotEnv = EnvConfig & BlogEnv

export async function setupConfig() {
  const DOT_CONFIG = await setupEnvironment({
    path: "./config/.env",
    defaults: "./config/.defaults.env",
  }) as DotEnv

  const APP_ENV = DOT_CONFIG.APP_ENV || "dev"
  const APP_URL = DOT_CONFIG.APP_URL || "dev"
  const CONTENT_DIR = join(Deno.cwd(), DOT_CONFIG.CONTENT_DIR || "blog")
  const POST_DIR = join(CONTENT_DIR, DOT_CONFIG.POST_DIR || "posts")

  const EnvConfigMap: EnvConfig = {
    APP_ENV,
    APP_URL,
    CONTENT_DIR,
    POST_DIR,
  }
  const BlogConfigMap: BlogConfig = {
    url: APP_URL,
    title: DOT_CONFIG.BLOG_TITLE,
    description: DOT_CONFIG.BLOG_DESCRIPTION,
    author: DOT_CONFIG.BLOG_AUTHOR,
    keywords: DOT_CONFIG.BLOG_KEYWORDS,
    rss: DOT_CONFIG.BLOG_RSS
  }

  warning("APP_ENV: " + APP_ENV)
  info("[EnvConfig]: " + JSON.stringify(EnvConfigMap))
  info("[BlogConfig]: " + JSON.stringify(BlogConfigMap))

  return {
    isPrd() {
      return APP_ENV === "prd"
    },
    getConfig(key: string) {
      return BlogConfigMap[key]
    },
    getEnv(key: keyof EnvConfig) {
      return EnvConfigMap[key]
    }
  }
}
