import {format} from "jsr:@std/datetime"
import {encryptString} from "./encrypt.ts"

const DB_URL = Deno.env.get("DB_URL");
const DB_AUTH = btoa(Deno.env.get("DB_AUTH"))
const port = Number(Deno.env.get("BLOG_API_PORT") || "3000");

if (!DB_URL || !DB_AUTH) {
  console.error("Missing DB_URL or DB_AUTH environment variable.");
  Deno.exit(1);
} else {
  const ok = await checkDatabase()
  if (!ok) {
    Deno.exit(1);
  }
}

type CouchDBQueryRecord<T = any> = {
  id: string,
  key: string,
  value: {
    rev: string
  },
  doc: T
}
type CouchDBQuerySuccess<T = any> = {
  total_rows: number
  offset: number
  rows: CouchDBQueryRecord<T>[]
}
type CouchDBQueryError = {
  error: string
  reason: string
}
type CouchDBQueryResult<T> = CouchDBQuerySuccess<T> | CouchDBQueryError

const headers = {
  "Authorization": `Basic ${DB_AUTH}`,
  "content-type": "application/json",
}
async function dbFetch<T = any>(u: string, init: RequestInit = {}): Promise<CouchDBQueryResult<T>> {
  const url = DB_URL + u
  const {headers = {}, method = "GET", ...rest} = init

  try {
    const resp = await fetch(url, {
      headers: Object.assign({
        "Authorization": `Basic ${DB_AUTH}`,
        "content-type": "application/json"
      }, headers)
      ,
      method,
      ...rest
    })
    return await resp.json()
  } catch (e) {
    console.error(e)
    return {
      error: "fetch_error",
      reason: e.message
    }
  }
}
export async function checkDatabase() {
  const cost = Date.now()
  const json = await dbFetch("", { method: "PUT" });
  if (json.error === "file_exists") {
    console.log(`Database connecting OK in ${Date.now() - cost}ms`)
  } else {
    console.error(`Database connecting Fail [${Date.now() - cost}ms]:`, json)
  }
  return json.error === "file_exists"
}

export async function createIndex() {
  const res = await dbFetch("_index", {
    method: "POST",
    body: JSON.stringify({
      "index": {
        "fields": ["doc.type"]
      },
      "name": "doc_type_index",
      "type": "json"
    })
  });
  if (res.result === "created") {
    console.log("Index created.", res)
  } else if (res.result === "exists") {
    console.log("Index exists.", "name=" + res.name, "id=" + res.id)
  } else {
    console.warn("Index create failed.", res)
  }
  return res
}
// await createIndex()

export async function queryDocuments() {
  const res = await dbFetch("_find", {
    method: "POST",
    body: JSON.stringify({
      selector: {
        "type": "plain"
      },
      "limit": 1024,
      // "limit": 10
    })
  });
  return res.docs || []
}
export async function queryById(id: string) {
  let result = {
    path: "",
    content: ""
  }
  try {
    const path = encodeURIComponent(id)
    const ret = await dbFetch(path + "?include_docs=false")

    result.path = ret.path

    if (ret.children) {
      const data = await queryByIds(ret.children)
      const content = data.rows.map(r => r.doc.data).join("")
      result.content = content
    } else {
      console.log("No docs found:", id, ret)
    }

    return result
  } catch (e) {
    console.error(e)
    return result
  }
}
export async function queryByIds(ids: string[]) {
  return await dbFetch("_all_docs?include_docs=true", {
    method: "POST",
    body: JSON.stringify({ keys: ids })
  })
}
export async function queryAll() {
  let results = []

  const docs = await queryDocuments()
  for (const d of docs) {
    const ret = await queryById(d._id)
    results.push(ret)
  }

  return await encryptString(JSON.stringify(results))
}

Deno.serve({ port }, async (request, info) => {
  const start = Date.now()
  const ret = await queryAll()
  const end = Date.now()

  const time = format(new Date(start), "yyyy-MM-dd HH:mm:ss.SSS")

  console.log(`${time} ${request.url} ${info.remoteAddr.hostname}:${info.remoteAddr.port} ${end - start}ms ${request.headers.get("User-Agent") || "-"}`)

  return new Response(JSON.stringify(ret), {
    headers: {
      "content-type": "application/json;charset=utf-8",
    }
  })
})
