import {startApp} from "./main.tsx"
import {checkDatabase, startTask, stopTask} from "./couch_db.ts"
import {cacheRSS, fetchRemote} from "./cache.ts"

try {
  await checkDatabase()
  await fetchRemote()
  await cacheRSS()

  startApp();
  // startTask();
} catch (e) {
  // stopTask()
  console.error(e)
}
