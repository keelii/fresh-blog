import { cfg } from "../main.ts";

export function getPathKey(req: Request) {
  const pathname = new URL(req.url).pathname.substring(1);
  return pathname === "" ? ["/"] : pathname.split("/");
}

export async function countPageView(req: Request) {
  if (!cfg.enablePageView()) {
    return "";
  }
  const keys = ["page_view", ...getPathKey(req)];
  const kv = await Deno.openKv();
  const count = await kv.get(keys);

  // await kv.delete(["page_view", "/"])

  if (isNaN(Number(count.value))) {
    await kv.set(keys, 0);
    return 0;
  }

  if (!count.value) {
    await kv.set(keys, 1);
  } else {
    await kv.set(keys, count.value + 1);
  }

  const ret = await kv.get(keys);
  return ret.value;
}
