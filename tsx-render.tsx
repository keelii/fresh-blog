import { Feed, Item } from "https://esm.sh/feed@4.2.2";
import {getCachedPosts, MetaInfo, parseCachedYamlFile} from "./utils/post.ts";
import {Layout} from "./component/Layout.tsx";
import {Container} from "./component/Container.tsx";
import {toDisplayDate} from "./utils/util.ts";
import {Comment} from "./component/Comment.tsx";
import {Footer} from "./component/Footer.tsx";
import { Fragment, h } from "npm:preact";
import { render } from 'npm:preact-render-to-string';
import {join} from "./deps.ts";
import {
  BLOG_AUTHOR,
  BLOG_DESCRIPTION,
  BLOG_RSS,
  BLOG_TITLE,
  BLOG_URL, BLOG_DIR, APP_DISALLOW_SE
} from "./config.ts"
import {
  HtmlResponse,
  ServerError,
  NotFound,
  XmlResponse
} from "./utils/response.ts";

function Home(props: {posts: MetaInfo[]}) {
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
              <li>
                <a href={a.url}>{a.title}</a>
              </li>
            ))}
          </ul>
          <hr style={{ marginTop: 40 }} />
        </div>
        <Footer count={1} />
      </Container>
    </Layout>
  );
}
function ArticleDetail(props: MetaInfo) {
  const { content, ...yaml } = props;

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
            <a style={{ marginLeft: 5 }} href="/">首页</a>
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
        <Footer count={1} />
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


export async function TsxRender(pathname: string): Promise<Response> {
  if (pathname.endsWith("/")) {
    pathname = pathname.slice(0, pathname.length - 1);
  }
  if (pathname === BLOG_RSS) {
    const feed = await generateRSS();
    return XmlResponse(feed)
  }

  let html = `<!DOCTYPE html><html lang="en">`

  if (pathname === "" || pathname === "/") {
    const posts = await getCachedPosts();
    html += render(<Home posts={posts} />)
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

    const result = await parseCachedYamlFile(file, true);
    html += render(<ArticleDetail {...result} />)
  }

  // html += `<script>${MathJaxConfig}</script>`
  html += `</html>`
  // html = html.replace("window.MathJax", MathJaxConfig)

  let DisallowRobotHeader = {}

  if (APP_DISALLOW_SE) {
    DisallowRobotHeader["X-Robots-Tag"] = "noindex, nofollow, noarchive, nosnippet, noimageindex"
  }

  return HtmlResponse(html, DisallowRobotHeader);
}
