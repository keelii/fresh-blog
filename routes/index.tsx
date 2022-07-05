/** @jsx h */
import { h } from "preact";
import { getPosts } from "../utils/util.ts";
import { Container } from "../component/Container.tsx";
import { Layout } from "../component/Layout.tsx";
import { POST_DIR } from "../main.ts";

export default function Home() {
  const posts = getPosts(POST_DIR);

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
        </div>
      </Container>
    </Layout>
  );
}
