import { MetaInfo } from "../utils/post.ts";
import { Layout } from "./Layout.tsx";
import { Container } from "./Container.tsx";
import { toDisplayDate } from "../utils/util.ts";
import { Fragment } from "hono/jsx";
import { Comment } from "./Comment.tsx";
import { Footer } from "./Footer.tsx";

export function ArticleDetail(props: MetaInfo & { pv: Deno.KvEntry<number> | null }) {
  const { content, pv, ...yaml } = props;

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
        <header className="wysiwyg">
          <h1>{yaml.title}</h1>
          <span className="meta">
            {toDisplayDate(yaml.date)}
            <a style={{ marginLeft: 5 }} href="/">首页</a> | <span>看过({pv?.value || 0})</span>
          </span>
        </header>
        <article className="wysiwyg">
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
                async
              />
            </Fragment>
          )}
        </article>
        <div className="eof" />
        <Comment />
        <Footer pv={pv} />
      </Container>
    </Layout>
  );
}
