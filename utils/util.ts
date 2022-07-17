// import { parse as parseTomlString } from "https://deno.land/std/encoding/toml.ts";
import {
  parse as parseYamlString,
} from "https://deno.land/std/encoding/yaml.ts";
import { basename } from "https://deno.land/std/path/mod.ts";
import * as log from "https://deno.land/std/log/mod.ts";
import { walk } from "https://deno.land/std/fs/mod.ts";

interface ICache {
  posts: MetaInfo[] | null;
  post: Record<string, MetaInfo>;
}
let CACHE: ICache = {
  posts: null,
  post: {},
};

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

export function toDisplayDate(date: Date) {
  return new Intl.DateTimeFormat("zh-Hans-CN", {}).format(date);
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
//
// export function getTomlString(content: string) {
//   const lines = content.split("\n");
//   const toml: string[] = [];
//
//   let count = 0;
//   let i;
//
//   for (i = 0; i < lines.length; i++) {
//     if (lines[i].startsWith("+++")) {
//       count++;
//       continue;
//     } else {
//       toml.push(lines[i]);
//     }
//     if (count === 2) {
//       break;
//     }
//   }
//
//   return [toml.join("\n").trim(), lines.slice(i).join("\n").trim()];
// }
//
export async function parseCachedYamlFile(
  path: string,
  includeContent: boolean = true,
) {
  if (!CACHE.post[path]) {
    const result = await parseYamlFile(path, includeContent);
    if (result) {
      CACHE.post[path] = result;
    }
  }
  return CACHE.post[path];
}

export async function parseYamlFile(
  path: string,
  includeContent: boolean = true,
) {
  const contents = await Deno.readTextFile(path);
  const [yamlContent, mdContent] = getYamlString(contents);
  try {
    const toml = parseYamlString(yamlContent) as any;

    if (toml.draft) return null;

    const date = new Date(Date.parse(toml.date));
    const datePrefix = new Intl.DateTimeFormat("zh-Hans-CN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
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
      content: includeContent ? mdContent : "",
    };
  } catch (e) {
    log.error("解析出错：" + path, e);
  }
  return null;
}
//
// export function parseTomlFile(path: string, includeContent: boolean = true) {
//   const contents = Deno.readTextFileSync(path);
//   const [tomlContent, mdContent] = getTomlString(contents);
//   try {
//     const toml = parseTomlString(tomlContent) as any;
//     // if (toml.draft) return null;
//
//     const date = new Date(Date.parse(toml.date));
//     const datePrefix = new Intl.DateTimeFormat("zh-Hans-CN", {
//       year: "numeric",
//       month: "2-digit",
//       day: "2-digit",
//     }).format(date);
//     const name = basename(path, ".md");
//     const url = `/${datePrefix}/${name}`;
//
//     return {
//       title: toml.title,
//       url,
//       date,
//       categories: toml.categories ? toml.categories : [],
//       tags: toml.tags ? toml.tags : [],
//       math: !!toml.math,
//       draft: !!toml.draft,
//       content: includeContent ? mdContent : "",
//     };
//   } catch (e) {
//     // console.error("解析出错：" + path, e);
//     return null;
//   }
// }
//

export async function getCachedPosts(
  dir: string,
  includeContent: boolean = true,
) {
  if (!CACHE.posts) {
    CACHE.posts = await getPosts(dir, includeContent);
  }
  return CACHE.posts;
}

export async function getPosts(dir: string, includeContent: boolean = true) {
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
