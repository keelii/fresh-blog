/** @jsx h */
import { h } from "preact";
import { getCachedPosts, MetaInfo } from "../utils/util.ts";
import { Container } from "../component/Container.tsx";
import { Layout } from "../component/Layout.tsx";
import { Handlers, PageProps } from "$fresh/src/server/types.ts";
import {BLOG_CONFIG, POST_DIR} from "../config.ts"

export const handler: Handlers<MetaInfo[] | null> = {
  async GET(_, ctx) {
    const posts = await getCachedPosts(POST_DIR);
    return ctx.render(posts);
  },
};

export default function Home(props: PageProps<MetaInfo[]>) {
  const posts = props.data;

  return (
    <Layout title={BLOG_CONFIG.title}>
      <Container>
        <header className={"wysiwyg"}>
          <h1>{BLOG_CONFIG.title}</h1>
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
