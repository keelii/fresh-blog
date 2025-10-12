import {decryptString} from "./encrypt.ts"
import {generateRSS} from "./utils/rss.ts"

export let POST_CACHE = new Map<string, string>()
export let RSS_CONTENT = null

export async function fetchDecrypted(api: string) {
  const ret = await fetch(api)
  const json = await ret.json()
  const raw = await decryptString(json.iv, json.ciphertext)
  return JSON.parse(raw)
}

async function fetchRemote() {
  const BLOG_API_URI = Deno.env.get("BLOG_API_URI")
  if (!BLOG_API_URI) {
    throw new Error("BLOG_API_URI is missing")
  }

  const cachePost = new Map<string, string>()

  try {
    const posts = await fetchDecrypted(BLOG_API_URI + "/posts")
    console.log(`prepare to fetch ${posts.length} posts`)
    for (let post of posts) {
      if (!post.path) {
        console.warn("No path:", post)
        continue
      }

      const id = encodeURIComponent(post._id)
      const item = await fetchDecrypted(BLOG_API_URI + "/posts/" + id)
      console.debug(`fetchDecrypted:`, post._id, item.content.length)

      cachePost.set(item.path, item.content)
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
    POST_CACHE = await fetchRemote()
    RSS_CONTENT = await generateRSS()
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
