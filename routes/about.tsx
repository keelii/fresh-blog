/** @jsx h */
import { h } from "preact";
import { PageProps } from "$fresh/server.ts";
import { CONTENT_DIR } from "../main.ts";
import { render } from "https://deno.land/x/gfm@0.1.20/mod.ts";
import { Layout } from "../component/Layout.tsx";
import { Container } from "../component/Container.tsx";
import { Comment } from "../component/Comment.tsx";
import { parseToml, toDisplayDate } from "../utils/util.ts";
import { join } from "https://deno.land/std/path/mod.ts";

export default function About(props: PageProps) {
  const file = join(CONTENT_DIR, "about.md");
  const { content, ...toml } = parseToml(file);
  const html = render(content);

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
        </article>
        <Comment />
      </Container>
    </Layout>
  );
}
