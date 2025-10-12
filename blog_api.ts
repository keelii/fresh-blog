import {route, type Route} from "jsr:@std/http/unstable-route"
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
      signal: AbortSignal.timeout(5000),
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
export async function queryDocumentById(id: string) {
  const res = await dbFetch("_find", {
    method: "POST",
    body: JSON.stringify({
      selector: {
        "type": "plain",
        "_id": id
      },
      "limit": 1,
    })
  });

  if (res.docs && res.docs.length === 1) {
    return res.docs[0]
  } else {
    return null
  }
}
export async function queryPostById(id: string) {
  const doc = await queryDocumentById(decodeURIComponent(id))
  if (!doc) return null

  if (!doc.children || doc.children.length === 0) {
    console.log("No docs found")
    return null
  }

  const post = await dbFetch("_all_docs?include_docs=true", {
    method: "POST",
    body: JSON.stringify({ keys: doc.children })
  })

  if (post.error) {
    console.error("Query post error:", post)
    return null
  }
  if (!Array.isArray(post.rows)) {
    console.error("Query post rows invalid:", post)
    return null
  }

  const result = {
    path: doc.path,
    ctime: format(new Date(doc.ctime), "yyyy-MM-dd HH:mm:ss.SSS"),
    mtime: format(new Date(doc.mtime), "yyyy-MM-dd HH:mm:ss.SSS"),
    size: doc.size,
    content: post.rows.map(r => r.doc.data).join("")
  }
  return await encryptString(JSON.stringify(result))
}
export async function queryAllPosts() {
  let results: Array<{ _id: string, path: string, children: string[] }> = []

  const docs = await queryDocuments()
  for (const d of docs) {
    results.push({
      _id: d._id,
      path: d.path,
      children: d.children,
    })
  }
  const cipher = await encryptString(JSON.stringify(results))

  return cipher
}

// Deno.serve({ port }, async (request, info) => {
//   const start = Date.now()
//   const ret = await queryAll()
//   const end = Date.now()
//
//   const time = format(new Date(start), "yyyy-MM-dd HH:mm:ss.SSS")
//
//   console.log(`${time} ${request.url} ${info.remoteAddr.hostname}:${info.remoteAddr.port} ${end - start}ms ${request.headers.get("User-Agent") || "-"}`)
//
//   return new Response(JSON.stringify(ret), {
//     headers: {
//       "content-type": "application/json;charset=utf-8",
//     }
//   })
// })

function jsonResponse(json: Record<string, any>) {
  return new Response(JSON.stringify(json), {
    headers: {
      "content-type": "application/json;charset=utf-8",
    }
  })
}

 const routes: Route[] = [
   {
     pattern: new URLPattern({ pathname: "/posts" }),
     handler: async () => jsonResponse(await queryAllPosts()),
   },
   {
     pattern: new URLPattern({ pathname: "/posts/:id" }),
     handler: async (_req, params) => jsonResponse(await queryPostById(params?.pathname.groups.id)),
   },
 ];

Deno.serve(route(routes, (req) => {
  return new Response("Not found", { status: 404 });
}));
