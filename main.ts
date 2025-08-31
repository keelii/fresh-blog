import { serveDir } from "jsr:@std/http";
import {getCachedPosts} from "./utils/post.ts";
import {TsxRender} from "./tsx-render.tsx";
import { join } from "jsr:@std/path";
import {APP_PORT, APP_IS_PRD, APP_DISALLOW_SE} from "./config.ts"
import {NotFound, TextResponse} from "./utils/response.ts"

// if (APP_IS_PRD) {
  // await getCachedPosts(true)
// }

function isStaticPath(pathname: string) {
  return [".css", ".js",
    ".png", ".jpg", ".jpeg", ".gif",
    ".ico", ".svg",
    ".woff", ".woff2", ".ttf", ".eot"].some(ext => pathname.endsWith(ext));
}
function isDotFile(p: string) {
  return p.startsWith("/.")
}
function isNotValidExt(p: string) {
  return p.endsWith(".php")
}

async function handler(_req: Request): Promise<Response> {
  const url = new URL(_req.url)

  if (APP_DISALLOW_SE && url.pathname === "/robots.txt") {
    return TextResponse("User-agent: *\nDisallow: /");
  }
  if (isDotFile(url.pathname) || isNotValidExt(url.pathname)) {
    return NotFound();
  }
  if (isStaticPath(url.pathname)) {
    return serveDir(_req, {
      fsRoot: join(Deno.cwd(), "static"),
      urlRoot: "",
      showDirListing: false,
      enableCors: true,
      quiet: true,
    });
  }

  try {
    return TsxRender(url, _req)
  } catch (e: any) {
    return NotFound();
  }
}

Deno.serve({ port: APP_PORT }, handler);
