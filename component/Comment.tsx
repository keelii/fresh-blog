/** @jsx h */
import { h } from "https://esm.sh/v86/preact@10.8.1/deno/preact.js";

export function Comment(props: any) {
  return (
    <div className="comment">
      <script
        src="https://utteranc.es/client.js"
        // @ts-ignore:
        repo="keelii/blog"
        issue-term="title"
        label="评论"
        theme="github-light"
        crossOrigin="anonymous"
        async
      >
      </script>
    </div>
  );
}
