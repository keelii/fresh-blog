import {Feed, Item} from "https://esm.sh/feed@4.2.2"
import { BLOG_AUTHOR, BLOG_DESCRIPTION, BLOG_RSS, BLOG_TITLE, BLOG_URL } from "../config.ts";
import { getCachedPosts } from "./post.ts";

export async function generateRSS() {
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

  const ret = await getCachedPosts(true);
  for (const post of ret.posts) {
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
