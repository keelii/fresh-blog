import { parse } from "https://deno.land/std/encoding/toml.ts";
import { stringify } from "https://deno.land/std/encoding/yaml.ts";
import { basename } from "https://deno.land/std/path/mod.ts";
import { walkSync } from "https://deno.land/std/fs/mod.ts";

export interface TomlInfo {
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

export function getTomlString(content: string) {
  const lines = content.split("\n");
  const toml: string[] = [];

  let count = 0;
  let i;

  for (i = 0; i < lines.length; i++) {
    if (lines[i].startsWith("+++")) {
      count++;
      continue;
    } else {
      toml.push(lines[i]);
    }
    if (count === 2) {
      break;
    }
  }

  return [toml.join("\n").trim(), lines.slice(i).join("\n").trim()];
}

export function parseToml(path: string, includeContent: boolean = true) {
  const contents = Deno.readTextFileSync(path);
  const [tomlContent, mdContent] = getTomlString(contents);
  try {
    const toml = parse(tomlContent) as any;

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
    console.error("解析出错：" + path, e);
    return null;
  }
}

export function getPosts(dir: string, includeContent: boolean = true) {
  const items = walkSync(dir);
  const articles: TomlInfo[] = [];

  for (const item of items) {
    if (item.isFile) {
      const info = parseToml(item.path, includeContent);
      info && articles.push(info);
      if (info) {
        const {title, date, url, content, ...rest} = info
        try {
          let matter = {title, date} as any
          if (rest.categories && rest.categories.length) {
            matter.categories = rest.categories
          }
          if (rest.tags && rest.tags.length) {
            matter.tags = rest.tags
          }
          if (rest.math) matter.math = rest.math
          if (rest.draft) matter.draft = rest.draft

          if (item.path.includes("test-post")) {
            // const cnt = `---\n${stringify(matter)}---\n\n${content}`
            // console.log(cnt)
            // Deno.writeTextFileSync(item.path, cnt)
          }
        } catch (e) {
          console.log(rest)
          console.log("ERROR: ", item.path, e.message)
          break;
        }
      }
    }
  }

  // @ts-ignore:
  return articles.sort((a, b) => b.date - a.date);
}
