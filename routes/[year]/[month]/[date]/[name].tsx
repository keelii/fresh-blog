/** @jsx h */
import { Fragment, h } from "preact";
import { Handlers, PageProps } from "$fresh/server.ts";
import { MetaInfo, parseCachedYamlFile, toDisplayDate } from "../../../../utils/util.ts";
import { Container } from "../../../../component/Container.tsx";
import { Comment } from "../../../../component/Comment.tsx";
import { Layout } from "../../../../component/Layout.tsx";

import { join } from "../../../../deps.ts";
import { cfg } from "../../../../main.ts";

export const handler: Handlers<MetaInfo | null> = {
  async GET(_, ctx) {
    const file = join(cfg.getEnv("POST_DIR"), ctx.params.name + ".md");
    const result = await parseCachedYamlFile(file, true);
    return ctx.render(result);
  },
};

export default function ArticleDetail(props: PageProps<MetaInfo>) {
  const { content, ...yaml } = props.data;

  const initMath = `
    window.MathJax = {
      options: {},
      tex: {
        inlineMath: [ ['$','$'] ],
        displayMath: [ ['$$','$$'] ],
        processEscapes: false
      }
    }
  `;

  return (
    <Layout title={yaml.title} canonical={yaml.url}>
      <Container>
        <header className={"wysiwyg"}>
          <h1>{yaml.title}</h1>
          <span className="meta">
            {toDisplayDate(yaml.date)}
            <a style={{ marginLeft: 5 }} href="/">首页</a>
          </span>
        </header>
        <article className={"wysiwyg"}>
          <div
            className="markdown-body"
            data-light-theme="light"
            dangerouslySetInnerHTML={{ __html: content }}
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
