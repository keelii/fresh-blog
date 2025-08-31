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
function getClientIp(req: Request, connInfo: Deno.ServeHandlerInfo): string {
  const headers = req.headers;

  // 优先取代理头
  const xff = headers.get("x-forwarded-for");
  if (xff) {
    // 可能是多个逗号分隔的IP，取第一个
    return xff.split(",")[0].trim();
  }

  const xri = headers.get("x-real-ip");
  if (xri) {
    return xri;
  }

  const cf = headers.get("cf-connecting-ip");
  if (cf) {
    return cf;
  }

  return connInfo.remoteAddr.hostname;
}


async function handler(_req: Request, info: Deno.ServeHandlerInfo): Promise<Response> {
  const url = new URL(_req.url)
  const clientIp = getClientIp(_req, info)

  if (APP_DISALLOW_SE && url.pathname === "/robots.txt") {
    return TextResponse("User-agent: *\nDisallow: /");
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

  const hds = (await Array.fromAsync(_req.headers.entries())).map(([key, value]) => ({ key, value }))
  console.info("client:", clientIp, JSON.stringify(hds))

  if (isDotFile(url.pathname) || isNotValidExt(url.pathname)) {
    return NotFound();
  }

  try {
    return TsxRender(url, _req)
  } catch (e: any) {
    return NotFound();
  }
}

Deno.serve({ port: APP_PORT }, handler);
