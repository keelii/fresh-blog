import { escape } from "jsr:@std/html/entities";

import MarkdownIt from "npm:markdown-it";
import MarkdownItAnchor from "npm:markdown-it-anchor";
import MarkdownItToc from "npm:markdown-it-toc-done-right";
import MarkdownItFootnote from "npm:markdown-it-footnote";
import Prism from "npm:prismjs";
// (window as any).Prism = Prism;

import "https://esm.sh/prismjs/components/prism-bash?no-check&pin=v57";
import "https://esm.sh/prismjs/components/prism-vim?no-check&pin=v57";
import "https://esm.sh/prismjs/components/prism-typescript?no-check&pin=v57";
import "https://esm.sh/prismjs/components/prism-makefile?no-check&pin=v57";
import "https://esm.sh/prismjs/components/prism-http?no-check&pin=v57";
import "https://esm.sh/prismjs/components/prism-python?no-check&pin=v57";
import "https://esm.sh/prismjs/components/prism-java?no-check&pin=v57";
import "https://esm.sh/prismjs/components/prism-jsx?no-check&pin=v57";
import "https://esm.sh/prismjs/components/prism-json?no-check&pin=v57";



export const md = new MarkdownIt({
  html: true,
  highlight: function (str: string, lang: string) {
    if (lang && Prism.languages[lang]) {
      return Prism.highlight(str, Prism.languages[lang], lang);
    }
    return escape(str);
  },
});
const slugify = function (s: string) {
  return String(s).trim().toLowerCase().replace(/\s+/g, "-");
};
md.use(MarkdownItAnchor, {
  permalink: MarkdownItAnchor.permalink.linkInsideHeader({
    space: false,
    placement: 'before',
    ariaHidden: true,
    class: "anchor",
    symbol: "¶"
  }),
  // permalink: true,
  // permalinkClass: "anchor",
  // permalinkBefore: true,
  // permalinkSpace: false,
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
  const id = _options.containerId ? ` id="${escape(_options.containerId)}"` : "";
  return `<div id="toc"><div onclick="this.parentNode.classList.toggle('show')" class="toggle">§</div><nav${id} class="${
    escape(_options.containerClass)
  }">`;
};
md.renderer.rules.tocClose = function () {
  return "</nav></div>";
};
