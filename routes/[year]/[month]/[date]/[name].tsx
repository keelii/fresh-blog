/** @jsx h */
import { h } from "preact";
import { tw } from "@twind";
import { PageProps } from "$fresh/server.ts";
import { join } from "https://deno.land/std/path/mod.ts";
import {parse} from "https://deno.land/std/encoding/toml.ts";

import {render} from "https://deno.land/x/gfm@0.1.20/mod.ts";
import {getTomlString} from "../../../../utils/main.ts"
import { Container } from "../../../../component/Container.tsx";

export default function ArticleDetail(props: PageProps) {
  const file = join(Deno.cwd(), "archives", props.params.name + ".md")
  const contents = Deno.readTextFileSync(file);
  const [tomlString, mdString] = getTomlString(contents)
  const toml = parse(tomlString) as any
  const html =  render(mdString)

  const initMath = `
    document.title = "${toml.title}";
    if (typeof MathJax !=="undefined") {
      MathJax.Hub.Config({
          tex2jax: {
              inlineMath: [ ['$','$'], ["\\(","\\)"] ],
              displayMath: [ ['$$','$$'], ["\\[","\\]"] ],
              processEscapes: false
          }
      });
  }`

  return (
    <Container>
      <h1>{toml.title}</h1>
      <article className={"wysiwyg"}>
        <div className="markdown-body" data-light-theme="light" dangerouslySetInnerHTML={{__html: html}}></div>
        <script src="//cdn.bootcss.com/mathjax/2.7.0/MathJax.js?config=TeX-AMS-MML_HTMLorMML"></script>
        <script dangerouslySetInnerHTML={{__html: initMath}}></script>
        <script src="https://utteranc.es/client.js"
                repo="keelii/blog"
                issue-term="title"
                label="评论"
                theme="github-light"
                crossorigin="anonymous" async>
        </script>
      </article>
    </Container>
  );
}
