import { Handlers } from "$fresh/server.ts";
import { MetaInfo } from "../../utils/util.ts";
import { cfg } from "../../main.ts";

export const handler: Handlers<MetaInfo | null> = {
  async GET(_, ctx) {
    return new Response(JSON.stringify(cfg.getAll()), {
      headers: {
        "content-type": "application/json",
      },
    });
  },
};
