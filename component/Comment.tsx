/** @jsx h */
import { h } from "preact";

export function Comment(props: any) {
  return (
    <div className="comment">
      <script
        src="https://utteranc.es/client.js"
        // @ts-ignore:
        repo="keelii/fresh-blog"
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
