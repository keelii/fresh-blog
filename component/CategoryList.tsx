import { Layout } from "./Layout.tsx";
import { BLOG_TITLE } from "../config.ts";
import { Container } from "./Container.tsx";
import { Footer } from "./Footer.tsx";

export function CategoryList(props: { items: Array<{ name: string, count: number }> }) {
  const { items } = props;

  return (
    <Layout title={BLOG_TITLE}>
      <Container>
        <header className={"wysiwyg"}>
          <h1>分类列表</h1>
          <a href="/">首页</a>
        </header>
        <div className={"wysiwyg"}>
          <ul className="category-list">
            {items.map(({name, count}) => (
              <li key={name}>
                <a class="cate-title" href={`/categories/${name}`}>{name}</a> ({count})
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
