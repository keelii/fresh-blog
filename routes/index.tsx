/** @jsx h */
import { h } from "preact";
import { join, basename } from "https://deno.land/std/path/mod.ts";
import {walkSync} from "https://deno.land/std/fs/mod.ts"
import {parse} from "https://deno.land/std/encoding/toml.ts";
import { getTomlString } from "../utils/main.ts";
import {Container} from "../component/Container.tsx"


interface TomlInfo {
  title: string
  url: string
  categories: string[]
  tags: string[]
  date: Date
}

const dir = join(Deno.cwd(), "archives")

function getArticles(dir: string) {
  const items = walkSync(dir)
  const articles: TomlInfo[] = []

  for (const item of items) {
    if (item.isFile) {
      const contents = Deno.readTextFileSync(item.path)
      const [tomlString, mdString] = getTomlString(contents)
      try {
        const toml = parse(tomlString) as any
        const date = new Date(Date.parse(toml.date))
        const datePrefix = new Intl.DateTimeFormat('zh-Hans-CN', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit'
        }).format(date)
        const name = basename(item.name, ".md")
        const url = `/${datePrefix}/${name}`

        articles.push({
          title: toml.title,
          url, date,
          categories: toml.categories,
          tags: toml.tags,
        })
      } catch (error) {
        console.log("error: ", item.path, "\n", tomlString)
        break;
      }
    }
  }

  // @ts-ignore:
  return articles.sort((a, b) => b.date - a.date)
}

const articles = getArticles(dir)


export default function Home() {
  return (
    <Container>
      <div class={"wysiwyg"}>
        <h2>文章</h2>
        <ul>
          {articles.map(a => (
            <li><a href={a.url}>{a.title}</a></li>
          ))}
        </ul>
      </div>
    </Container>
  );
}
