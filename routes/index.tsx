/** @jsx h */
import { h } from "preact";
import { walkSync } from "https://deno.land/std/fs/mod.ts";
import {getPosts, parseToml, TomlInfo} from "../utils/util.ts"
import { Container } from "../component/Container.tsx";
import { Layout } from "../component/Layout.tsx";
import { POST_DIR } from "../main.ts";



export default function Home() {
  const posts = getPosts(POST_DIR);

  return (
    <Layout title={"臨池不輟"}>
      <Container>
        <div class={"wysiwyg"}>
          <h2>文章</h2>
          <ul>
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
