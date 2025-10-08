import {startApp} from "./main.tsx"
import {checkDatabase, startTask, stopTask} from "./couch_db.ts"
import {decryptString} from "./encrypt.ts"
import { ensureFile } from "jsr:@std/fs"
import { join } from "jsr:@std/path"
import writeTextFile = Deno.writeTextFile

async function fetchRemote() {
  const BLOG_API_URI = Deno.env.get("BLOG_API_URI")
  if (!BLOG_API_URI) {
    throw new Error("BLOG_API_URI is missing")
  }
  const res = await fetch(BLOG_API_URI)
  const json = await res.json()
  const raw = await decryptString(json.iv, json.ciphertext)

  const posts = JSON.parse(raw)
  for (let post of posts) {
    if (!post.path) {
      console.warn("No path:", post)
      continue
    }
    try {
      const file = join("./blog/", post.path)
      await ensureFile(file)
      await writeTextFile(file, post.content)
      console.log("write:", file)
    } catch (e) {
      console.error(post.path, e)
    }
  }
}

try {
  await checkDatabase()
  await fetchRemote()

  startApp();
  startTask();
} catch (e) {
  stopTask()
  console.error(e)
}
