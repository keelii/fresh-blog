import {startApp} from "./main.tsx"
import {checkDatabase, startTask, stopTask} from "./couch_db.ts"
import {fetchRemote} from "./cache.ts"
import {getCachedPosts} from "./utils/post.ts"

try {
  await checkDatabase()
  await fetchRemote()
  await getCachedPosts(true)

  startApp();
  // startTask();
} catch (e) {
  // stopTask()
  console.error(e)
}
