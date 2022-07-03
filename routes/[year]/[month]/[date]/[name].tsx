/** @jsx h */
import { Fragment, h } from "preact";
import { PageProps } from "$fresh/server.ts";
import { join } from "https://deno.land/std/path/mod.ts";

import { render } from "https://deno.land/x/gfm@0.1.20/mod.ts";
import { parseToml, toDisplayDate } from "../../../../utils/util.ts";
import { Container } from "../../../../component/Container.tsx";
import { Layout } from "../../../../component/Layout.tsx";
import { POST_DIR } from "../../../../main.ts";

export default function ArticleDetail(props: PageProps) {
  const file = join(POST_DIR, props.params.name + ".md");
  const { content, ...toml } = parseToml(file);
  const html = render(content);

  const initMath = `
    window.MathJax = {
      options: {},
      tex: {
        inlineMath: [ ['$','$'] ],
        displayMath: [ ['$$','$$'], ["\\[","\\]"] ],
        processEscapes: false
      }
    }
  `;

  console.log(toml.math);

  return (
    <Layout title={toml.title}>
      <Container>
        <header>
          <h1>{toml.title}</h1>
          <span className="meta">
            {toDisplayDate(toml.date)} <a href="/">首页</a>
          </span>
        </header>
        <article className={"wysiwyg"}>
          <div
            className="markdown-body"
            data-light-theme="light"
            dangerouslySetInnerHTML={{ __html: html }}
          >
          </div>
          {toml.math && (
            <Fragment>
              <script dangerouslySetInnerHTML={{ __html: initMath }} />
              <script
                id="MathJax-script"
                src="//unpkg.com/mathjax@3.2.2/es5/tex-chtml.js"
              />
            </Fragment>
          )}
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
