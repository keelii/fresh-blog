import { MarkdownIt, MarkdownItAnchor, MarkdownItFootnote, MarkdownItToc } from "../deps.ts";

import Prism from "prismjs";
// (window as any).Prism = Prism;

import "prismjs/components/prism-bash?no-check&pin=v57";
import "prismjs/components/prism-vim?no-check&pin=v57";
import "prismjs/components/prism-typescript?no-check&pin=v57";
import "prismjs/components/prism-makefile?no-check&pin=v57";
import "prismjs/components/prism-http?no-check&pin=v57";
import "prismjs/components/prism-python?no-check&pin=v57";
import "prismjs/components/prism-java?no-check&pin=v57";
import "prismjs/components/prism-jsx?no-check&pin=v57";
import "prismjs/components/prism-json?no-check&pin=v57";

import { htmlEncode } from "./util.ts";

export const md = new MarkdownIt({
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
