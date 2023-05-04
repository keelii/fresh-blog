import { Feed, Item } from "https://esm.sh/feed@4.2.2";
import { Handlers } from "$fresh/src/server/types.ts";
import { cfg } from "../main.ts";
import { getCachedPosts } from "../utils/post.ts";
import { countPageView } from "./helpers.ts";

export const handler: Handlers = {
  async GET(req: Request, ctx) {
    const { name } = ctx.params;
    const pageView = await countPageView(req);

    if (name === "atom.xml") {
      return await generateRSS();
    } else {
      return new Response(`[/${name}] Not found.`, {
        status: 404,
        headers: { "content-type": "text/plain" },
      });
    }
  },
};

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
      atom: `${cfg.getConfig("url")}/${cfg.getConfig("rss")}`,
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

  const atomFeed = feed.atom1();
  return new Response(atomFeed, {
    headers: {
      "content-type": "text/xml",
    },
  });
}
