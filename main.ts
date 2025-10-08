import {startApp} from "./main.tsx"
import {checkDatabase, startTask, stopTask} from "./couch_db.ts"
import {fetchRemote} from "./cache.ts"

try {
  await checkDatabase()
  await fetchRemote()

  startApp();
  startTask();
} catch (e) {
  stopTask()
  console.error(e)
}
