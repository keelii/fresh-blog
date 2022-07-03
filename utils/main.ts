import { parse } from "https://deno.land/std/encoding/toml.ts";
import { basename } from "https://deno.land/std/path/mod.ts";

export interface TomlInfo {
  title: string;
  url: string;
  categories: string[];
  tags: string[];
  date: Date;
  content: string;
}

export function toDisplayDate(date: Date) {
  return new Intl.DateTimeFormat("zh-Hans-CN", {}).format(date)
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

export function parseToml(path: string) {
  const contents = Deno.readTextFileSync(path);
  const [tomlContent, mdContent] = getTomlString(contents);
  try {
    const toml = parse(tomlContent) as any;
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
      categories: toml.categories,
      tags: toml.tags,
      content: mdContent,
    };
  } catch (e) {
    console.error(e);
    return {} as TomlInfo;
  }
}
