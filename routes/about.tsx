/** @jsx h */
import { h } from "preact";
import { Handlers, PageProps } from "$fresh/server.ts";
import { render } from "https://deno.land/x/gfm@0.1.20/mod.ts";
import { Layout } from "../component/Layout.tsx";
import { Container } from "../component/Container.tsx";
import { Comment } from "../component/Comment.tsx";
import { MetaInfo, parseCachedYamlFile, toDisplayDate } from "../utils/util.ts";
import { join } from "https://deno.land/std/path/mod.ts";
import { CONTENT_DIR } from "../config.ts";

export const handler: Handlers<MetaInfo | null> = {
  async GET(_, ctx) {
    const file = join(CONTENT_DIR, "about.md");
    const result = await parseCachedYamlFile(file, true);
    return ctx.render(result);
  },
};

export default function About(props: PageProps<MetaInfo>) {
  const { content, ...toml } = props.data;
  const html = render(content);

  return (
    <Layout title={toml.title} canonical="/about">
      <Container>
        <header className={"wysiwyg"}>
          <h1>{toml.title}</h1>
          <span className="meta">
            {toDisplayDate(toml.date)}
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
        </article>
        <Comment />
      </Container>
    </Layout>
  );
}
