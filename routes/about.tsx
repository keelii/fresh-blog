/** @jsx h */
import { h } from "preact";
import { PageProps } from "$fresh/server.ts";
import { CONTENT_DIR } from "../main.ts";
import { render } from "https://deno.land/x/gfm@0.1.20/mod.ts";
import { Layout } from "../component/Layout.tsx";
import { Container } from "../component/Container.tsx";
import { Comment } from "../component/Comment.tsx";
import { parseYamlFile, toDisplayDate } from "../utils/util.ts";
import { join } from "https://deno.land/std/path/mod.ts";

export default function About(props: PageProps) {
  const file = join(CONTENT_DIR, "about.md");
  const result = parseYamlFile(file);
  if (!result) return <div>Not Found.</div>

  const { content, ...toml } = result;
  const html = render(content);

  return (
    <Layout title={toml.title}>
      <Container>
        <header className={"wysiwyg"}>
          <h1>{toml.title}</h1>
          <span className="meta">
            {toDisplayDate(toml.date)}{"\u3000"}<a href="/">首页</a>
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
