import { info, join, load, warn } from "../deps.ts";
import { DotenvConfig } from "jsr:@std/dotenv";
import {resolve} from "jsr:@std/path"

export interface BlogConfig extends DotenvConfig {
  url: string;
  title: string;
  description: string;
  author: string;
  keywords: string;
  rss: string;
}
interface BlogEnv extends DotenvConfig {
  BLOG_TITLE: string;
  BLOG_DESCRIPTION: string;
  BLOG_AUTHOR: string;
  BLOG_KEYWORDS: string;
  BLOG_RSS: string;
}
export interface EnvConfig extends DotenvConfig {
  APP_ENV: "prd" | "dev";
  APP_URL: string;
  CONTENT_DIR: string;
  POST_DIR: string;
}

type DotEnv = EnvConfig & BlogEnv;

export async function setupConfig() {
  const DOT_CONFIG = await load({
    envPath: resolve("./config/.prd.env"),
    defaults: resolve("./config/.defaults.env"),
  }) as DotEnv;

  const APP_ENV = DOT_CONFIG.APP_ENV || "dev";
  const APP_URL = DOT_CONFIG.APP_URL || "http://localhost";
  const ENABLE_PAGEVIEW = DOT_CONFIG.ENABLE_PAGEVIEW || "0";
  const CONTENT_DIR = join(Deno.cwd(), DOT_CONFIG.CONTENT_DIR || "blog");

  const EnvConfigMap: EnvConfig = {
    APP_ENV,
    APP_URL,
    ENABLE_PAGEVIEW,
    CONTENT_DIR,
    POST_DIR: CONTENT_DIR,
  };
  const BlogConfigMap: BlogConfig = {
    url: APP_URL,
    title: DOT_CONFIG.BLOG_TITLE,
    description: DOT_CONFIG.BLOG_DESCRIPTION,
    author: DOT_CONFIG.BLOG_AUTHOR,
    keywords: DOT_CONFIG.BLOG_KEYWORDS,
    rss: DOT_CONFIG.BLOG_RSS,
  };

  warn("APP_ENV: " + APP_ENV);
  info("[EnvConfig]: " + JSON.stringify(EnvConfigMap));
  info("[BlogConfig]: " + JSON.stringify(BlogConfigMap));

  return {
    isPrd() {
      return APP_ENV === "prd";
    },
    enablePageView() {
      return ENABLE_PAGEVIEW === "1";
    },
    getAll() {
      return {
        EnvConfigMap,
        BlogConfigMap,
      };
    },
    getConfig(key: keyof BlogConfig) {
      return BlogConfigMap[key];
    },
    getEnv(key: keyof EnvConfig) {
      return EnvConfigMap[key];
    },
  };
}
