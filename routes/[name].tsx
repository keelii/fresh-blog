/** @jsx h */
import { Fragment, h } from "preact";
import { Feed, Item } from "https://esm.sh/feed@4.2.2";
import { Handlers, PageProps } from "$fresh/src/server/types.ts";
import { getCachedPosts, MetaInfo } from "../utils/util.ts";
import { BLOG_CONFIG, POST_DIR } from "../config.ts";

export const handler: Handlers<MetaInfo | null> = {
  async GET(_, ctx) {
    const { name } = ctx.params;

    if (name === "atom.xml") {
      return await generateRSS();
    } else {
      return ctx.render(name);
    }
  },
};

async function generateRSS() {
  const copyright = `Copyright ${new Date().getFullYear()} ${BLOG_CONFIG.url}`;
  const feed = new Feed({
    title: BLOG_CONFIG.title,
    description: BLOG_CONFIG.description,
    id: BLOG_CONFIG.url,
    link: BLOG_CONFIG.url,
    language: "zh_CN",
    favicon: `${BLOG_CONFIG.url}/favicon.ico`,
    copyright: copyright,
    generator: "Feed (https://github.com/jpmonette/feed) for Deno",
    feedLinks: {
      atom: `${BLOG_CONFIG}/${BLOG_CONFIG.rss}`,
    },
  });

  const posts = await getCachedPosts(POST_DIR);
  for (const post of posts) {
    const item: Item = {
      id: BLOG_CONFIG.url + post.url,
      link: BLOG_CONFIG.url + post.url,
      title: post.title,
      description: "",
      date: post.date,
      author: [{ name: BLOG_CONFIG.author }],
      // image: post.ogImage,
      copyright,
      published: post.date,
    };
    feed.addItem(item);
  }

  const atomFeed = feed.atom1();
  return new Response(atomFeed, {
    headers: {
      "content-type": "text/xml",
    },
  });
}

export default function NotFound(props: PageProps<string>) {
  return <center style={{ padding: 20 }}>[{props.data}] Not found.</center>;
}
