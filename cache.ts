import {decryptString} from "./encrypt.ts"
import {generateRSS} from "./utils/rss.ts"

export let POST_CACHE = new Map<string, string>()
export let RSS_CONTENT = null

async function fetchRemote() {
  const BLOG_API_URI = Deno.env.get("BLOG_API_URI")
  if (!BLOG_API_URI) {
    throw new Error("BLOG_API_URI is missing")
  }

  const cachePost = new Map<string, string>()

  try {
    const res = await fetch(BLOG_API_URI)
    const json = await res.json()
    const raw = await decryptString(json.iv, json.ciphertext)

    const posts = JSON.parse(raw)
    for (let post of posts) {
      if (!post.path) {
        console.warn("No path:", post)
        continue
      }
      cachePost.set(post.path, post.content)
    }
    console.log("Fetched remote posts:", cachePost.size)
    return cachePost;
  } catch (e) {
    console.error(e)
    return POST_CACHE
  }
}

export async function cacheRSS() {
  if (!RSS_CONTENT) {
    RSS_CONTENT = await generateRSS()
  }
}
export async function cachePosts() {
  if (POST_CACHE.size === 0) {
    POST_CACHE = await fetchRemote()
  }
}

export async function refreshCache() {
  try {
    RSS_CONTENT = await generateRSS()
    POST_CACHE = await fetchRemote()
    const result = {
      posts: POST_CACHE.size,
      rss: RSS_CONTENT.length
    }
    console.log("Cache refreshed:", result)
    return result
  } catch (e) {
    console.error("refresh error", e)
    return {
      error: e.message
    }
  }
}

// try {
//   const file = join("./blog/", post.path)
//   await ensureFile(file)
//   await writeTextFile(file, post.content)
//   console.log("write:", file)
// } catch (e) {
//   console.error(post.path, e)
// }
