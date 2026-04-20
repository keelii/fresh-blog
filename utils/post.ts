import { basename } from "jsr:@std/path";
import { parse as parseYaml } from "jsr:@std/yaml";
import { walk } from "jsr:@std/fs";


import { md } from "./markdown.ts";
import {BLOG_DIR} from "../config.ts";
import {POST_CACHE} from "../cache.ts"

export interface MetaInfo {
  title: string;
  url: string;
  categories: string[];
  tags: string[];
  math?: boolean;
  draft?: boolean;
  date: Date;
  content: string;
}

interface ICache {
  posts: MetaInfo[] | null;
  category: Record<string, MetaInfo[]>;
}
export function getYamlString(content: string) {
  const lines = content.split("\n");
  const yaml: string[] = [];

  let count = 0;
  let i;

  for (i = 0; i < lines.length; i++) {
    if (lines[i].startsWith("---")) {
      count++;
      continue;
    } else {
      yaml.push(lines[i]);
    }
    if (count === 2) {
      break;
    }
  }

  return [yaml.join("\n").trim(), lines.slice(i).join("\n").trim()];
}
export async function parseYamlContent(path: string, contents: string, includeContent: boolean = false): Promise<MetaInfo | null> {
  const [yamlContent, mdContent] = getYamlString(contents);

  try {
    const toml = parseYaml(yamlContent) as any;
    const html = md.render(mdContent);

    if (!toml) {
      console.warn(path, contents.length, yamlContent)
      return null
    }

    if (toml.draft) {
      return null;
    }

    const date = new Date(Date.parse(toml.date));
    const datePrefix = new Intl.DateTimeFormat("zh-Hans-CN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      timeZone: "UTC",
    }).format(date);
    const name = basename(path, ".md");
    const isPage = !/^\d{4}/.test(path);
    const url = isPage ? `/${name}` : `/${datePrefix}/${name}`;

    return {
      title: toml.title,
      url,
      date,
      categories: toml.categories ? toml.categories : [],
      tags: toml.tags ? toml.tags : [],
      math: !!toml.math,
      draft: !!toml.draft,
      content: includeContent ? html : "",
    };
  } catch (e) {
    console.error(path, e);
  }
  return null;
}

export async function parseYamlFile(path: string, includeContent: boolean = false): Promise<MetaInfo | null> {
  const contents = await Deno.readTextFile(path);
  return parseYamlContent(path, contents, includeContent);
}

export async function getCachedPosts(includeContent: boolean = false): ICache {
  try {
    return await getPosts(BLOG_DIR, includeContent);
  } catch (e) {
    console.error(e);
    return {
      posts: [],
      category: {},
    }
  }
}

export async function getLocalPosts(dir: string, includeContent: boolean = false): ICache {
  const items = await walk(dir, {
    exts: [".md"],
    skip: [/\.obsidian/, /node_modules/, /\.git/, /\.vscode/, /\.idea/],
  });
  const posts: MetaInfo[] = [];
  const category: Record<string, MetaInfo[]> = {};

  for await (const item of items) {
    if (item.isFile) {
      let info = await parseYamlFile(item.path, includeContent);

      const ret = await parseYamlFile(item.path, false)
      if (Array.isArray(ret && ret.categories) && ret.categories.length) {
        ret.categories.forEach(name => {
          const key = name.replaceAll(/\s+/g, "-")
          if (!category[key]) {
            category[key] = []
          }
          category[key].push(info)
        })
      }
      info && posts.push(info);
    }
  }

  posts.sort((a, b) => b.date - a.date);
  return { posts, category };
}
export async function getPosts(dir: string, includeContent: boolean = false): ICache {
  if (POST_CACHE.size) {
    const posts: MetaInfo[] = [];
    const category: Record<string, MetaInfo[]> = {};
    for (let [path, content] of POST_CACHE) {
      const info = await parseYamlContent(path, content, includeContent);
      if (!info) {
        // console.warn("No info:", path)
        continue;
      }
      posts.push(info)
      ;(info.categories || []).forEach(name => {
        const key = name.replaceAll(/\s+/g, "-")
        if (!category[key]) {
          category[key] = []
        }
        category[key].push(info)
      })
    }

    console.log("Use cached posts:", posts.length)

    posts.sort((a, b) => b.date - a.date);
    return { posts, category };
  }

  console.log("Read local posts", POST_CACHE.size)
  return getLocalPosts(dir, includeContent);
}
