import {BLOG_AUTHOR, BLOG_RSS, BLOG_URL} from "../config.ts";
import { Count } from "../types.ts";

export function Footer({ count }: { count: Count }) {
  return (
    <footer>
      <p>
        Copyright &copy; {new Date().getFullYear()} {BLOG_AUTHOR}, Powered by
        <a href="https://deno.com/deploy" target="_blank">Deno</a>
        |
        <a href={`${BLOG_URL}${BLOG_RSS}`}>
          <abbr title="RDF Site Summary">RSS</abbr>
        </a>
        <>
          | <span>PV: {count.pv?.value || ""}</span>
            <span>UV: {count.uv?.value?.length}</span>
        </>
      </p>
    </footer>
  );
}
