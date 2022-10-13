import { Handlers, PageProps } from "$fresh/src/server/types.ts";
import { Container } from "../component/Container.tsx";
import { Layout } from "../component/Layout.tsx";
import { cfg } from "../main.ts";
import { getCachedPosts, MetaInfo } from "../utils/post.ts";

export const handler: Handlers<MetaInfo[] | null> = {
  async GET(_, ctx) {
    const posts = await getCachedPosts(cfg.getEnv("POST_DIR"));
    return ctx.render(posts);
  },
};

export default function Home(props: PageProps<MetaInfo[]>) {
  const posts = props.data;

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
        <footer>
          <p>
            Copyright &copy; {new Date().getFullYear()} keelii, Powered by
            <a href="https://deno.com/deploy" target="_blank">Deno</a>
            |
            <a href={`${cfg.getConfig("url")}/${cfg.getConfig("rss")}`}>
              <abbr title="RDF Site Summary">RSS</abbr>
            </a>
          </p>
        </footer>
      </Container>
    </Layout>
  );
}
