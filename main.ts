import {getCachedPosts} from "./utils/post.ts";
import {TsxRender} from "./tsx-render.tsx";
import {join} from "./deps.ts";
import {APP_PORT, IS_PRD} from "./config.ts";
import {NotFound} from "./utils/response.ts";

if (IS_PRD) {
  await getCachedPosts(true)
}


async function handler(_req: Request): Promise<Response> {
  const url = new URL(_req.url)

  try {
    if (url.pathname === "/favicon.ico") {
      const f = await Deno.readFile(join(Deno.cwd(), "/favicon.ico"))
      return new Response(f, {
        headers: { "content-type": "image/x-icon" },
      });
    } else {
      return TsxRender(url.pathname)
    }
  } catch (e: any) {
    return NotFound();
  }
}

Deno.serve({ port: APP_PORT }, handler);
