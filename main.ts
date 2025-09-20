import {startApp} from "./main.tsx"
import {checkDatabase, initTask} from "./couch_db.ts"

startApp();

try {
  await checkDatabase()
  initTask();
} catch (e) {
  console.error(e)
}
