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
          <footer id="footer">
            <p style={{ color: "#999", fontSize: 12, display: "flex", alignItems: "center" }}>
              Copyright &copy; {new Date().getFullYear()} keelii, Powered by
              <a style={{margin: "0 0.5em"}} href="https://deno.com/deploy" target="_blank">Deno Deploy</a>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="14" height="14">
                <path fill="none" d="M0 0h24v24H0z"/>
                <path d="M3 3c9.941 0 18 8.059 18 18h-3c0-8.284-6.716-15-15-15V3zm0 7c6.075 0 11 4.925 11 11h-3a8 8 0 0 0-8-8v-3zm0 7a4 4 0 0 1 4 4H3v-4z"/>
              </svg>
              <a href={`${BLOG_CONFIG.url}/${BLOG_CONFIG.rss}`}>RSS</a>
            </p>
          </footer>
        </div>
      </Container>
    </Layout>
  );
}
