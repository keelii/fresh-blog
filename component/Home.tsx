import { MetaInfo } from "../utils/post.ts";
import { Layout } from "./Layout.tsx";
import { BLOG_TITLE } from "../config.ts";
import { Container } from "./Container.tsx";
import { Footer } from "./Footer.tsx";

export function Home(props: { pv: Deno.KvEntry<number> | null; posts: MetaInfo[] }) {
  const { posts } = props;

  return (
    <Layout title={BLOG_TITLE}>
      <Container>
        <header className={"wysiwyg"}>
          <h1>{BLOG_TITLE}</h1>
          <a href="/about" className="meta">关于我</a>
        </header>
        <div className={"wysiwyg"}>
          {/*<h2>文章</h2>*/}
          <ul className="posts">
            {posts.map((a) => (
              <li key={a.url}>
                <a href={a.url}>{a.title}</a>
              </li>
            ))}
          </ul>
          <hr style={{ marginTop: 40 }} />
        </div>
        <Footer pv={props.pv} />
      </Container>
    </Layout>
  );
}
