/** @jsx h */
import { Fragment, h } from "preact";
import { Handlers, PageProps } from "$fresh/server.ts";
import { join } from "https://deno.land/std/path/mod.ts";

import { render } from "https://deno.land/x/gfm@0.1.20/mod.ts";
import {
  MetaInfo,
  parseYamlFile,
  toDisplayDate,
} from "../../../../utils/util.ts";
import { Container } from "../../../../component/Container.tsx";
import { Comment } from "../../../../component/Comment.tsx";
import { Layout } from "../../../../component/Layout.tsx";
import { CONTENT_DIR, POST_DIR } from "../../../../main.ts";

import "https://esm.sh/prismjs@1.25.0/components/prism-bash?no-check&pin=v57";
import "https://esm.sh/prismjs@1.25.0/components/prism-typescript?no-check&pin=v57";
import "https://esm.sh/prismjs@1.25.0/components/prism-makefile?no-check&pin=v57";
import "https://esm.sh/prismjs@1.25.0/components/prism-http?no-check&pin=v57";
import "https://esm.sh/prismjs@1.25.0/components/prism-java?no-check&pin=v57";
import "https://esm.sh/prismjs@1.25.0/components/prism-json?no-check&pin=v57";

export const handler: Handlers<MetaInfo | null> = {
  async GET(_, ctx) {
    const file = join(POST_DIR, ctx.params.name + ".md");
    const result = await parseYamlFile(file);
    return ctx.render(result);
  },
};

export default function ArticleDetail(props: PageProps<MetaInfo>) {
  const { content, ...yaml } = props.data;
  const html = render(content, {});

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

  return (
    <Layout title={yaml.title}>
      <Container>
        <header className={"wysiwyg"}>
          <h1>{yaml.title}</h1>
          <span className="meta">
            {toDisplayDate(yaml.date)}
            {"\u3000"}
            <a href="/">首页</a>
          </span>
        </header>
        <article className={"wysiwyg"}>
          <div
            className="markdown-body"
            data-light-theme="light"
            dangerouslySetInnerHTML={{ __html: html }}
          >
          </div>
          {yaml.math && (
            <Fragment>
              <script dangerouslySetInnerHTML={{ __html: initMath }} />
              <script
                id="MathJax-script"
                src="//unpkg.com/mathjax@3.2.2/es5/tex-chtml.js"
              />
            </Fragment>
          )}
        </article>
        <div className="eof" />
        <Comment />
      </Container>
    </Layout>
  );
}
