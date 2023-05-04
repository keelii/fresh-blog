import { Handlers, PageProps } from "$fresh/src/server/types.ts";
import { Container } from "../component/Container.tsx";
import { Footer } from "../component/Footer.tsx";
import { Layout } from "../component/Layout.tsx";
import { cfg } from "../main.ts";
import { getCachedPosts, MetaInfo } from "../utils/post.ts";
import { countPageView } from "./helpers.ts";

export const handler: Handlers<{ posts: MetaInfo[]; pageView: number } | null> = {
  async GET(req: Request, ctx) {
    const posts = await getCachedPosts(cfg.getEnv("POST_DIR"));
    const pageView = await countPageView(req);
    return ctx.render({ posts, pageView });
  },
};

export default function Home(props: PageProps<MetaInfo[]>) {
  const { posts, pageView } = props.data;

  return (
    <Layout title={cfg.getConfig("title")}>
      <Container>
        <header className={"wysiwyg"}>
          <h1>{cfg.getConfig("title")}</h1>
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
          <hr style={{ marginTop: 40 }} />
        </div>
        <Footer count={pageView} />
      </Container>
    </Layout>
  );
}
