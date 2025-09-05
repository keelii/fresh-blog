import {initKV} from "./kv.ts"

const pv = await initKV<number>("PV")

// await pv.deleteAll()
// await uv.deleteAll()

export async function updatePageView(k: string) {
  try {
    return await pv.inc(k)
  } catch (e: unknown) {
    console.error(e)
  }
  return null
}
