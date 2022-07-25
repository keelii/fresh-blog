/** @jsx h */
import { h } from "preact";
import { Handlers, PageProps } from "$fresh/server.ts";
import { Layout } from "../component/Layout.tsx";
import { Container } from "../component/Container.tsx";
import { Comment } from "../component/Comment.tsx";
import { MetaInfo, parseCachedYamlFile, toDisplayDate } from "../utils/util.ts";
import { CONTENT_DIR } from "../config/config.ts";
import { join } from "../deps.ts";

export const handler: Handlers<MetaInfo | null> = {
  async GET(_, ctx) {
    const file = join(CONTENT_DIR, "about.md");
    const result = await parseCachedYamlFile(file, true);
    return ctx.render(result);
  },
};

export default function About(props: PageProps<MetaInfo>) {
  const { content, ...toml } = props.data;

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
      </Container>
    </Layout>
  );
}
