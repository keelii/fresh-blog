/// <reference no-default-lib="true" />
/// <reference lib="dom" />
/// <reference lib="dom.asynciterable" />
/// <reference lib="deno.ns" />
/// <reference lib="deno.unstable" />

import { InnerRenderFunction, RenderContext, start } from "$fresh/server.ts";
import manifest from "./fresh.gen.ts";

import { config, setup } from "@twind";
import { virtualSheet } from "twind/sheets";

const sheet = virtualSheet();
sheet.reset();
setup({ ...config, sheet });

function render(ctx: RenderContext, render: InnerRenderFunction) {
  const snapshot = ctx.state.get("twind") as unknown[] | null;
  sheet.reset(snapshot || undefined);
  render();
  const resetCSS = "html,body,p,ol,ul,li,dl,dt,dd,blockquote,figure,fieldset,legend,textarea,pre,iframe,hr,h1,h2,h3,h4,h5,h6{margin:0;padding:0}h1,h2,h3,h4,h5,h6{font-size:100%;font-weight:normal}ul{list-style:none}button,input,select{margin:0}html{box-sizing:border-box}*,*::before,*::after{box-sizing:inherit}img,video{height:auto;max-width:100%}iframe{border:0}table{border-collapse:collapse;border-spacing:0}td,th{padding:0}"
  const wysiwygCSS = ".wysiwyg{line-height:1.6}.wysiwyg a{text-decoration:none}.wysiwyg a:hover{border-bottom:1px solid}.wysiwyg abbr{border-bottom:1px dotted;cursor:help}.wysiwyg cite{font-style:italic}.wysiwyg hr{background:#e6e6e6;border:none;display:block;height:1px;margin-bottom:1.4em;margin-top:1.4em}.wysiwyg img{vertical-align:text-bottom}.wysiwyg ins{background-color:lime;text-decoration:none}.wysiwyg mark{background-color:#ff0}.wysiwyg small{font-size:0.8em}.wysiwyg strong{font-weight:700}.wysiwyg sub,.wysiwyg sup{font-size:0.8em}.wysiwyg sub{vertical-align:sub}.wysiwyg sup{vertical-align:super}.wysiwyg p,.wysiwyg dl,.wysiwyg ol,.wysiwyg ul,.wysiwyg blockquote,.wysiwyg pre,.wysiwyg table{margin-bottom:1.4em}.wysiwyg p:last-child,.wysiwyg dl:last-child,.wysiwyg ol:last-child,.wysiwyg ul:last-child,.wysiwyg blockquote:last-child,.wysiwyg pre:last-child,.wysiwyg table:last-child{margin-bottom:0}.wysiwyg p:empty{display:none}.wysiwyg h1,.wysiwyg h2,.wysiwyg h3,.wysiwyg h4,.wysiwyg h5,.wysiwyg h6{font-weight:700;line-height:1.2}.wysiwyg h1:first-child,.wysiwyg h2:first-child,.wysiwyg h3:first-child,.wysiwyg h4:first-child,.wysiwyg h5:first-child,.wysiwyg h6:first-child{margin-top:0}.wysiwyg h1{font-size:2.4em;margin-bottom:.58333em;margin-top:.58333em;line-height:1}.wysiwyg h2{font-size:1.6em;margin-bottom:.875em;margin-top:1.75em;line-height:1.1}.wysiwyg h3{font-size:1.3em;margin-bottom:1.07692em;margin-top:1.07692em}.wysiwyg h4{font-size:1.2em;margin-bottom:1.16667em;margin-top:1.16667em}.wysiwyg h5{font-size:1.1em;margin-bottom:1.27273em;margin-top:1.27273em}.wysiwyg h6{font-size:1em;margin-bottom:1.4em;margin-top:1.4em}.wysiwyg dd{margin-left:1.4em}.wysiwyg ol,.wysiwyg ul{list-style-position:outside;margin-left:1.4em}.wysiwyg ol{list-style-type:decimal}.wysiwyg ol ol{list-style-type:lower-alpha}.wysiwyg ol ol ol{list-style-type:lower-roman}.wysiwyg ol ol ol ol{list-style-type:lower-greek}.wysiwyg ol ol ol ol ol{list-style-type:decimal}.wysiwyg ol ol ol ol ol ol{list-style-type:lower-alpha}.wysiwyg ul{list-style-type:disc}.wysiwyg ul ul{list-style-type:circle}.wysiwyg ul ul ul{list-style-type:square}.wysiwyg ul ul ul ul{list-style-type:circle}.wysiwyg ul ul ul ul ul{list-style-type:disc}.wysiwyg ul ul ul ul ul ul{list-style-type:circle}.wysiwyg blockquote{border-left:4px solid #e6e6e6;padding:0.6em 1.2em}.wysiwyg blockquote p{margin-bottom:0}.wysiwyg code,.wysiwyg kbd,.wysiwyg samp,.wysiwyg pre{-moz-osx-font-smoothing:auto;-webkit-font-smoothing:auto;background-color:#f2f2f2;color:#333;font-size:0.9em}.wysiwyg code,.wysiwyg kbd,.wysiwyg samp{border-radius:3px;line-height:1.77778;padding:0.1em 0.4em 0.2em;vertical-align:baseline}.wysiwyg pre{overflow:auto;padding:1em 1.2em}.wysiwyg pre code{background:none;font-size:1em;line-height:1em}.wysiwyg figure{margin-bottom:2.8em;text-align:center}.wysiwyg figure:first-child{margin-top:0}.wysiwyg figure:last-child{margin-bottom:0}.wysiwyg figcaption{font-size:0.8em;margin-top:.875em}.wysiwyg table{width:100%}.wysiwyg table pre{white-space:pre-wrap}.wysiwyg th,.wysiwyg td{font-size:1em;padding:.7em;border:1px solid #e6e6e6;line-height:1.4}.wysiwyg thead tr,.wysiwyg tfoot tr{background-color:#f5f5f5}.wysiwyg thead th,.wysiwyg thead td,.wysiwyg tfoot th,.wysiwyg tfoot td{font-size:.9em;padding:.77778em}.wysiwyg thead th code,.wysiwyg thead td code,.wysiwyg tfoot th code,.wysiwyg tfoot td code{background-color:#fff}.wysiwyg tbody tr{background-color:#fff}"
  const customCSS = `
  body { font-family: "Source Serif Pro", "Crimson Text", "Noto Serif SC", "Noto Serif CJK SC", "Noto Serif CJK", "Source Han Serif SC", "Source Han Serif CN", "Source Han Serif", source-han-serif-sc, serif; }
  h1 { font-size: 1.8em; font-weight: 700; }
  header { margin-bottom: 40px; }
  blockquote { font-family: "Crimson Text", STKaiti, KaiTi }
  pre,code { font-family: "Latin Modern Mono", "SF Mono", monaco, Consolas, "Noto Serif SC", "Noto Serif CJK SC", "Noto Serif CJK", "Source Han Serif SC", "Source Han Serif CN", "Source Han Serif", source-han-serif-sc; }
  .container {padding: 40px 20em; }
  .anchor { display: none; margin-left: -26px; padding-right: 10px; }
  .container .anchor:hover { border: none; }
  h2:hover>.anchor,
  h3:hover>.anchor,
  h4:hover>.anchor,
  h5:hover>.anchor,
  h6:hover>.anchor { display: inline; }
  .meta { color: #ccc; font-size: 0.5em; }
  .highlight { margin-bottom: 1.4em; }
  .container .utterances { max-width: none; }
  `
  ctx.styles.splice(0, ctx.styles.length, resetCSS + wysiwygCSS + customCSS);
  // ctx.styles.splice(0, ctx.styles.length, ...(sheet).target);
  const newSnapshot = sheet.reset();
  ctx.state.set("twind", newSnapshot);
}

await start(manifest, { render });
