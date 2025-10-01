import { MetaInfo } from "../utils/post.ts";
import { Layout } from "./Layout.tsx";
import { BLOG_TITLE } from "../config.ts";
import { Container } from "./Container.tsx";
import { Footer } from "./Footer.tsx";
import {CategoryItems} from "./CategoryItems.tsx";

export function Category(props: { name: string; posts: MetaInfo[] }) {
  const { name, posts } = props;

  return (
    <Layout title={BLOG_TITLE}>
      <Container>
        <header className={"wysiwyg"}>
          <h1>分类 {name}</h1>
          <a href="/">首页</a> | <a href="/categories/">所有分类</a>
        </header>
        <div className={"wysiwyg"}>
          <ul className="posts">
            {posts.map((a) => (
              <li class="cate-item" key={a.url}>
                <a class="cate-title" href={a.url}>{a.title}</a>
                <CategoryItems post={a} />
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
