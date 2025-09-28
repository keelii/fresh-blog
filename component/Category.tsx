import { MetaInfo } from "../utils/post.ts";
import { Layout } from "./Layout.tsx";
import { BLOG_TITLE } from "../config.ts";
import { Container } from "./Container.tsx";
import { Footer } from "./Footer.tsx";

export function Category(props: { name: string; posts: MetaInfo[] }) {
  const { name, posts } = props;

  return (
    <Layout title={BLOG_TITLE}>
      <Container>
        <header className={"wysiwyg"}>
          <h1>分类 {name}</h1>
          <a href="/">首页</a>
        </header>
        <div className={"wysiwyg"}>
          <ul className="posts">
            {posts.map((a) => (
              <li class="cate-item" key={a.url}>
                <a class="cate-title" href={a.url}>{a.title}</a>
                {a.categories && a.categories.length > 0 && (
                  <span class="categories">
                    {a.categories.map((c, idx) => (
                      idx === 0 ? (
                        <a href={`/categories/${c}`}>{c}</a>
                      ) : (
                        <><em>|</em> <a href={`/categories/${c}`}>{c}</a></>
                      )
                    ))}
                  </span>
                )}
              </li>
            ))}
          </ul>
          <hr style={{ marginTop: 40 }} />
        </div>
        <Footer />
      </Container>
    </Layout>
  );
}
