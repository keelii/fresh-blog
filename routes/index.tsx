/** @jsx h */
import { h } from "preact";
import {
  getPosts,
  MetaInfo,
  parseYamlFile,
  toDisplayDate,
} from "../utils/util.ts";
import { Container } from "../component/Container.tsx";
import { Layout } from "../component/Layout.tsx";
import { CONTENT_DIR, POST_DIR } from "../main.ts";
import { Handlers, PageProps } from "$fresh/src/server/types.ts";
import { join } from "https://deno.land/std/path/mod.ts";

export const handler: Handlers<MetaInfo[] | null> = {
  async GET(_, ctx) {
    const posts = await getPosts(POST_DIR);
    return ctx.render(posts);
  },
};

export default function Home(props: PageProps<MetaInfo[]>) {
  const posts = props.data;

  return (
    <Layout title={"臨池不輟"}>
      <Container>
        <header className={"wysiwyg"}>
          <h1>臨池不輟</h1>
          <a href="/about" className="meta">关于我</a>
        </header>
        <div className={"wysiwyg"}>
          {/*<h2>文章</h2>*/}
          <ul className="posts">
            {posts.map((a) => (
              <li>
                <a href={a.url}>{a.title}</a>
              </li>
            ))}
          </ul>
          <hr />
        </div>
      </Container>
    </Layout>
  );
}
