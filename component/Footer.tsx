/** @jsxImportSourceTypes npm:@types/react@^19.1.1 */
import {BLOG_AUTHOR, BLOG_RSS, BLOG_URL} from "../config.ts";

export function Footer({ count }: { count: number }) {
  return (
    <footer>
      <p>
        Copyright &copy; {new Date().getFullYear()} {BLOG_AUTHOR}, Powered by
        <a href="https://deno.com/deploy" target="_blank">Deno</a>
        |
        <a href={`${BLOG_URL}${BLOG_RSS}`}>
          <abbr title="RDF Site Summary">RSS</abbr>
        </a>
        {/*{count && (*/}
        {/*  <>*/}
        {/*    | <span>{count}</span>*/}
        {/*  </>*/}
        {/*)}*/}
      </p>
    </footer>
  );
}
