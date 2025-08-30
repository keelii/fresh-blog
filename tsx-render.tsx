import {Fragment} from "react"
import {Feed, Item} from "https://esm.sh/feed@4.2.2"
import {getCachedPosts, MetaInfo, parseCachedYamlFile} from "./utils/post.ts"
import {Layout} from "./component/Layout.tsx"
import {Container} from "./component/Container.tsx"
import {toDisplayDate} from "./utils/util.ts"
import {Comment} from "./component/Comment.tsx"
import {Footer} from "./component/Footer.tsx"
import {renderToString} from "react-dom/server"
import {join} from "jsr:@std/path"

import {
  APP_DISALLOW_SE,
  BLOG_AUTHOR,
  BLOG_DESCRIPTION,
  BLOG_DIR,
  BLOG_RSS,
  BLOG_TITLE,
  BLOG_URL
} from "./config.ts"
import {HtmlResponse, NotFound, ServerError, XmlResponse} from "./utils/response.ts"
import {Count} from "./types.ts"
import {setPV, setUV, writeRobotsHeader, writeUUID} from "./pvuv.ts"
import {getAll} from "./kv.ts"
import {KVTable} from "./component/KVTable.tsx"

function Home(props: {count: Count, posts: MetaInfo[]}) {
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
        <Footer count={props.count} />
      </Container>
    </Layout>
  );
}
function ArticleDetail(props: MetaInfo & { count: Count }) {
  const { content, count, ...yaml } = props;

  const initMath = `
    window.MathJax = {
    options: {},
    tex: {
      inlineMath: [ ['$','$'] ],
      displayMath: [ ['$$','$$'] ],
      processEscapes: false
    }
    }
  `;

  return (
    <Layout title={yaml.title} canonical={yaml.url}>
      <Container>
        <header className={"wysiwyg"}>
          <h1>{yaml.title}</h1>
          <span className="meta">
            {toDisplayDate(yaml.date)}
            <a style={{ marginLeft: 5 }} href="/">首页</a> | <span>看过({count.uv.value.length})</span>
          </span>
        </header>
        <article className={"wysiwyg"}>
          <div
            className="markdown-body"
            data-light-theme="light"
            dangerouslySetInnerHTML={{ __html: content }}
          >
          </div>
          {yaml.math && (
            <Fragment>
              <script dangerouslySetInnerHTML={{ __html: initMath }} />
              <script
                id="MathJax-script"
                src="//unpkg.com/mathjax@3.2.2/es5/tex-chtml.js"
                async
              />
            </Fragment>
          )}
        </article>
        <div className="eof" />
        <Comment />
        <Footer count={count} />
      </Container>
    </Layout>
  );
}
async function generateRSS() {
  const copyright = `Copyright ${new Date().getFullYear()} ${BLOG_URL}`;
  const feed = new Feed({
    title: BLOG_TITLE,
    description: BLOG_DESCRIPTION,
    id: BLOG_URL,
    link: BLOG_URL,
    language: "zh_CN",
    favicon: `${BLOG_URL}/favicon.ico`,
    copyright: copyright,
    generator: "Feed (https://github.com/jpmonette/feed) for Deno",
    feedLinks: {
      atom: `${BLOG_URL}${BLOG_RSS}`,
    },
  });

  const posts = await getCachedPosts(true);
  for (const post of posts) {
    const item: Item = {
      id: BLOG_URL + post.url,
      link: BLOG_URL + post.url,
      title: post.title,
      description: post.content,
      date: post.date,
      author: [{ name: BLOG_AUTHOR }],
      copyright,
      published: post.date,
    };
    feed.addItem(item);
  }

  return feed.atom1();
}


export async function TsxRender(pathname: string, _req: Request): Promise<Response> {

  const originPathname = pathname
  if (pathname.endsWith("/")) {
    pathname = pathname.slice(0, pathname.length - 1);
  }
  if (pathname === BLOG_RSS) {
    const feed = await generateRSS();
    return XmlResponse(feed)
  }
  if (pathname === "/kv") {
    const kv = await getAll()
    return HtmlResponse(renderToString(<KVTable title="KV" kv={kv} />), {
      "X-Robots-Tag": "noindex, nofollow, noarchive, nosnippet, noimageindex"
    })
  }

  const uuid = crypto.randomUUID()

  const headers = new Headers();
  writeRobotsHeader(headers)

  const uid = await writeUUID(_req, headers, uuid)


  let html = `<!DOCTYPE html><html lang="en">`

  if (pathname === "" || pathname === "/") {
    const posts = await getCachedPosts();
    const pvValue = await setPV(originPathname)
    const uvValue = await setUV(originPathname, uid)

    html += renderToString(<Home count={{pv: pvValue, uv: uvValue}} posts={posts} />)
  } else {
    const file = join(BLOG_DIR, pathname + ".md");
    try {
      await Deno.stat(file)
    } catch (e: any) {
      if (e instanceof Deno.errors.NotFound) {
        return NotFound()
      }
      return ServerError()
    }

    const pvValue = await setPV(originPathname)
    const uvValue = await setUV(originPathname, uid)

    const result = await parseCachedYamlFile(file, true);
    html += renderToString(<ArticleDetail count={{pv: pvValue, uv: uvValue}} {...result} />)
  }

  html += `</html>`


  return HtmlResponse(html, headers);
}
