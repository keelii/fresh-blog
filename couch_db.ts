import {COUCHDB_AUTH, COUCHDB_URL} from "./config.ts"

const AUTH = btoa(COUCHDB_AUTH);

export async function checkDatabase() {
  const cost = Date.now()
  const res = await fetch(COUCHDB_URL, {
    method: "PUT",
    headers: {
      "Authorization": `Basic ${AUTH}`,
    },
  });
  const json = await res.text()
  console.log("Cost:", `${Date.now() - cost}ms`)
  console.log("checkDatabase:", json)
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
    console.log("Insert result:", data);
  } else {
    console.error(data)
  }
}
