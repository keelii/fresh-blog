import {startApp} from "./main.tsx"
import {checkDatabase, startTask, stopTask} from "./couch_db.ts"
import {cachePosts, cacheRSS} from "./cache.ts"

try {
  await checkDatabase()
  await cachePosts()
  await cacheRSS()

  startApp();
  // startTask();
} catch (e) {
  // stopTask()
  console.error(e)
}
