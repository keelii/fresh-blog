import { Feed, Item } from "https://esm.sh/feed@4.2.2";
import {getCachedPosts, MetaInfo, parseCachedYamlFile} from "./utils/post.ts";
import {Layout} from "./component/Layout.tsx";
import {Container} from "./component/Container.tsx";
import {toDisplayDate} from "./utils/util.ts";
import {Comment} from "./component/Comment.tsx";
import {Footer} from "./component/Footer.tsx";
import { Fragment, h } from "npm:preact";
import { render } from 'npm:preact-render-to-string';
import {cfg} from "./main.ts";
import {join} from "./deps.ts";

function Home(props: {posts: MetaInfo[]}) {
  const { posts } = props;

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
  const copyright = `Copyright ${new Date().getFullYear()} ${cfg.getConfig("url")}`;
  const feed = new Feed({
    title: cfg.getConfig("title"),
    description: cfg.getConfig("description"),
    id: cfg.getConfig("url"),
    link: cfg.getConfig("url"),
    language: "zh_CN",
    favicon: `${cfg.getConfig("url")}/favicon.ico`,
    copyright: copyright,
    generator: "Feed (https://github.com/jpmonette/feed) for Deno",
    feedLinks: {
      atom: `${cfg.getConfig("url")}${cfg.getConfig("rss")}`,
    },
  });

  const posts = await getCachedPosts(cfg.getEnv("POST_DIR"), true);
  for (const post of posts) {
    const item: Item = {
      id: cfg.getConfig("url") + post.url,
      link: cfg.getConfig("url") + post.url,
      title: post.title,
      description: post.content,
      date: post.date,
      author: [{ name: cfg.getConfig("author") }],
      copyright,
      published: post.date,
    };
    feed.addItem(item);
  }

  return feed.atom1();
}


export async function TsxRender(pathname: string): Promise<Response> {
  if (pathname === cfg.getConfig("rss")) {
    const feed = await generateRSS();
    return Promise.resolve(new Response(feed, {
      headers: {
        "content-type": "text/xml",
      }
    }))
  }

  let html = `<!DOCTYPE html>
    <html lang="en">{__HTML__}</html>`

  if (pathname === "" || pathname === "/") {
    const posts = await getCachedPosts(cfg.getEnv("POST_DIR"));
    html = html.replace("{__HTML__}", render(<Home posts={posts} />))
  } else {
    const file = join(cfg.getEnv("POST_DIR"), pathname + ".md");
    try {
      await Deno.stat(file)
    } catch (e: any) {
      if (e instanceof Deno.errors.NotFound) {
        return new Response("not found", { status: 404, });
      }
    }

    const result = await parseCachedYamlFile(file, true);
    html = html.replace("{__HTML__}", render(<ArticleDetail {...result} />))
  }

  return Promise.resolve(new Response(html, {
    headers: {
      "content-type": "text/html",
    }
  }));
  //
  // return new Response("not found", {
  //   status: 404,
  // });
}