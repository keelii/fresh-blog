import { Handlers, PageProps } from "$fresh/server.ts";
import { Layout } from "../component/Layout.tsx";
import { Container } from "../component/Container.tsx";
import { Comment } from "../component/Comment.tsx";
import { toDisplayDate } from "../utils/util.ts";
import { join } from "../deps.ts";
import { cfg } from "../main.ts";
import { MetaInfo, parseCachedYamlFile } from "../utils/post.ts";
import { countPageView } from "./helpers.ts";
import { Footer } from "../component/Footer.tsx";

export const handler: Handlers<MetaInfo | null> = {
  async GET(req: Request, ctx) {
    const pageView = await countPageView(req);

    const file = join(cfg.getEnv("CONTENT_DIR"), "about.md");
    const result = await parseCachedYamlFile(file, true);
    return ctx.render({ result, pageView });
  },
};

export default function About(props: PageProps<MetaInfo>) {
  const { result, pageView } = props.data;
  const { content, ...toml } = result;

  return (
    <Layout title={toml.title} canonical="/about">
      <Container>
        <header className={"wysiwyg"}>
          <h1>{toml.title}</h1>
          <span className="meta">
            {toDisplayDate(toml.date)}
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
        </article>
        <Comment />
        <Footer count={pageView} />
      </Container>
    </Layout>
  );
}
