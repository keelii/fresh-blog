import {
  basename,
  error,
  MarkdownIt,
  MarkdownItAnchor,
  MarkdownItFootnote,
  MarkdownItToc,
  parseYaml,
  walk,
} from "../deps.ts";

import Prism from "prismjs";
(window as any).Prism = Prism;

import "prismjs/components/prism-bash?no-check&pin=v57";
import "prismjs/components/prism-vim?no-check&pin=v57";
import "prismjs/components/prism-typescript?no-check&pin=v57";
import "prismjs/components/prism-makefile?no-check&pin=v57";
import "prismjs/components/prism-http?no-check&pin=v57";
import "prismjs/components/prism-python?no-check&pin=v57";
import "prismjs/components/prism-java?no-check&pin=v57";
import "prismjs/components/prism-jsx?no-check&pin=v57";
import "prismjs/components/prism-json?no-check&pin=v57";

const md = new MarkdownIt({
  html: true,
  highlight: function (str: string, lang: string) {
    if (lang && Prism.languages[lang]) {
      return Prism.highlight(str, Prism.languages[lang], lang);
    }
    return htmlEncode(str);
  },
});
const slugify = function (s: string) {
  return String(s).trim().toLowerCase().replace(/\s+/g, "-");
};
md.use(MarkdownItAnchor, {
  permalink: true,
  permalinkClass: "anchor",
  permalinkBefore: true,
  permalinkSpace: false,
  slugify,
});

const tocOptions = {
  placeholder: "{{TOC}}",
  slugify,
  uniqueSlugStartIndex: 1,
  containerClass: "table-of-contents",
  containerId: undefined,
  listClass: undefined,
  itemClass: undefined,
  linkClass: undefined,
  level: 1,
  listType: "ol",
  format: undefined,
  callback: undefined, /* function(html, ast) {} */
};

md.use(MarkdownItToc, tocOptions);
md.use(MarkdownItFootnote);

function htmlEncode(x: string) {
  return String(x)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

md.renderer.rules.tocOpen = function (tokens: any[], idx: number) {
  let _options = Object.assign({}, tocOptions);
  if (tokens && idx >= 0) {
    const token = tokens[idx];
    _options = Object.assign(_options, token.inlineOptions);
  }
  const id = _options.containerId ? ` id="${htmlEncode(_options.containerId)}"` : "";
  return `<div id="toc"><div onclick="this.parentNode.classList.toggle('show')" class="toggle">§</div><nav${id} class="${
    htmlEncode(_options.containerClass)
  }">`;
};
md.renderer.rules.tocClose = function () {
  return "</nav></div>";
};

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

export async function parseCachedYamlFile(path: string, includeContent: boolean = false) {
  if (!CACHE.post[path]) {
    const result = await parseYamlFile(path, includeContent);
    if (result) {
      CACHE.post[path] = result;
    }
  }
  return CACHE.post[path];
}

export async function parseYamlFile(path: string, includeContent: boolean = false) {
  const contents = await Deno.readTextFile(path);
  const [yamlContent, mdContent] = getYamlString(contents);

  try {
    const toml = parseYaml(yamlContent) as any;

    const html = md.render(mdContent);
    // const html = render(mdContent, {});

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
      content: includeContent ? html : "",
    };
  } catch (e) {
    error("解析出错：" + path, e);
  }
  return null;
}

export async function getCachedPosts(dir: string, includeContent: boolean = false) {
  if (!CACHE.posts) {
    CACHE.posts = await getPosts(dir, includeContent);
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
