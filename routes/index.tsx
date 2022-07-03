/** @jsx h */
import { h } from "preact";
import { join } from "https://deno.land/std/path/mod.ts";
import { walkSync } from "https://deno.land/std/fs/mod.ts";
import { parseToml, TomlInfo } from "../utils/main.ts";
import { Container } from "../component/Container.tsx";
import { Layout } from "../component/Layout.tsx";

const dir = join(Deno.cwd(), "archives");

function getArticles(dir: string) {
  const items = walkSync(dir);
  const articles: TomlInfo[] = [];

  for (const item of items) {
    if (item.isFile) {
      const info = parseToml(item.path);
      info && articles.push(info);
    }
  }

  // @ts-ignore:
  return articles.sort((a, b) => b.date - a.date);
}

const articles = getArticles(dir);

export default function Home() {
  return (
    <Layout title={"臨池不輟"}>
      <Container>
        <div class={"wysiwyg"}>
          <h2>文章</h2>
          <ul>
            {articles.map((a) => (
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
