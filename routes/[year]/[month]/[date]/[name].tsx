/** @jsx h */
import { h } from "preact";
import { PageProps } from "$fresh/server.ts";
import { join } from "https://deno.land/std/path/mod.ts";

import { render } from "https://deno.land/x/gfm@0.1.20/mod.ts";
import { parseToml, toDisplayDate } from "../../../../utils/main.ts";
import { Container } from "../../../../component/Container.tsx";
import { Layout } from "../../../../component/Layout.tsx";

export default function ArticleDetail(props: PageProps) {
  const file = join(Deno.cwd(), "archives", props.params.name + ".md");
  const { content, ...toml } = parseToml(file);
  const html = render(content);

  const initMath = `
    if (typeof MathJax !=="undefined") {
      MathJax.Hub.Config({
          tex2jax: {
              inlineMath: [ ['$','$'], ["\\(","\\)"] ],
              displayMath: [ ['$$','$$'], ["\\[","\\]"] ],
              processEscapes: true
          }
      });
  }`;

  return (
    <Layout title={toml.title}>
      <Container>
        <header>
          <h1>{toml.title}</h1>
          <span className="meta">{toDisplayDate(toml.date)} <a href="/">首页</a></span>
        </header>
        <article className={"wysiwyg"}>
          <div
            className="markdown-body"
            data-light-theme="light"
            dangerouslySetInnerHTML={{ __html: html }}
          >
          </div>

          <script src="//cdn.bootcss.com/mathjax/2.7.0/MathJax.js?config=TeX-AMS-MML_HTMLorMML">
          </script>
          <script dangerouslySetInnerHTML={{ __html: initMath }}>
          </script>
          <div className="comment">
            <script
              src="https://utteranc.es/client.js"
              // @ts-ignore:
              repo="keelii/blog"
              issue-term="title"
              label="评论"
              theme="github-light"
              crossorigin="anonymous"
              async
            >
            </script>
          </div>
        </article>
      </Container>
    </Layout>
  );
}
