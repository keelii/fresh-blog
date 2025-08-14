import { cfg } from "../main.ts";

export function Footer({ count }: { count: number }) {
  return (
    <footer>
      <p>
        Copyright &copy; {new Date().getFullYear()} keelii, Powered by
        <a href="https://deno.com/deploy" target="_blank">Deno</a>
        |
        <a href={`${cfg.getConfig("url")}${cfg.getConfig("rss")}`}>
          <abbr title="RDF Site Summary">RSS</abbr>
        </a>
        {count && (
          <>
            | <span>{count}</span>
          </>
        )}
      </p>
    </footer>
  );
}
