import {startApp} from "./main.tsx"
import {checkDatabase, startTask, stopTask} from "./couch_db.ts"

startApp();

try {
  await checkDatabase()
  startTask()
} catch (e) {
  stopTask()
  console.error(e)
}
