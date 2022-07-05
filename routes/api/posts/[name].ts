// import {Handlers} from "$fresh/server.ts"
// import {getPosts, parseToml} from "../../../utils/util.ts"
// import {POST_DIR} from "../../../main.ts"
// import {join} from "https://deno.land/std/path/mod.ts"
// import {render} from "https://deno.land/x/gfm@0.1.20/mod.ts"
//
//
// export const handler: Handlers = {
//   async GET(req, ctx) {
//     const file = join(POST_DIR, ctx.params.name + ".md");
//     const { content, ...toml } = parseToml(file);
//     const html = render(content);
//
//     const uuid = crypto.randomUUID();
//     return new Response(JSON.stringify({...toml, html}), {
//       headers: { "Content-Type": "application/json" },
//     });
//   },
// };
