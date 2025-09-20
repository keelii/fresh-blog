import { format } from "jsr:@std/datetime"
import {COUCHDB_AUTH, COUCHDB_URL} from "./config.ts"

export interface UVItem {
  uid: string
  clientIp: string
  userAgent: string
  referer: string
  createdAt: number
}

const AUTH = btoa(COUCHDB_AUTH);
const items: UVItem[] = []

export async function checkDatabase() {
  const cost = Date.now()
  const res = await fetch(COUCHDB_URL, {
    method: "PUT",
    headers: {
      "Authorization": `Basic ${AUTH}`,
    },
  });
  const json = await res.json()
  if (json.error === "file_exists") {
    console.log(`Database connecting OK in ${Date.now() - cost}ms`)
  } else {
    console.warn(`Database connecting Fail [${Date.now() - cost}ms]:`, json)
  }
}
export function showTasks() {
  return items.map(i => {
    return {
      ...i,
      createdAt: format(new Date(i.createdAt), "yyyy-MM-dd HH:mm:ss.SSS", {timeZone: "UTC"})
    }
  })
}
export function initTask() {
  if (!Deno.cron) {
    console.log("cron is not supported")
    return
  }

  // Deno.cron("schedule insert tasks", "*/10 * * * *", async () => {
  Deno.cron("schedule insert tasks", "* * * * *", async () => {
    if (items.length === 0) {
      console.log("No tasks to process")
    } else {
      console.log("=Task started")

      while (true) {
        const task = items.pop();
        if (!task) {
          console.log("-Task empty")
          break;
        }

        try {
          console.log("-Pick item:", task.uid)
          await insertDoc(task)
          console.log("-Inserted item:", JSON.stringify(task))
        } catch (e) {
          console.error(e)
        }
      }

      console.log("=Task end")
    }
  });
}

export function enqueue(item: Record<string, unknown>) {
  const ret = items.push(item)
  if (ret) {
    console.log("Enqueued item:", JSON.stringify(item))
  }
}

async function insertDoc(doc: Record<string, unknown>) {
  const res = await fetch(COUCHDB_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Basic ${AUTH}`,
    },
    body: JSON.stringify(doc),
  });

  const data = await res.json();
  if (data.ok) {
    console.log("Insert result:", data.id);
  } else {
    console.error(data)
  }
}
