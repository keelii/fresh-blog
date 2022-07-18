/** @jsx h */
import { h } from "preact";
import { Feed, Item } from "https://esm.sh/feed@4.2.2";
import { Handlers, PageProps } from "$fresh/src/server/types.ts";
import { getCachedPosts, MetaInfo } from "../utils/util.ts";
import { BLOG_CONFIG, POST_DIR } from "../config.ts";

const anchorSVG =
  '<svg class="octicon octicon-link" viewbox="0 0 16 16" width="16" height="16" aria-hidden="true"><path fill-rule="evenodd" d="M7.775 3.275a.75.75 0 001.06 1.06l1.25-1.25a2 2 0 112.83 2.83l-2.5 2.5a2 2 0 01-2.83 0 .75.75 0 00-1.06 1.06 3.5 3.5 0 004.95 0l2.5-2.5a3.5 3.5 0 00-4.95-4.95l-1.25 1.25zm-4.69 9.64a2 2 0 010-2.83l2.5-2.5a2 2 0 012.83 0 .75.75 0 001.06-1.06 3.5 3.5 0 00-4.95 0l-2.5 2.5a3.5 3.5 0 004.95 4.95l1.25-1.25a.75.75 0 00-1.06-1.06l-1.25 1.25a2 2 0 01-2.83 0z"></path></svg>';

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

  const posts = await getCachedPosts(POST_DIR, true);
  for (const post of posts) {
    const item: Item = {
      id: BLOG_CONFIG.url + post.url,
      link: BLOG_CONFIG.url + post.url,
      title: post.title,
      description: post.content
        .replaceAll(anchorSVG, "")
        .replace(/<a class="anchor" aria-hidden="true" tabindex="-1" href="[^"]+"><\/a>/g, ""),
      date: post.date,
      author: [{ name: BLOG_CONFIG.author }],
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
