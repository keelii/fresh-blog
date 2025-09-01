import { basename } from "jsr:@std/path";
import { parse as parseYaml } from "jsr:@std/yaml";
import { walk } from "jsr:@std/fs";



import { md } from "./markdown.ts";
import {BLOG_DIR} from "../config.ts";

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
  post: Record<string, MetaInfo>;
}

let CACHE: ICache = {
  posts: null,
  post: {},
};

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

export async function parseCachedYamlFile(path: string, includeContent: boolean = false) {
  if (!CACHE.post[path]) {
    const result = await parseYamlFile(path, includeContent);
    if (result) {
      CACHE.post[path] = result;
    }
  }
  return CACHE.post[path];
}

export async function parseYamlFile(path: string, includeContent: boolean = false): Promise<MetaInfo | null> {
  const contents = await Deno.readTextFile(path);
  const [yamlContent, mdContent] = getYamlString(contents);

  try {
    const toml = parseYaml(yamlContent) as any;

    const html = md.render(mdContent);

    if (toml.draft) return null;

    const date = new Date(Date.parse(toml.date));
    const datePrefix = new Intl.DateTimeFormat("zh-Hans-CN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      timeZone: "UTC",
    }).format(date);
    const name = basename(path, ".md");
    const url = `/${datePrefix}/${name}`;

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
    console.error(e);
  }
  return null;
}

export async function getCachedPosts(includeContent: boolean = false) {
  if (!CACHE.posts) {
    try {
      CACHE.posts = await getPosts(BLOG_DIR, includeContent);
    } catch (e) {
      console.log("=====", BLOG_DIR)
      console.error(e);
      return []
    }
  }
  return CACHE.posts;
}

export async function getPosts(dir: string, includeContent: boolean = false) {
  const items = await walk(dir);
  const articles: MetaInfo[] = [];

  for await (const item of items) {
    if (item.isFile) {
      let info = await parseYamlFile(item.path, includeContent);

      info && articles.push(info);

      // if (info) {
      //   const {title, date, url, content, ...rest} = info
      //   try {
      //     let matter = {title, date} as any
      //     if (rest.categories && rest.categories.length) {
      //       matter.categories = rest.categories
      //     }
      //     if (rest.tags && rest.tags.length) {
      //       matter.tags = rest.tags
      //     }
      //     if (rest.math) matter.math = rest.math
      //     if (rest.draft) matter.draft = rest.draft
      //
      //     // if (item.path.includes("test-post")) {
      //     //   const cnt = `---\n${stringify(matter)}---\n\n${content}`
      //       // Deno.writeTextFileSync(item.path, cnt)
      //     // }
      //   } catch (e) {
      //     console.log(rest)
      //     console.log("ERROR: ", item.path, e.message)
      //     break;
      //   }
      // }
    }
  }

  // @ts-ignore:
  return articles.sort((a, b) => b.date - a.date);
}
