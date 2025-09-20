import {startApp} from "./main.tsx"
import {checkDatabase} from "./couch_db.ts"

try {
  await checkDatabase()
} catch (e) {
  console.error(e)
}

startApp();


