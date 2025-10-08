import {decryptString} from "./encrypt.ts"

export let POST_CACHE = new Map<string, string>()

export async function fetchRemote() {
  const BLOG_API_URI = Deno.env.get("BLOG_API_URI")
  if (!BLOG_API_URI) {
    throw new Error("BLOG_API_URI is missing")
  }

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
      POST_CACHE.set(post.path, post.content)
    }
    console.log("Fetched posts:", POST_CACHE.size)
  } catch (e) {
    console.error(e)
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
